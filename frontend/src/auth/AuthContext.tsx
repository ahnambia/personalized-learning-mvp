import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

type User = {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signup: (email: string, password: string, displayName?: string | null) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const saveToken = useCallback((t: string | null) => {
    setToken(t);
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
  }, []);

  const refreshMe = useCallback(async () => {
    if (!token) { setUser(null); return; }
    const { ok, data } = await api<User>("/auth/me", { token });
    if (ok) setUser(data); else setUser(null);
  }, [token]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshMe();
      setLoading(false);
    })();
  }, [refreshMe]);

  const signup = useCallback(async (email: string, password: string, displayName?: string | null) => {
    const { ok, data } = await api<{ access_token: string }>("/auth/signup", {
      method: "POST",
      body: { email, password, display_name: displayName ?? null },
    });
    if (!ok) return false;
    saveToken((data as any).access_token);
    await refreshMe();
    return true;
  }, [refreshMe, saveToken]);

  const login = useCallback(async (email: string, password: string) => {
    const { ok, data } = await api<{ access_token: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    if (!ok) return false;
    saveToken((data as any).access_token);
    await refreshMe();
    return true;
  }, [refreshMe, saveToken]);

  const logout = useCallback(() => {
    saveToken(null);
    setUser(null);
  }, [saveToken]);

  const value = useMemo<AuthContextType>(() => ({
    user, token, loading, signup, login, logout, refreshMe
  }), [user, token, loading, signup, login, logout, refreshMe]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
