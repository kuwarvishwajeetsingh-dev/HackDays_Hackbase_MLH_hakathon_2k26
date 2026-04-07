/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a"
        },
        ink: {
          950: "#070A12",
          900: "#0A1020",
          850: "#0D1630"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(59,130,246,.25), 0 20px 80px rgba(59,130,246,.18)",
        glass: "0 0 0 1px rgba(255,255,255,.08), 0 24px 80px rgba(0,0,0,.55)"
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.05)" },
          "45%": { transform: "scale(1)" },
          "60%": { transform: "scale(1.08)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" }
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pingSoft: {
          "0%": { transform: "scale(1)", opacity: ".9" },
          "70%": { transform: "scale(1.9)", opacity: "0" },
          "100%": { transform: "scale(2.1)", opacity: "0" }
        }
      },
      animation: {
        heartbeat: "heartbeat 1.3s ease-in-out infinite",
        shimmer: "shimmer 7s ease-in-out infinite",
        floaty: "floaty 5.5s ease-in-out infinite",
        pingSoft: "pingSoft 1.6s cubic-bezier(0, 0, 0.2, 1) infinite"
      },
      backgroundImage: {
        aurora:
          "radial-gradient(1200px circle at 20% 10%, rgba(59,130,246,.35), transparent 45%), radial-gradient(900px circle at 80% 20%, rgba(16,185,129,.18), transparent 40%), radial-gradient(900px circle at 50% 90%, rgba(239,68,68,.22), transparent 45%)",
        grid:
          "linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

