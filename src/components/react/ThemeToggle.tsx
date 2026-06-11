import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "atlas-theme";

type Theme = "light" | "dark";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

const buttonStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  border: "none",
  borderRadius: 6,
  background: "transparent",
  cursor: "pointer",
  color: "var(--atlas-ink, #1a1a1a)",
  transition: "opacity 150ms ease",
};

const sunPath =
  "M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm0 15a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Zm9-6a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM5 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm12.07-5.07a1 1 0 0 1 0 1.41l-.71.71a1 1 0 1 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0ZM8.46 15.54a1 1 0 0 1 0 1.41l-.71.71a1 1 0 1 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0Zm7.07 1.41a1 1 0 0 1-1.41 0l-.71-.71a1 1 0 1 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41ZM8.46 8.46a1 1 0 0 1-1.41 0l-.71-.71A1 1 0 1 1 7.75 6.34l.71.71a1 1 0 0 1 0 1.41ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z";

const moonPath =
  "M21.752 15.002A9.718 9.718 0 0 1 12.478 2.01 1 1 0 0 0 11.26 1a1 1 0 0 0-.94.658A10.004 10.004 0 0 0 12 20a10.004 10.004 0 0 0 8.09-4.343 1 1 0 0 0-.107-1.14 1 1 0 0 0-.48-.268 9.7 9.7 0 0 1-1.751-.247Z";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initial = getStoredTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      applyTheme(next);
      return next;
    });
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      style={buttonStyle}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "0.7";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "1";
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={theme === "light" ? moonPath : sunPath} />
      </svg>
    </button>
  );
}
