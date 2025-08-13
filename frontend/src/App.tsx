import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { RequireAuth } from "./auth/RequireAuth";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

// App component
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
          <Link to="/" style={{ marginRight: 12 }}>Home</Link>
          <Link to="/dashboard" style={{ marginRight: 12 }}>Dashboard</Link>
          <Link to="/login" style={{ marginRight: 12 }}>Login</Link>
          <Link to="/signup">Signup</Link>
        </nav>
        <Routes>
          <Route path="/" element={<div style={{ padding: 16 }}>Hello 👋</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
