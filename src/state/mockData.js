export const ACCESS_CODES = {
  user: "USER-001",
  driver: "DRV-001",
  hospital: "HSP-001",
};

export const BLOOD_GROUPS = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

export const initialHospitals = [
  {
    id: "hsp-neo",
    name: "NeoLife Trauma Institute",
    distanceKm: 3.2,
    icuAvailable: 6,
    icuTotal: 10,
    blood: {
      "O-": "green",
      "O+": "green",
      "A-": "yellow",
      "A+": "green",
      "B-": "yellow",
      "B+": "green",
      "AB-": "red",
      "AB+": "yellow",
    },
    status: "accepting",
    bestMatch: true,
  },
  {
    id: "hsp-city",
    name: "CityCare Emergency Hub",
    distanceKm: 5.8,
    icuAvailable: 2,
    icuTotal: 12,
    blood: {
      "O-": "yellow",
      "O+": "green",
      "A-": "yellow",
      "A+": "green",
      "B-": "red",
      "B+": "yellow",
      "AB-": "red",
      "AB+": "yellow",
    },
    status: "accepting",
    bestMatch: false,
  },
  {
    id: "hsp-starlight",
    name: "Starlight Medical Center",
    distanceKm: 8.4,
    icuAvailable: 0,
    icuTotal: 8,
    blood: {
      "O-": "red",
      "O+": "yellow",
      "A-": "red",
      "A+": "yellow",
      "B-": "yellow",
      "B+": "yellow",
      "AB-": "red",
      "AB+": "red",
    },
    status: "overloaded",
    bestMatch: false,
  },
];

export const initialIncident = {
  id: "inc-001",
  createdAt: Date.now(),
  text: "",
  ai: null,
  selectedHospitalId: "hsp-neo",
  ambulance: {
    requested: false,
    driverId: "DRV-001",
    etaMin: 5,
    status: "idle", // idle | on_the_way | picked_up | en_route | arrived
  },
  patient: {
    condition: "Accident, heavy bleeding",
    priority: "HIGH",
    bloodRequired: "O-",
    needs: ["ICU Required", "Trauma Care Needed"],
  },
};

