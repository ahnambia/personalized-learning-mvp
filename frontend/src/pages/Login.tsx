import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// Login page
export default function Login() {
  // Get auth functions and navigate/redirect helpers
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as any;

  // Form state
  const [email, setEmail] = useState("alice@example.com");
  const [password, setPassword] = useState("testpass123");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const ok = await login(email, password);
    setBusy(false);
    if (!ok) { setError("Invalid email or password"); return; }
    const dest = loc?.state?.from?.pathname || "/dashboard";
    nav(dest, { replace: true });
  };

  // Render
  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h2>Log in</h2>
      <form onSubmit={onSubmit}>
        <label>Email<br/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required /></label><br/>
        <label>Password<br/><input value={password} onChange={e=>setPassword(e.target.value)} type="password" required /></label><br/>
        {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
        <button type="submit" disabled={busy} style={{ marginTop: 12 }}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        No account? <Link to="/signup">Create one</Link>
      </div>
    </div>
  );
}
