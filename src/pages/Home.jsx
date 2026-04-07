import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, MapPinned, Siren, Sparkles } from "lucide-react";
import { GlassCard, Button, Pill } from "../components/ui.jsx";
import { useAppState } from "../state/AppState.jsx";

export function Home() {
  const nav = useNavigate();
  const { auth } = useAppState();
  const go = () => nav(auth.role ? "/dashboard" : "/login");

  return (
    <div className="relative min-h-[calc(100vh-56px)] bg-ink-950">
      <div className="absolute inset-0 bg-aurora" />
      <div className="absolute inset-0 opacity-[0.2] [background-size:72px_72px] bg-grid" />

      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 ring-1 ring-white/10">
              <Sparkles className="h-4 w-4 text-brand-200" />
              Frontend-only prototype • Simulated AI & routing
            </div>
            <h1 className="mt-4 text-5xl font-black tracking-tight">
              CodeBlue AI
              <span className="block text-brand-200">Smart Emergency Routing System</span>
            </h1>
            <p className="mt-4 text-slate-300/90">
              Experience a full emergency workflow: smart intake → AI triage →
              best hospital match → ambulance dispatch → hospital capacity control.
              Built for realistic demos and screenshots.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button onClick={go} className="px-6 py-3">
                Open dashboard <ArrowRight className="h-4 w-4" />
              </Button>
              <Pill tone="crit">Critical alerts</Pill>
              <Pill tone="ok">Availability signals</Pill>
              <Pill tone="info">Blue primary UI</Pill>
            </div>
          </div>

          <div className="w-full max-w-xl">
            <GlassCard className="p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <Feature
                  icon={Siren}
                  title="Emergency intake"
                  desc="Type or speak details with mic pulse and live UI feedback."
                />
                <Feature
                  icon={Brain}
                  title="Gemini AI (sim)"
                  desc="Simulated analysis outputs ICU, trauma, blood, priority."
                />
                <Feature
                  icon={MapPinned}
                  title="Smart routing"
                  desc="Best-match hospital ranking with markers and map panel."
                />
                <Feature
                  icon={Sparkles}
                  title="Realtime feel"
                  desc="Global shared state updates across all roles instantly."
                />
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2">
        <div className="rounded-xl bg-brand-500/15 p-2 ring-1 ring-brand-400/25">
          <Icon className="h-4 w-4 text-brand-200" />
        </div>
        <div className="text-sm font-bold">{title}</div>
      </div>
      <div className="mt-2 text-sm text-slate-400">{desc}</div>
    </div>
  );
}

