import React, { useMemo } from "react";
import { Route, Siren, Map, Flag, Hospital, ArrowRightCircle } from "lucide-react";
import { GlassCard, Button, Pill, SectionTitle, Metric } from "../../components/ui.jsx";
import { useAppActions, useAppState } from "../../state/AppState.jsx";

export function DriverDashboard() {
  const { incident, hospitals } = useAppState();
  const actions = useAppActions();

  const hospital = useMemo(
    () => hospitals.find((h) => h.id === incident.selectedHospitalId) || hospitals[0],
    [hospitals, incident.selectedHospitalId]
  );

  const patient = incident.ai
    ? {
        condition: incident.text || incident.patient.condition,
        priority: incident.ai.priority,
        bloodRequired: incident.ai.bloodRequired,
      }
    : incident.patient;

  return (
    <div className="relative min-h-[calc(100vh-56px)] bg-ink-950">
      <div className="absolute inset-0 bg-aurora" />
      <div className="absolute inset-0 opacity-[0.18] [background-size:72px_72px] bg-grid" />

      <div className="relative mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-400">CodeBlue AI – Driver Console</div>
            <div className="mt-1 text-3xl font-black tracking-tight">Active Dispatch</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={incident.ambulance.status === "idle" ? "neutral" : "info"}>
              Status: {humanAmbStatus(incident.ambulance.status)}
            </Pill>
            <Pill tone={patient.priority === "HIGH" ? "crit" : "warn"}>
              Priority: {patient.priority === "HIGH" ? "🔴 HIGH" : "🟡 MEDIUM"}
            </Pill>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6">
              <SectionTitle
                icon={Siren}
                title="Patient Snapshot"
                subtitle="Condition summary broadcast from emergency intake"
              />
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Metric label="Condition" value={truncate(patient.condition, 22)} hint="Voice/typed input" />
                <Metric label="Blood Needed" value={patient.bloodRequired || "—"} hint="Highlighted for hospital" />
                <Metric label="Destination" value={truncate(hospital?.name || "—", 18)} hint="Best match routing" />
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <SectionTitle icon={Map} title="Route Map" subtitle="Visual route preview (simulated)" />
              <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-slate-300">
                  <div>Route: Pickup → {hospital?.name}</div>
                  <Pill tone="neutral">Map placeholder</Pill>
                </div>
                <div className="relative h-64">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-red-500/5" />
                  <RouteViz status={incident.ambulance.status} />
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-6">
              <SectionTitle icon={Route} title="Trip Controls" subtitle="Update milestones" />
              <div className="mt-5 grid gap-3">
                <Button
                  className="w-full py-3"
                  onClick={() => actions.setAmbulanceStatus("on_the_way")}
                  disabled={!incident.ambulance.requested}
                >
                  Start Ride <ArrowRightCircle className="h-4 w-4" />
                </Button>
                <Button
                  className="w-full py-3"
                  variant="ghost"
                  onClick={() => actions.setAmbulanceStatus("picked_up")}
                  disabled={!incident.ambulance.requested}
                >
                  Reached Pickup <Flag className="h-4 w-4" />
                </Button>
                <Button
                  className="w-full py-3"
                  variant="ghost"
                  onClick={() => actions.setAmbulanceStatus("en_route")}
                  disabled={!incident.ambulance.requested}
                >
                  Heading to Hospital <Hospital className="h-4 w-4" />
                </Button>
                <Button
                  className="w-full py-3"
                  variant="ghost"
                  onClick={() => actions.setAmbulanceStatus("arrived")}
                  disabled={!incident.ambulance.requested}
                >
                  Reached Hospital <Hospital className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                Current: <span className="font-semibold text-white">{humanAmbStatus(incident.ambulance.status)}</span>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <SectionTitle icon={Hospital} title="Hospital Handoff" subtitle="Arrival readiness" />
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-400">ICU Availability</div>
                  <div className="mt-1 text-lg font-bold">
                    {hospital?.icuAvailable}/{hospital?.icuTotal}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-400">Emergency Status</div>
                  <div className="mt-1 text-lg font-bold">
                    {hospital?.status === "accepting" ? "Accepting" : "Overloaded"}
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

function RouteViz({ status }) {
  const step = status === "picked_up" ? 2 : status === "en_route" ? 3 : status === "arrived" ? 4 : status === "on_the_way" ? 1 : 0;
  return (
    <div className="absolute inset-0 p-6">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span>Pickup</span>
        <span>Hospital</span>
      </div>
      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-emerald-400 transition"
          style={{ width: `${Math.max(5, step * 25)}%` }}
        />
      </div>
      <div className="mt-6 grid gap-2">
        <Step active={step >= 1} text="Start ride" />
        <Step active={step >= 2} text="Reached pickup" />
        <Step active={step >= 3} text="Heading to hospital" />
        <Step active={step >= 4} text="Arrived at hospital" />
      </div>
    </div>
  );
}

function Step({ active, text }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
      <span className={active ? "text-white font-semibold" : "text-slate-400"}>{text}</span>
      <Pill tone={active ? "ok" : "neutral"}>{active ? "Done" : "Pending"}</Pill>
    </div>
  );
}

function humanAmbStatus(s) {
  if (s === "on_the_way") return "On the way";
  if (s === "picked_up") return "Reached pickup";
  if (s === "en_route") return "Heading to hospital";
  if (s === "arrived") return "Arrived at hospital";
  return "Idle";
}

function truncate(s, n) {
  const v = String(s || "");
  if (v.length <= n) return v;
  return v.slice(0, n - 1) + "…";
}

