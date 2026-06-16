import { useState, useEffect, useCallback, useRef } from "react";
import { authClient } from "../../lib/auth-client";

function useIsEnglish() {
  if (typeof window === "undefined") return false;
  return window.location.pathname.startsWith("/en/");
}

export default function AuthButton() {
  const isEnglish = useIsEnglish();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    authClient
      .getSession()
      .then((res: any) => {
        setSession(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = useCallback(async () => {
    await authClient.signOut();
    setSession(null);
    setMenuOpen(false);
    window.location.reload();
  }, []);

  if (loading) {
    return <div className="auth-skeleton" />;
  }

  if (session?.user) {
    return (
      <div className="auth-wrapper" ref={menuRef}>
        <button
          type="button"
          className="auth-avatar-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="User menu"
        >
          {session.user.image ? (
            <img
              src={session.user.image}
              alt=""
              width={28}
              height={28}
              className="auth-avatar-img"
            />
          ) : (
            <div className="auth-avatar-fallback">
              {(session.user.name || session.user.email || "U")[0].toUpperCase()}
            </div>
          )}
        </button>
        {menuOpen && (
          <div className="auth-dropdown">
            <div className="auth-user-info">
              <div className="auth-user-name">{session.user.name || "User"}</div>
              <div className="auth-user-email">{session.user.email}</div>
            </div>
            <div className="auth-divider" />
            <button type="button" className="auth-menu-item" onClick={() => setMenuOpen(false)}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
              <span className="auth-menu-text">{isEnglish ? "Favorites" : "收藏"}</span>
            </button>
            <button type="button" className="auth-menu-item" onClick={handleSignOut}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z"/></svg>
              <span className="auth-menu-text">{isEnglish ? "Sign out" : "退出登录"}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <a href="/auth/login" className="auth-login-btn" aria-label={isEnglish ? "Sign in" : "登录"}>
      {isEnglish ? "Sign in" : "登录"}
    </a>
  );
}
