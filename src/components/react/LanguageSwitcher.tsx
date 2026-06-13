import { useState, useEffect, useRef } from "react";

const LANGS = [
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("zh");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/en/")) {
      setCurrent("en");
    } else {
      setCurrent("zh");
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const switchLang = (lang: string) => {
    const path = window.location.pathname;
    let newPath: string;

    if (lang === "en") {
      // zh → en: add /en prefix
      if (path.startsWith("/en/")) return; // already English
      newPath = "/en" + path;
    } else {
      // en → zh: remove /en prefix
      if (!path.startsWith("/en/")) return; // already Chinese
      newPath = path.replace(/^\/en/, "") || "/";
    }

    window.location.href = newPath;
    setOpen(false);
  };

  const currentLang = LANGS.find((l) => l.code === current) || LANGS[0];

  return (
    <div style={styles.wrapper} ref={ref}>
      <button
        type="button"
        style={styles.btn}
        onClick={() => setOpen(!open)}
        aria-label="Switch language"
      >
        <span style={styles.flag}>{currentLang.flag}</span>
        <span style={styles.code}>{currentLang.code.toUpperCase()}</span>
      </button>
      {open && (
        <div style={styles.dropdown}>
          {LANGS.map((lang) => (
            <button
              key={lang.code}
              type="button"
              style={{
                ...styles.item,
                ...(lang.code === current ? styles.itemActive : {}),
              }}
              onClick={() => switchLang(lang.code)}
            >
              <span style={styles.flag}>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: "relative",
  },
  btn: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    height: 30,
    padding: "0 8px",
    border: "1px solid var(--color-border)",
    borderRadius: 6,
    background: "var(--color-surface-2)",
    color: "var(--color-dim)",
    fontSize: 12,
    cursor: "pointer",
    transition: "border-color 100ms ease, background 100ms ease",
  },
  flag: {
    fontSize: 14,
    lineHeight: 1,
  },
  code: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.05em",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: 4,
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: 6,
    boxShadow: "0 3px 6px rgba(140,149,159,0.15)",
    zIndex: 100,
    overflow: "hidden",
    minWidth: 120,
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: "8px 12px",
    border: "none",
    background: "transparent",
    color: "var(--color-ink)",
    fontSize: 13,
    cursor: "pointer",
    transition: "background 100ms ease",
  },
  itemActive: {
    background: "var(--color-surface-2)",
    fontWeight: 600,
  },
};
