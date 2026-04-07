import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { ACCESS_CODES, initialHospitals, initialIncident } from "./mockData.js";
import { simulateGeminiAnalyze } from "./simApi.js";
import { clamp } from "../utils/format.js";

const ROLE_KEY = "codeblue.role";

const AppStateContext = createContext(null);
const AppActionsContext = createContext(null);

function loadRole() {
  return localStorage.getItem(ROLE_KEY) || "";
}

function saveRole(role) {
  if (!role) localStorage.removeItem(ROLE_KEY);
  else localStorage.setItem(ROLE_KEY, role);
}

function reducer(state, action) {
  switch (action.type) {
    case "auth/login": {
      return { ...state, auth: { ...state.auth, role: action.role } };
    }
    case "auth/logout": {
      return {
        ...state,
        auth: { ...state.auth, role: "" },
        incident: { ...state.incident, text: "", ai: null, ambulance: { ...state.incident.ambulance, requested: false, status: "idle" } },
      };
    }
    case "incident/setText": {
      return { ...state, incident: { ...state.incident, text: action.text } };
    }
    case "incident/aiStart": {
      return { ...state, incident: { ...state.incident, ai: { loading: true } } };
    }
    case "incident/aiDone": {
      return { ...state, incident: { ...state.incident, ai: { ...action.payload, loading: false } } };
    }
    case "incident/selectHospital": {
      return { ...state, incident: { ...state.incident, selectedHospitalId: action.hospitalId } };
    }
    case "ambulance/request": {
      return {
        ...state,
        incident: {
          ...state.incident,
          ambulance: { ...state.incident.ambulance, requested: true, status: "on_the_way", etaMin: 5 },
        },
      };
    }
    case "ambulance/setStatus": {
      return {
        ...state,
        incident: { ...state.incident, ambulance: { ...state.incident.ambulance, status: action.status } },
      };
    }
    case "hospital/setIcuAvailable": {
      return {
        ...state,
        hospitals: state.hospitals.map((h) =>
          h.id === action.hospitalId
            ? { ...h, icuAvailable: clamp(action.value, 0, h.icuTotal) }
            : h
        ),
      };
    }
    case "hospital/setBloodStatus": {
      return {
        ...state,
        hospitals: state.hospitals.map((h) =>
          h.id === action.hospitalId
            ? { ...h, blood: { ...h.blood, [action.group]: action.status } }
            : h
        ),
      };
    }
    case "hospital/setEmergencyStatus": {
      return {
        ...state,
        hospitals: state.hospitals.map((h) =>
          h.id === action.hospitalId ? { ...h, status: action.status } : h
        ),
      };
    }
    case "rt/tick": {
      return { ...state, realtime: { ...state.realtime, now: Date.now(), lastUpdatedAt: Date.now() } };
    }
    case "rt/jitter": {
      return {
        ...state,
        hospitals: state.hospitals.map((h) => {
          if (Math.random() < 0.6) return h;
          const delta = Math.random() < 0.5 ? -1 : 1;
          return { ...h, icuAvailable: clamp(h.icuAvailable + delta, 0, h.icuTotal) };
        }),
      };
    }
    default:
      return state;
  }
}

const initialState = {
  auth: { role: loadRole() },
  hospitals: initialHospitals,
  incident: initialIncident,
  realtime: { now: Date.now(), lastUpdatedAt: Date.now() },
};

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    saveRole(state.auth.role);
  }, [state.auth.role]);

  // realtime simulation feel
  useEffect(() => {
    const tick = setInterval(() => dispatch({ type: "rt/tick" }), 1000);
    const jitter = setInterval(() => dispatch({ type: "rt/jitter" }), 5000);
    return () => {
      clearInterval(tick);
      clearInterval(jitter);
    };
  }, []);

  const actions = useMemo(() => {
    return {
      loginWithCode: (role, code) => {
        const expected = ACCESS_CODES[role];
        if (!expected) return { ok: false, error: "Unknown role." };
        if ((code || "").trim().toUpperCase() !== expected) return { ok: false, error: "Invalid access code." };
        dispatch({ type: "auth/login", role });
        return { ok: true };
      },
      logout: () => dispatch({ type: "auth/logout" }),
      setIncidentText: (text) => dispatch({ type: "incident/setText", text }),
      analyzeEmergency: async (text) => {
        dispatch({ type: "incident/aiStart" });
        const payload = await simulateGeminiAnalyze(text);
        dispatch({ type: "incident/aiDone", payload });
      },
      selectHospital: (hospitalId) => dispatch({ type: "incident/selectHospital", hospitalId }),
      requestAmbulance: () => dispatch({ type: "ambulance/request" }),
      setAmbulanceStatus: (status) => dispatch({ type: "ambulance/setStatus", status }),
      setIcuAvailable: (hospitalId, value) =>
        dispatch({ type: "hospital/setIcuAvailable", hospitalId, value }),
      setBloodStatus: (hospitalId, group, status) =>
        dispatch({ type: "hospital/setBloodStatus", hospitalId, group, status }),
      setEmergencyStatus: (hospitalId, status) =>
        dispatch({ type: "hospital/setEmergencyStatus", hospitalId, status }),
    };
  }, []);

  return (
    <AppStateContext.Provider value={state}>
      <AppActionsContext.Provider value={actions}>
        {children}
      </AppActionsContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const v = useContext(AppStateContext);
  if (!v) throw new Error("useAppState must be used within AppProvider");
  return v;
}

export function useAppActions() {
  const v = useContext(AppActionsContext);
  if (!v) throw new Error("useAppActions must be used within AppProvider");
  return v;
}

