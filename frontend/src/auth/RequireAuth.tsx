import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;
  return <>{children}</>;
};
