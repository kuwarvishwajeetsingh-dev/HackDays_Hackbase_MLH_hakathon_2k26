import React, { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import { Splash } from "./pages/Splash.jsx";
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { useAppState } from "./state/AppState.jsx";

export function App() {
  const { auth } = useAppState();
  const [booted, setBooted] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();

  // IMPORTANT: keep this stable so Splash timer doesn't reset on state ticks.
  const handleBootDone = useCallback(() => setBooted(true), []);

  // Auto-redirect: if authed and on /login, send to dashboard
  useEffect(() => {
    if (auth.role && loc.pathname === "/login") nav("/dashboard", { replace: true });
  }, [auth.role, loc.pathname, nav]);

  if (!booted) return <Splash onDone={handleBootDone} />;

  return (
    <div className="min-h-full bg-ink-950 text-slate-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

