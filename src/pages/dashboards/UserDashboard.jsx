import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Brain,
  Hospital,
  Mic,
  Radar,
  Siren,
  Sparkles,
  MapPinned,
  Ambulance,
  CheckCircle2,
} from "lucide-react";
import { GlassCard, Button, Pill, SectionTitle, Metric } from "../../components/ui.jsx";
import { useAppActions, useAppState } from "../../state/AppState.jsx";
import { computeHospitalBadges } from "../../state/simApi.js";
import { cx } from "../../utils/format.js";

export function UserDashboard() {
  const { hospitals, incident } = useAppState();
  const actions = useAppActions();

  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState("");
  const recognitionRef = useRef(null);

  const bestHospitalId = useMemo(() => {
    const scored = hospitals
      .map((h) => ({ h, score: computeHospitalBadges(h, incident).matchScore }))
      .sort((a, b) => b.score - a.score);
    return scored[0]?.h?.id || hospitals[0]?.id;
  }, [hospitals, incident]);

  useEffect(() => {
    if (!incident.selectedHospitalId) actions.selectHospital(bestHospitalId);
  }, [actions, bestHospitalId, incident.selectedHospitalId]);

  const selectedHospital = hospitals.find((h) => h.id === incident.selectedHospitalId) || hospitals[0];

  function toggleMic() {
    setMicError("");
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMicError("SpeechRecognition not supported in this browser.");
      return;
    }
    if (!recognitionRef.current) {
      const r = new SR();
      r.lang = "en-US";
      r.interimResults = true;
      r.continuous = false;
      r.onresult = (e) => {
        let txt = "";
        for (let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript;
        actions.setIncidentText(txt.trim());
      };
      r.onend = () => setListening(false);
      r.onerror = () => {
        setListening(false);
        setMicError("Mic permission denied or unavailable.");
      };
      recognitionRef.current = r;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setListening(true);
      recognitionRef.current.start();
    }
  }

  const ai = incident.ai;
  const aiReady = ai && !ai.loading;

  return (
    <div className="relative min-h-[calc(100vh-56px)] bg-ink-950">
      <div className="absolute inset-0 bg-aurora" />
      <div className="absolute inset-0 opacity-[0.18] [background-size:72px_72px] bg-grid" />

      <div className="relative mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-400">CodeBlue AI – Emergency Panel</div>
            <div className="mt-1 text-3xl font-black tracking-tight">Smart Emergency Intake</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="info">
              <span className="inline-flex items-center gap-2">
                <Radar className="h-4 w-4" />
                Live network (simulated)
              </span>
            </Pill>
            <Pill tone={incident.ambulance.requested ? "ok" : "neutral"}>
              Ambulance: {incident.ambulance.requested ? "Active" : "Idle"}
            </Pill>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6">
              <SectionTitle
                icon={Siren}
                title="Smart Input"
                subtitle="Type or speak emergency details..."
                right={
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={toggleMic} className="relative">
                      {listening ? (
                        <span className="absolute -inset-2 animate-pingSoft rounded-2xl bg-brand-500/30" />
                      ) : null}
                      <Mic className={cx("h-4 w-4", listening ? "text-brand-200" : "")} />
                      {listening ? "Listening" : "Mic"}
                    </Button>
                  </div>
                }
              />

              <div className="mt-5">
                <textarea
                  value={incident.text}
                  onChange={(e) => actions.setIncidentText(e.target.value)}
                  placeholder="Type or speak emergency details..."
                  className={cx(
                    "min-h-[110px] w-full resize-none rounded-2xl border bg-white/5 px-4 py-3 text-sm outline-none transition",
                    "border-white/10 text-white placeholder:text-slate-500",
                    "focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/25"
                  )}
                />
                {micError ? (
                  <div className="mt-3 rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                    {micError}
                  </div>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => actions.analyzeEmergency(incident.text || "Accident, heavy bleeding")}
                  className="px-5 py-3"
                >
                  <Brain className="h-4 w-4" />
                  Analyze Emergency
                </Button>
                <Pill tone="neutral">
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand-200" />
                    Powered by Gemini AI (simulated)
                  </span>
                </Pill>
                {ai?.loading ? <Pill tone="info">Analyzing…</Pill> : null}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <SectionTitle
                icon={Brain}
                title="Gemini AI Simulation"
                subtitle="Clinical triage signals derived from the emergency narrative"
              />

              {!ai ? (
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
                  Enter details and click <span className="font-semibold text-white">Analyze Emergency</span> to
                  generate AI output cards.
                </div>
              ) : ai.loading ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {ai.flags.map((f) => (
                    <div
                      key={f.label}
                      className={cx(
                        "rounded-2xl border bg-white/5 p-4 transition",
                        f.ok ? "border-emerald-400/20" : "border-white/10"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-bold">{f.label}</div>
                        <CheckCircle2 className={cx("h-5 w-5", f.ok ? "text-emerald-300" : "text-slate-600")} />
                      </div>
                      <div className="mt-2 text-xs text-slate-400">{ai.summary}</div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            <GlassCard className="p-6">
              <SectionTitle
                icon={Hospital}
                title="Hospital Results"
                subtitle="Capacity + blood availability matched to triage signals"
                right={<Pill tone="info">Best match highlighted</Pill>}
              />

              <div className="mt-5 grid gap-3">
                {hospitals.map((h) => {
                  const b = computeHospitalBadges(h, incident);
                  const isBest = h.id === bestHospitalId;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => actions.selectHospital(h.id)}
                      className={cx(
                        "flex w-full flex-col gap-2 rounded-2xl border p-4 text-left transition sm:flex-row sm:items-center sm:justify-between",
                        isBest
                          ? "border-brand-400/35 bg-brand-500/10"
                          : "border-white/10 bg-white/5 hover:bg-white/7"
                      )}
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-sm font-extrabold">{h.name}</div>
                          {isBest ? <Pill tone="info">Best Match</Pill> : null}
                          <Pill tone={h.status === "accepting" ? "ok" : "crit"}>
                            {h.status === "accepting" ? "Accepting" : "Overloaded"}
                          </Pill>
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          Distance: <span className="font-semibold text-slate-200">{h.distanceKm} km</span> • ICU{" "}
                          <span className="font-semibold text-slate-200">
                            {h.icuAvailable}/{h.icuTotal}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Pill tone={b.bloodStatus === "green" ? "ok" : b.bloodStatus === "yellow" ? "warn" : "crit"}>
                          Blood {b.bloodNeed}: {b.bloodStatus.toUpperCase()}
                        </Pill>
                        <Pill tone={b.icuOk ? "ok" : "crit"}>ICU: {b.icuOk ? "Available" : "Full"}</Pill>
                      </div>
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-6">
              <SectionTitle
                icon={Ambulance}
                title="Ambulance Booking"
                subtitle="Dispatch workflow (simulated)"
              />

              <div className="mt-5 grid gap-3">
                <Metric label="Driver" value="DRV-001" hint="Assigned from nearest fleet node" />
                <Metric label="ETA" value={`${incident.ambulance.etaMin} mins`} hint="Traffic-aware estimate (sim)" />
                <Metric
                  label="Status"
                  value={humanAmbStatus(incident.ambulance.status)}
                  hint="Real-time updates visible to driver + hospital"
                />
              </div>

              <Button
                className="mt-5 w-full py-3"
                variant={incident.ambulance.requested ? "ghost" : "primary"}
                onClick={() => actions.requestAmbulance()}
                disabled={incident.ambulance.requested}
              >
                {incident.ambulance.requested ? "Ambulance Requested" : "Request Ambulance"}
              </Button>
            </GlassCard>

            <GlassCard className="p-6">
              <SectionTitle
                icon={MapPinned}
                title="Map"
                subtitle="Routing view placeholder (Google Maps)"
              />

              <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-slate-300">
                  <div>Map API Key: <span className="font-semibold text-slate-200">YOUR_API_KEY</span></div>
                  <Pill tone="neutral">Markers: User + Hospitals</Pill>
                </div>
                <div className="relative h-64">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-emerald-500/5" />
                  <FakeMap selectedHospital={selectedHospital?.name} />
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
      <div className="mt-3 h-3 w-full animate-pulse rounded bg-white/10" />
      <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-white/10" />
    </div>
  );
}

function FakeMap({ selectedHospital }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-6 top-7 rounded-full bg-brand-500/25 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-brand-400/25">
        USER
      </div>
      <div className="absolute right-8 top-14 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-400/25">
        HOSPITAL A
      </div>
      <div className="absolute right-24 bottom-14 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-100 ring-1 ring-amber-400/25">
        HOSPITAL B
      </div>
      <div className="absolute left-14 bottom-10 rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-100 ring-1 ring-red-400/25">
        HOSPITAL C
      </div>

      <div className="absolute inset-x-6 bottom-5 rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 text-xs text-slate-300 backdrop-blur">
        Routing to: <span className="font-semibold text-white">{selectedHospital || "—"}</span>
      </div>
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

