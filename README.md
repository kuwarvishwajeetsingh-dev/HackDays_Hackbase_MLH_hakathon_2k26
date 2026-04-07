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

Open the URL it prints (usually `http://localhost:5173/`).

## Notes
- No real maps are loaded. The map panel shows `YOUR_API_KEY` and fake markers.
- Speech-to-text uses `SpeechRecognition` when available (browser-dependent).

