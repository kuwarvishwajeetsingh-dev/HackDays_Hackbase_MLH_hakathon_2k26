import React, { useEffect, useMemo, useState } from "react";
import { Activity, ShieldAlert } from "lucide-react";
import { GlassCard, Pill } from "../components/ui.jsx";
import { cx } from "../utils/format.js";

export function Splash({ onDone }) {
  const steps = useMemo(
    () => [
      "Connecting to hospital network...",
      "Syncing emergency data...",
      "Launching AI engine...",
    ],
    []
  );
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t1 = setInterval(() => setIdx((v) => (v + 1) % steps.length), 700);
    const t2 = setTimeout(() => onDone?.(), 2400);
    return () => {
      clearInterval(t1);
      clearTimeout(t2);
    };
  }, [onDone, steps.length]);

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-ink-950">
      <div className="absolute inset-0 bg-aurora" />
      <div className="absolute inset-0 opacity-[0.22] [background-size:60px_60px] bg-grid" />

      <div className={cx("relative mx-auto w-full max-w-lg px-6 transition duration-700", visible ? "opacity-100" : "opacity-0")}>
        <GlassCard className="p-8">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pingSoft rounded-[28px] bg-brand-500/30 blur-md" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-[28px] bg-white/5 ring-1 ring-white/10">
                <Activity className="h-7 w-7 text-brand-200 animate-heartbeat" />
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="text-3xl font-black tracking-tight">CodeBlue AI</div>
            <div className="mt-2 text-sm text-slate-300/90">
              Initializing Emergency Network...
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <Pill tone="info">
              <span className="inline-flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                Secure session
              </span>
            </Pill>
            <Pill tone="neutral">v0.1 prototype</Pill>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-200">Boot sequence</div>
              <div className="text-xs text-slate-400">{idx + 1}/3</div>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full w-full origin-left rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-emerald-400 transition"
                style={{ transform: `scaleX(${(idx + 1) / 3})` }}
              />
            </div>
            <div className="mt-3 text-sm text-slate-300">{steps[idx]}</div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Training-safe demo mode • No real patient data
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

