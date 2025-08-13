import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("newuser@example.com");
  const [password, setPassword] = useState("testpass123");
  const [displayName, setDisplayName] = useState("New User");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const ok = await signup(email, password, displayName);
    setBusy(false);
    if (!ok) { setError("Signup failed (email may already exist)"); return; }
    nav("/dashboard", { replace: true });
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h2>Create account</h2>
      <form onSubmit={onSubmit}>
        <label>Email<br/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required /></label><br/>
        <label>Password<br/><input value={password} onChange={e=>setPassword(e.target.value)} type="password" required minLength={8} /></label><br/>
        <label>Display name (optional)<br/><input value={displayName} onChange={e=>setDisplayName(e.target.value)} /></label><br/>
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
