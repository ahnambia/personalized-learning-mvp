import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  <button style={{ marginTop: 12 }} onClick={() => { logout(); nav("/login", { replace: true }); }}>
    Log out
  </button>
  
  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h2>Dashboard (protected)</h2>
      {user ? (
        <div>
          <div><b>ID:</b> {user.id}</div>
          <div><b>Email:</b> {user.email}</div>
          <div><b>Display Name:</b> {user.display_name ?? "—"}</div>
          <div><b>Created At:</b> {user.created_at}</div>
          <button style={{ marginTop: 12 }} onClick={logout}>Log out</button>
        </div>
      ) : (
        <div>…no user?</div>
      )}
    </div>
  );
}
