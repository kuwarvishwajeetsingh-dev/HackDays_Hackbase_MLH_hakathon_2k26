import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ambulance, Building2, KeyRound, User, ArrowRight } from "lucide-react";
import { GlassCard, Button, Pill, SectionTitle } from "../components/ui.jsx";
import { useAppActions } from "../state/AppState.jsx";
import { ACCESS_CODES } from "../state/mockData.js";
import { cx } from "../utils/format.js";

export function Login() {
  const actions = useAppActions();
  const nav = useNavigate();

  const roles = useMemo(
    () => [
      {
        id: "user",
        title: "User Login",
        icon: User,
        helper: "Emergency request panel",
        codeHint: ACCESS_CODES.user,
      },
      {
        id: "driver",
        title: "Driver Login",
        icon: Ambulance,
        helper: "Ambulance driver console",
        codeHint: ACCESS_CODES.driver,
      },
      {
        id: "hospital",
        title: "Hospital Login",
        icon: Building2,
        helper: "Hospital control center",
        codeHint: ACCESS_CODES.hospital,
      },
    ],
    []
  );

  const [selectedRole, setSelectedRole] = useState("user");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const selected = roles.find((r) => r.id === selectedRole);

  function onSubmit(e) {
    e.preventDefault();
    setError("");
    const res = actions.loginWithCode(selectedRole, code);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    nav("/dashboard");
  }

  return (
    <div className="relative min-h-[calc(100vh-56px)] bg-ink-950">
      <div className="absolute inset-0 bg-aurora" />
      <div className="absolute inset-0 opacity-[0.18] [background-size:70px_70px] bg-grid" />

      <div className="relative mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-200 ring-1 ring-brand-400/25">
              <KeyRound className="h-4 w-4" />
              Role-based access (demo)
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight">
              Login to <span className="text-brand-200">CodeBlue AI</span>
            </h1>
            <p className="mt-3 max-w-xl text-slate-300/90">
              This is a frontend-only prototype with simulated network sync and AI analysis.
              Use one of the access codes below to experience the full emergency workflow.
            </p>

            <div className="mt-8 grid gap-3">
              {roles.map((r) => (
                <RoleCard
                  key={r.id}
                  role={r}
                  selected={selectedRole === r.id}
                  onClick={() => {
                    setSelectedRole(r.id);
                    setCode("");
                    setError("");
                  }}
                />
              ))}
            </div>
          </div>

          <GlassCard className="p-6 lg:p-8">
            <SectionTitle
              icon={selected?.icon}
              title={selected?.title}
              subtitle="Enter your access code to continue"
              right={<Pill tone="neutral">Demo</Pill>}
            />

            <form onSubmit={onSubmit} className="mt-6">
              <label className="block text-xs font-semibold text-slate-300">
                Enter your access code
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. USER-001"
                className={cx(
                  "mt-2 w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm outline-none transition",
                  "border-white/10 text-white placeholder:text-slate-500",
                  "focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/25"
                )}
                autoComplete="off"
              />

              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Hint: <span className="font-semibold text-slate-200">{selected?.codeHint}</span>
                </div>
                <Button type="button" variant="ghost" onClick={() => setCode(selected?.codeHint || "")}>
                  Autofill
                </Button>
              </div>

              {error ? (
                <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="mt-6 w-full py-3">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="mt-6 text-xs text-slate-500">
                Access codes are for demo only. No real authentication or backend.
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ role, selected, onClick }) {
  const Icon = role.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group flex w-full items-center justify-between rounded-2xl border p-4 text-left transition",
        selected
          ? "border-brand-400/40 bg-brand-500/10 shadow-[0_0_0_1px_rgba(59,130,246,.18),0_24px_80px_rgba(59,130,246,.12)]"
          : "border-white/10 bg-white/5 hover:bg-white/7"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cx(
            "rounded-xl p-2 ring-1 transition",
            selected ? "bg-brand-500/15 ring-brand-400/25" : "bg-white/5 ring-white/10"
          )}
        >
          <Icon className={cx("h-5 w-5", selected ? "text-brand-200" : "text-slate-200")} />
        </div>
        <div>
          <div className="text-sm font-bold">{role.title}</div>
          <div className="text-xs text-slate-400">{role.helper}</div>
        </div>
      </div>
      <Pill tone={selected ? "info" : "neutral"}>{role.codeHint}</Pill>
    </button>
  );
}

