import { clamp } from "../utils/format.js";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function simulateGeminiAnalyze(text) {
  await sleep(1100 + Math.random() * 900);

  const t = (text || "").toLowerCase();
  const bleeding = t.includes("bleed") || t.includes("blood");
  const accident = t.includes("accident") || t.includes("crash") || t.includes("injury");

  const priority = bleeding || accident ? "HIGH" : "MEDIUM";
  const bloodRequired = bleeding ? "O-" : "A+";

  const needs = [];
  if (accident) needs.push("Trauma Care Needed");
  if (bleeding) needs.push("Blood Required");
  needs.push("ICU Required");

  return {
    summary: "Powered by Gemini AI (simulated)",
    flags: [
      { label: "ICU Required", ok: true },
      { label: "Trauma Care Needed", ok: accident },
      { label: `Blood Required: ${bloodRequired}`, ok: bleeding },
      { label: `Priority: 🔴 ${priority}`, ok: priority === "HIGH" },
    ],
    priority,
    bloodRequired,
    needs,
  };
}

export function computeHospitalBadges(h, incident) {
  const bloodNeed = incident?.ai?.bloodRequired || incident?.patient?.bloodRequired || "O-";
  const bloodStatus = h.blood[bloodNeed] || "yellow";
  const icuOk = h.icuAvailable > 0 && h.status !== "overloaded";
  const matchScore =
    (icuOk ? 35 : 0) +
    (bloodStatus === "green" ? 35 : bloodStatus === "yellow" ? 15 : 0) +
    clamp(20 - h.distanceKm, 0, 20);

  return { bloodNeed, bloodStatus, icuOk, matchScore };
}

