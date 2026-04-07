import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Activity, Home, LayoutDashboard, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "./ui.jsx";
import { useAppActions, useAppState } from "../state/AppState.jsx";
import { getTheme, toggleTheme } from "../utils/theme.js";
import { cx } from "../utils/format.js";

export function Navbar() {
  const { auth } = useAppState();
  const actions = useAppActions();
  const loc = useLocation();
  const nav = useNavigate();
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    setTheme(getTheme());
  }, [loc.pathname]);

  const isAuthed = Boolean(auth.role);
  const dashboardHref = auth.role ? "/dashboard" : "/login";

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="group flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 animate-pingSoft rounded-2xl bg-brand-500/25 blur-sm" />
            <div className="relative rounded-2xl bg-brand-500/15 p-2 ring-1 ring-brand-400/25">
              <Activity className="h-5 w-5 text-brand-200" />
            </div>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-tight">CodeBlue AI</div>
            <div className="text-[11px] text-slate-400 group-hover:text-slate-300 transition">
              Smart Emergency Routing System
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <NavLink to="/" icon={Home} active={loc.pathname === "/"} label="Home" />
          <NavLink
            to={dashboardHref}
            icon={LayoutDashboard}
            active={loc.pathname.startsWith("/dashboard")}
            label="Dashboard"
          />

          <div className="mx-2 h-6 w-px bg-white/10" />

          <Button
            variant="ghost"
            onClick={() => setTheme(toggleTheme())}
            className="px-3"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </Button>

          {isAuthed ? (
            <Button
              variant="ghost"
              onClick={() => {
                actions.logout();
                nav("/login");
              }}
              className="px-3"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => nav("/login")} className="px-3">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function NavLink({ to, icon: Icon, label, active }) {
  return (
    <Link
      to={to}
      className={cx(
        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
        active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

