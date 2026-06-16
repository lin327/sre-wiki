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
      if (path.startsWith("/en/")) return;
      newPath = "/en" + path;
    } else {
      if (!path.startsWith("/en/")) return;
      newPath = path.replace(/^\/en/, "") || "/";
    }

    window.location.href = newPath;
    setOpen(false);
  };

  const currentLang = LANGS.find((l) => l.code === current) || LANGS[0];

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        type="button"
        className="lang-switcher__btn"
        onClick={() => setOpen(!open)}
        aria-label="Switch language"
      >
        <span className="lang-switcher__flag">{currentLang.flag}</span>
        <span className="lang-switcher__code">{currentLang.code.toUpperCase()}</span>
      </button>
      {open && (
        <div className="lang-switcher__dropdown">
          {LANGS.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`lang-switcher__item${lang.code === current ? " lang-switcher__item--active" : ""}`}
              onClick={() => switchLang(lang.code)}
            >
              <span className="lang-switcher__flag">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
