import React, { useMemo } from "react";
import {
  BedDouble,
  Droplets,
  ToggleLeft,
  ToggleRight,
  Ambulance,
  Clock,
  Plus,
  Minus,
} from "lucide-react";
import { GlassCard, Button, Pill, SectionTitle, Metric } from "../../components/ui.jsx";
import { useAppActions, useAppState } from "../../state/AppState.jsx";
import { BLOOD_GROUPS } from "../../state/mockData.js";
import { timeAgoFromMs, cx } from "../../utils/format.js";

export function HospitalDashboard() {
  const { hospitals, incident, realtime } = useAppState();
  const actions = useAppActions();

  const hospital = hospitals.find((h) => h.bestMatch) || hospitals[0];
  const msAgo = realtime.now - realtime.lastUpdatedAt;

  const bloodNeed = incident.ai?.bloodRequired || incident.patient.bloodRequired || "O-";
  const incoming = incident.ambulance.requested;
  const eta = incident.ambulance.etaMin;

  const triage = useMemo(() => {
    const condition = incident.text || incident.patient.condition;
    const priority = incident.ai?.priority || incident.patient.priority;
    const needs = incident.ai?.needs || incident.patient.needs;
    return { condition, priority, needs };
  }, [incident]);

  return (
    <div className="relative min-h-[calc(100vh-56px)] bg-ink-950">
      <div className="absolute inset-0 bg-aurora" />
      <div className="absolute inset-0 opacity-[0.18] [background-size:72px_72px] bg-grid" />

      <div className="relative mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-400">CodeBlue AI – Hospital Control Center</div>
            <div className="mt-1 text-3xl font-black tracking-tight">{hospital.name}</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={hospital.status === "accepting" ? "ok" : "crit"}>
              {hospital.status === "accepting" ? "Accepting" : "Overloaded"}
            </Pill>
            <Pill tone="neutral">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {timeAgoFromMs(msAgo)}
              </span>
            </Pill>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6">
              <SectionTitle
                icon={BedDouble}
                title="ICU Control"
                subtitle="Adjust available beds (shared realtime)"
                right={<Pill tone="info">Live</Pill>}
              />
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Metric label="Available" value={hospital.icuAvailable} hint={`Total capacity: ${hospital.icuTotal}`} />
                <Metric
                  label="Utilization"
                  value={`${Math.round(((hospital.icuTotal - hospital.icuAvailable) / hospital.icuTotal) * 100)}%`}
                  hint="Simulated"
                />
                <Metric label="Routing score" value={hospital.bestMatch ? "Best" : "—"} hint="User sees best match tag" />
              </div>
              <div className="mt-5 flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => actions.setIcuAvailable(hospital.id, hospital.icuAvailable - 1)}
                >
                  <Minus className="h-4 w-4" /> Decrease
                </Button>
                <Button
                  onClick={() => actions.setIcuAvailable(hospital.id, hospital.icuAvailable + 1)}
                >
                  <Plus className="h-4 w-4" /> Increase
                </Button>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <SectionTitle
                icon={Droplets}
                title="Blood Bank Grid"
                subtitle="Update group availability (green/yellow/red)"
              />
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {BLOOD_GROUPS.map((g) => {
                  const status = hospital.blood[g] || "yellow";
                  const tone = status === "green" ? "ok" : status === "yellow" ? "warn" : "crit";
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => actions.setBloodStatus(hospital.id, g, next(status))}
                      className={cx(
                        "rounded-2xl border p-4 text-left transition",
                        status === "green"
                          ? "border-emerald-400/20 bg-emerald-500/10"
                          : status === "yellow"
                          ? "border-amber-400/20 bg-amber-500/10"
                          : "border-red-400/20 bg-red-500/10"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-extrabold">{g}</div>
                        <Pill tone={tone}>{status.toUpperCase()}</Pill>
                      </div>
                      <div className="mt-2 text-xs text-slate-300/90">
                        Click to cycle availability
                      </div>
                      {g === bloodNeed ? (
                        <div className="mt-3 text-xs font-semibold text-white">
                          Needed for incoming case
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-6">
              <SectionTitle icon={ToggleLeft} title="Emergency Toggle" subtitle="Control intake status" />
              <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <div className="text-sm font-bold">
                    {hospital.status === "accepting" ? "Accepting" : "Overloaded"}
                  </div>
                  <div className="text-xs text-slate-400">Affects best-match routing and UI badges</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    actions.setEmergencyStatus(
                      hospital.id,
                      hospital.status === "accepting" ? "overloaded" : "accepting"
                    )
                  }
                  className="rounded-2xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition"
                  aria-label="Toggle emergency status"
                >
                  {hospital.status === "accepting" ? (
                    <ToggleRight className="h-7 w-7 text-emerald-300" />
                  ) : (
                    <ToggleLeft className="h-7 w-7 text-red-300" />
                  )}
                </button>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <SectionTitle
                icon={Ambulance}
                title="Incoming Ambulance"
                subtitle="Dispatch feed (shared realtime)"
                right={
                  <Pill tone={incoming ? "info" : "neutral"}>
                    {incoming ? "LIVE" : "None"}
                  </Pill>
                }
              />

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-400">Patient condition</div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {triage.condition || "—"}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-slate-400">ETA</div>
                    <div className="mt-1 text-lg font-bold">{incoming ? `${eta} mins` : "—"}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-slate-400">Blood need</div>
                    <div className="mt-1 text-lg font-bold">
                      <span className="text-red-200">{bloodNeed}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-400">Priority</div>
                  <div className="mt-1">
                    <Pill tone={triage.priority === "HIGH" ? "crit" : "warn"}>
                      {triage.priority === "HIGH" ? "🔴 HIGH" : "🟡 MEDIUM"}
                    </Pill>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(triage.needs || []).map((n) => (
                      <Pill key={n} tone="info">
                        {n}
                      </Pill>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function next(s) {
  if (s === "green") return "yellow";
  if (s === "yellow") return "red";
  return "green";
}

