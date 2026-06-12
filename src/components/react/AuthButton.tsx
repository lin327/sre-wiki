import { useState, useEffect, useCallback, useRef } from "react";
import { authClient } from "../../lib/auth-client";

export default function AuthButton() {
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
    return (
      <div style={styles.skeleton} />
    );
  }

  if (session?.user) {
    return (
      <div style={styles.wrapper} ref={menuRef}>
        <button
          type="button"
          style={styles.avatarBtn}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="User menu"
        >
          {session.user.image ? (
            <img
              src={session.user.image}
              alt=""
              width={28}
              height={28}
              style={styles.avatarImg}
            />
          ) : (
            <div style={styles.avatarFallback}>
              {(session.user.name || session.user.email || "U")[0].toUpperCase()}
            </div>
          )}
        </button>
        {menuOpen && (
          <div style={styles.dropdown}>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{session.user.name || "User"}</div>
              <div style={styles.userEmail}>{session.user.email}</div>
            </div>
            <div style={styles.divider} />
            <button type="button" style={styles.menuItem} onClick={() => setMenuOpen(false)}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
              <span style={styles.menuText}>收藏</span>
            </button>
            <button type="button" style={styles.menuItem} onClick={handleSignOut}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z"/></svg>
              <span style={styles.menuText}>退出登录</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <a href="/auth/login" style={styles.loginBtn} aria-label="Login">
      登录
    </a>
  );
}

const styles: Record<string, React.CSSProperties> = {
  skeleton: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "var(--color-surface-2)",
  },
  wrapper: {
    position: "relative",
  },
  avatarBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    padding: 0,
    border: "1px solid var(--color-border)",
    borderRadius: "50%",
    background: "transparent",
    cursor: "pointer",
    overflow: "hidden",
  },
  avatarImg: {
    borderRadius: "50%",
    objectFit: "cover" as const,
  },
  avatarFallback: {
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--color-ink)",
    background: "var(--color-surface-2)",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: 4,
    width: 200,
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: 6,
    boxShadow: "0 3px 6px rgba(140,149,159,0.15)",
    zIndex: 100,
    overflow: "hidden",
  },
  userInfo: {
    padding: "8px 12px",
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--color-ink)",
  },
  userEmail: {
    fontSize: 11,
    color: "var(--color-dim)",
    marginTop: 2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  divider: {
    height: 1,
    background: "var(--color-border)",
  },
  menuItem: {
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
  menuText: {
    fontSize: 13,
  },
  loginBtn: {
    display: "flex",
    alignItems: "center",
    height: 30,
    padding: "0 12px",
    border: "1px solid var(--color-border)",
    borderRadius: 6,
    background: "var(--color-surface-2)",
    color: "var(--color-dim)",
    fontSize: 12,
    textDecoration: "none",
    transition: "border-color 100ms ease, background 100ms ease",
  },
};
