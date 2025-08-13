import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { api } from "../lib/api";

export default function Signup() {
  // We only need refreshMe from the context here, not signup()
  const { refreshMe } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("newuser@example.com");
  const [password, setPassword] = useState("testpass123");
  const [displayName, setDisplayName] = useState("New User");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await api<{ access_token: string; token_type: "bearer" }>("/auth/signup", {
        method: "POST",
        body: { email, password, display_name: displayName || null },
      });

      if (!res.ok) {
        if (res.status === 409) {
          setError("Email already registered");
        } else {
          setError("Signup failed. Please try again.");
        }
        return;
      }

      // Save token so subsequent calls include Authorization
      localStorage.setItem("token", res.data.access_token);

      // Populate user state from /auth/me, then go to dashboard
      await refreshMe();
      nav("/dashboard", { replace: true });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h2>Create account</h2>
      <form onSubmit={onSubmit}>
        <label>
          Email
          <br />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <br />
        <label>
          Password
          <br />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={8}
          />
        </label>
        <br />
        <label>
          Display name (optional)
          <br />
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>
        <br />
        {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
        <button type="submit" disabled={busy} style={{ marginTop: 12 }}>
          {busy ? "Creating…" : "Sign up"}
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}
