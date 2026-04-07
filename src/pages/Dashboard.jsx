import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppState.jsx";
import { UserDashboard } from "./dashboards/UserDashboard.jsx";
import { DriverDashboard } from "./dashboards/DriverDashboard.jsx";
import { HospitalDashboard } from "./dashboards/HospitalDashboard.jsx";

export function Dashboard() {
  const { auth } = useAppState();
  const nav = useNavigate();

  useEffect(() => {
    if (!auth.role) nav("/login", { replace: true });
  }, [auth.role, nav]);

  if (!auth.role) return null;

  if (auth.role === "user") return <UserDashboard />;
  if (auth.role === "driver") return <DriverDashboard />;
  if (auth.role === "hospital") return <HospitalDashboard />;
  return null;
}

