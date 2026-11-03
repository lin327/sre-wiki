import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "atlas-theme";

type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

function getStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // Storage may be unavailable; follow the system for this page.
  }
  return "system";
}

function applyTheme(preference: ThemePreference) {
  const theme = preference === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : preference;
  document.documentElement.setAttribute("data-theme", theme);
}

const sunPath =
  "M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm0 15a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Zm9-6a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM5 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm12.07-5.07a1 1 0 0 1 0 1.41l-.71.71a1 1 0 1 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0ZM8.46 15.54a1 1 0 0 1 0 1.41l-.71.71a1 1 0 1 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0Zm7.07 1.41a1 1 0 0 1-1.41 0l-.71-.71a1 1 0 1 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41ZM8.46 8.46a1 1 0 0 1-1.41 0l-.71-.71A1 1 0 1 1 7.75 6.34l.71.71a1 1 0 0 1 0 1.41ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z";

const moonPath =
  "M21.752 15.002A9.718 9.718 0 0 1 12.478 2.01 1 1 0 0 0 11.26 1a1 1 0 0 0-.94.658A10.004 10.004 0 0 0 12 20a10.004 10.004 0 0 0 8.09-4.343 1 1 0 0 0-.107-1.14 1 1 0 0 0-.48-.268 9.7 9.7 0 0 1-1.751-.247Z";

export default function ThemeToggle({ lang = "zh" }: { lang?: "zh" | "en" }) {
  const [preference, setPreference] = useState<ThemePreference>("system");
  const preferenceRef = useRef<ThemePreference>("system");
  const [ready, setReady] = useState(false);
  const labels = lang === "en"
    ? { mode: "Theme mode", light: "Light", dark: "Dark", system: "System" }
    : { mode: "主题模式", light: "亮色", dark: "暗色", system: "跟随系统" };

  useEffect(() => {
    const initial = getStoredPreference();
    preferenceRef.current = initial;
    setPreference(initial);
    applyTheme(initial);
    setReady(true);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = () => {
      if (preferenceRef.current === "system") applyTheme("system");
    };
    media.addEventListener("change", followSystem);
    return () => media.removeEventListener("change", followSystem);
  }, []);

  const choose = (next: ThemePreference) => {
    preferenceRef.current = next;
    setPreference(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The selection still applies when persistence is blocked.
    }
  };

  return (
    <div className="theme-toggle theme-control" title={`${labels.mode}: ${labels[preference]}`}>
      {preference === "system" ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8m-4-4v4" />
        </svg>
      ) : <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={preference === "light" ? sunPath : moonPath} />
      </svg>}
      <select
        className="theme-control__select"
        aria-label={labels.mode}
        disabled={!ready}
        value={preference}
        onChange={(event) => choose(event.currentTarget.value as ThemePreference)}
      >
        <option value="system">{labels.system}</option>
        <option value="light">{labels.light}</option>
        <option value="dark">{labels.dark}</option>
      </select>
    </div>
  );
}
