const THEME_KEY = "codeblue.theme";

export function initThemeFromStorage() {
  const stored = localStorage.getItem(THEME_KEY);
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const mode = stored || (prefersDark ? "dark" : "light");
  setTheme(mode);
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "dark";
}

export function setTheme(mode) {
  const root = document.documentElement;
  if (mode === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  localStorage.setItem(THEME_KEY, mode);
}

export function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

