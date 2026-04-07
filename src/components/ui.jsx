import React from "react";
import { cx } from "../utils/format.js";

export function GlassCard({ className, children }) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-glass backdrop-blur-xl",
        "dark:border-white/10 dark:bg-white/5",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function Button({ className, variant = "primary", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-400/60 disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    primary:
      "bg-brand-500 text-white shadow-glow hover:bg-brand-400 active:bg-brand-600",
    ghost:
      "bg-white/0 text-slate-200 hover:bg-white/10 active:bg-white/15 dark:text-slate-100",
    danger:
      "bg-red-500/90 text-white hover:bg-red-500 active:bg-red-600 shadow-[0_0_0_1px_rgba(239,68,68,.25),0_24px_80px_rgba(239,68,68,.15)]",
  };
  return <button className={cx(base, styles[variant], className)} {...props} />;
}

export function Pill({ tone = "info", children }) {
  const tones = {
    info: "bg-brand-500/15 text-brand-200 ring-1 ring-brand-400/25",
    ok: "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/25",
    warn: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/25",
    crit: "bg-red-500/15 text-red-200 ring-1 ring-red-400/25",
    neutral: "bg-white/10 text-slate-200 ring-1 ring-white/15",
  };
  return (
    <span className={cx("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}

export function Metric({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-slate-300/90">{label}</div>
      <div className="mt-1 text-2xl font-bold tracking-tight">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-400">{hint}</div> : null}
    </div>
  );
}

export function SectionTitle({ icon: Icon, title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {Icon ? (
          <div className="mt-0.5 rounded-xl bg-brand-500/15 p-2 ring-1 ring-brand-400/25">
            <Icon className="h-5 w-5 text-brand-200" />
          </div>
        ) : null}
        <div>
          <div className="text-lg font-bold tracking-tight">{title}</div>
          {subtitle ? <div className="text-sm text-slate-300/90">{subtitle}</div> : null}
        </div>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

