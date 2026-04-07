# CodeBlue AI – Smart Emergency Routing System (Frontend Prototype)

This is a **frontend-only** React prototype (no backend) showcasing:
- Splash loading screen (2–3s) with heartbeat + boot steps
- Role-based code login (`USER-001`, `DRV-001`, `HSP-001`)
- User / Driver / Hospital dashboards
- Simulated Gemini AI triage + simulated realtime updates (shared global state)
- Dark/light mode, glassmorphism, smooth UI

## Run (simple)

### Step 1: Install dependencies

```bash
npm install
```

### Step 2: Start the dev server

```bash
npm run dev
```

## Notes
- No real maps are loaded. The map panel shows `YOUR_API_KEY` and fake markers.
- Speech-to-text uses `SpeechRecognition` when available (browser-dependent).

---

# 🚑 CodeBlue AI – Smart Emergency Routing System

> **Saving Time Saves Lives**

CodeBlue AI is an **AI-powered emergency response system** that intelligently connects **patients, ambulance drivers, and hospitals** in real-time. It ensures that patients are routed to the **nearest *capable* hospital**, not just the nearest one.

---

# 🧠 Problem Statement

In emergency situations, every second matters. However:

* Ambulances often **waste critical time** searching for available hospitals
* No centralized system for **real-time ICU/blood availability**
* Decisions rely on **manual calls and guesswork**
* This leads to **delayed treatment and preventable deaths**

---

# 💡 Solution

CodeBlue AI introduces a **real-time, AI-driven ecosystem** that:

* Understands emergency conditions using AI
* Matches patients with **resource-ready hospitals**
* Provides **instant ambulance routing**
* Synchronizes data across all stakeholders

---

# 🚀 Key Features

## 🤖 AI-Powered Emergency Analysis

* Uses **Google Gemini API**
* Converts text/voice input into:

  * ICU requirement
  * Blood requirement
  * Trauma severity
  * Priority level

---

## 🎤 Multimodal Input (Voice + Text)

* Users can:

  * Type emergency details
  * Speak using voice input
* Voice handled via browser Speech API

---

## 🧭 Intelligent Hospital Routing

* Filters hospitals based on:

  * Resource availability
  * Distance
  * Emergency priority
* Selects **nearest capable hospital**

---

## 🔄 Real-Time Data Synchronization

* Hospital updates reflect instantly across:

  * User dashboard
  * Driver interface
* Eliminates outdated information

---

## 👥 Role-Based System

### 👤 User Panel

* Emergency input (text/voice)
* Hospital recommendations
* Ambulance booking

---

### 🚑 Driver Console

* Assigned patient details
* Route tracking
* Status updates

---

### 🏥 Hospital Dashboard (TPA)

* ICU bed management
* Blood bank monitoring
* Incoming ambulance tracking

---

## 🔐 Secure Access (Prototype Level)

* Code-based login:

  * `USER-001`
  * `DRV-001`
  * `HSP-001`

---

# 🧩 System Architecture

```
User Input (Text/Voice)
        ↓
Gemini AI Analysis
        ↓
Structured Medical Data
        ↓
Routing Engine
        ↓
Best Hospital Match
        ↓
Ambulance Assignment
```

---

# 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS

### AI Integration

* **Gemini 1.5 Flash**

### Voice Processing

* Web Speech API

### Maps & Location

* Google Maps API

### Prototype Logic

* Mock data + simulated real-time updates

---

# 🎬 Demo Workflow

1. User logs in
2. Enters emergency (text/voice)
3. AI analyzes condition
4. System suggests hospitals
5. Ambulance is assigned
6. Driver updates status
7. Hospital receives incoming case

---

# 🌍 Impact

* ⏱️ Reduces emergency response time
* ❤️ Saves lives during the “golden hour”
* 🏥 Optimizes hospital resource usage
* 🤖 Introduces AI into critical healthcare decisions

---

# 💰 Business Model

* Subscription model for private hospitals
* Government partnerships
* API licensing for emergency services

---

# 🔮 Future Scope

* Integration with hospital EHR systems
* Real-time IoT health data
* Predictive AI for hospital load
* Nationwide emergency network

---

# ⚠️ Disclaimer

This is a **hackathon prototype**:

* Uses simulated APIs and mock data
* Designed to demonstrate concept and workflow

---

# 🏆 Why CodeBlue AI?

> We are not just finding hospitals.
> We are building an **intelligent emergency response ecosystem**.

---

# 🙌 Team

* Kuwar Vishwajeet Singh(Core Developer)
* Krish, Adima, Amritansh




