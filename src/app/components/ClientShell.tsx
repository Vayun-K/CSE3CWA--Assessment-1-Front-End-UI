"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Fill these in */
const STUDENT_NAME = "Name: Vayun";
const STUDENT_NUMBER = "Student ID: 92444685";

const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  // Theme (start 'light' for SSR, sync on mount)
  const [theme, setTheme] = useState<"light" | "dark" | "sepia">("light");
  const [hydrated, setHydrated] = useState(false);

  // Route-aware active link
  const pathname = usePathname() || "/";
  const activeKey = pathname === "/" ? "home" : (pathname.split("/")[1] || "home");

  useEffect(() => {
    setHydrated(true);
    try {
      const saved = localStorage.getItem("prefers-theme");
      if (saved === "dark" || saved === "sepia" || saved === "light") setTheme(saved);
    } catch {}
  }, []);

  // Apply theme via CSS vars (stable for SSR/CSR)
  useEffect(() => {
    if (!isBrowser) return;
    try { localStorage.setItem("prefers-theme", theme); } catch {}
    const vars: Record<string, string> =
      theme === "dark"
        ? {
            "--bg": "#0b0f19",
            "--fg": "#e6e9ef",
            "--link-color": "#cfe8ff",
            "--active-bg": "#1f2937",
            "--border-col": "#1e293b",
            "--ctrl-border": "#374151",
          }
        : theme === "sepia"
        ? {
            "--bg": "#f6f0e6",
            "--fg": "#2b2117",
            "--link-color": "#1e40af",
            "--active-bg": "#f3e7d3",
            "--border-col": "#e5d8c7",
            "--ctrl-border": "#bfae96",
          }
        : {
            "--bg": "#ffffff",
            "--fg": "#0b0f19",
            "--link-color": "#2563eb",
            "--active-bg": "#dbeafe",
            "--border-col": "#dddddd",
            "--ctrl-border": "#aaaaaa",
          };
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.style.background = "var(--bg)";
    root.style.color = "var(--fg)";
  }, [theme]);

  // ---------- NAV + HAMBURGER ----------
  const borderRule = `1px solid var(--border-col, #ddd)`;

  const linkStyle = (id: string): React.CSSProperties => {
    const isActive = hydrated && activeKey === id;
    return {
      textDecoration: "none",
      padding: "6px 10px",
      borderRadius: 8,
      border: isActive ? "1px solid #60a5fa" : "1px solid transparent",
      background: isActive ? "var(--active-bg, #dbeafe)" : "transparent",
      color: "var(--link-color, #2563eb)",
    };
  };

  const themeBtn = (name: "light" | "dark" | "sepia"): React.CSSProperties => {
    const active = theme === name;
    return {
      padding: "6px 10px",
      border: active ? "1px solid #60a5fa" : "1px solid var(--ctrl-border, #aaa)",
      borderRadius: 8,
      cursor: "pointer",
      background: active ? "var(--active-bg, #e8f0ff)" : "transparent",
      color: "var(--fg, #111827)",
    };
  };

  // Hamburger state + esc to close
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    if (menuOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const Burger = (
    <button
      aria-label="Open menu"
      aria-expanded={menuOpen}
      onClick={() => setMenuOpen((v) => !v)}
      style={{
        width: 36,
        height: 28,
        position: "relative",
        border: "1px solid var(--ctrl-border, #aaa)",
        background: "transparent",
        borderRadius: 8,
        cursor: "pointer",
        color: "var(--fg, #111827)",
      }}
    >
      {/* 3 lines with CSS transform to X */}
      <span
        style={{
          position: "absolute", top: 5, left: 6, right: 6, height: 3, background: "currentColor",
          transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none", transition: "transform .2s",
        }}
      />
      <span
        style={{
          position: "absolute", top: 12, left: 6, right: 6, height: 3, background: "currentColor",
          opacity: menuOpen ? 0 : 1, transition: "opacity .2s",
        }}
      />
      <span
        style={{
          position: "absolute", bottom: 5, left: 6, right: 6, height: 3, background: "currentColor",
          transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none", transition: "transform .2s",
        }}
      />
    </button>
  );

  // Shared styles for items inside the dropdown
  const menuLink = (id?: string): React.CSSProperties => {
    const active = id && hydrated && activeKey === id;
    return {
      display: "block",
      textDecoration: "none",
      padding: "8px 10px",
      borderRadius: 8,
      color: "var(--fg, #111827)",
      background: active ? "var(--active-bg, #dbeafe)" : "transparent",
      border: "1px solid transparent",
    };
  };
  const menuButton: React.CSSProperties = {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "8px 10px",
    borderRadius: 8,
    background: "transparent",
    border: "1px solid transparent",
    color: "var(--fg, #111827)",
    cursor: "pointer",
  };

  // Footer date (stable UTC)
  const TODAY = new Date();
  const YEAR_STR = new Intl.DateTimeFormat("en-GB", { year: "numeric", timeZone: "UTC" }).format(TODAY);
  const DATE_STR = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(TODAY);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", borderBottom: borderRule,
        }}
      >
        <div style={{ fontWeight: 800 }}>{STUDENT_NUMBER}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setTheme("light")} style={themeBtn("light")}>Light</button>
          <button onClick={() => setTheme("dark")}  style={themeBtn("dark")}>Dark</button>
          <button onClick={() => setTheme("sepia")} style={themeBtn("sepia")}>Sepia</button>
        </div>
      </header>

      {/* Nav row (unchanged) + hamburger on the right */}
      <nav
        role="navigation"
        aria-label="Primary"
        style={{
          borderBottom: borderRule,
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          position: "relative", // anchor dropdown
        }}
      >
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/"      style={linkStyle("home")}>Home</Link>
          <Link href="/about" style={linkStyle("about")}>About</Link>
          <Link href="/tabs"  style={linkStyle("tabs")}>Tabs</Link>
        </div>

        {/* Hamburger + dropdown */}
        <div style={{ position: "relative" }}>
          {Burger}

          {menuOpen && (
            <>
              {/* click-off overlay */}
              <div
                onClick={() => setMenuOpen(false)}
                style={{
                  position: "fixed", inset: 0, background: "transparent",
                  zIndex: 40,
                }}
              />
              {/* dropdown panel */}
              <div
                role="menu"
                aria-label="Hamburger menu"
                style={{
                  position: "absolute",
                  top: "100%", right: 0, marginTop: 8,
                  width: 260,
                  background: "var(--bg, #fff)",
                  color: "var(--fg, #111)",
                  border: borderRule,
                  borderRadius: 12,
                  boxShadow: "0 12px 28px rgba(0,0,0,.25)",
                  padding: 10,
                  zIndex: 50,
                }}
              >
                <div style={{ fontWeight: 700, margin: "2px 6px 8px" }}>Menu</div>

                {/* same options as the tab bar */}
                <Link href="/"      onClick={() => setMenuOpen(false)} style={menuLink("home")}>Home</Link>
                <Link href="/about" onClick={() => setMenuOpen(false)} style={menuLink("about")}>About</Link>
                <Link href="/tabs"  onClick={() => setMenuOpen(false)} style={menuLink("tabs")}>Tabs</Link>

                <div style={{ height: 1, background: "var(--border-col, #ddd)", margin: "8px 0" }} />

                {/* extra items requested */}
                <button
                  type="button"
                  style={menuButton}
                  onClick={() => { setMenuOpen(false); alert("Pre-lab Questions (placeholder)"); }}
                >
                  Pre-lab Questions
                </button>
                <button
                  type="button"
                  style={menuButton}
                  onClick={() => { setMenuOpen(false); alert("Escape Room (placeholder)"); }}
                >
                  Escape Room
                </button>
                <button
                  type="button"
                  style={menuButton}
                  onClick={() => { setMenuOpen(false); alert("Coding Races (placeholder)"); }}
                >
                  Coding Races
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      <main id="main" style={{ flex: 1, padding: 16 }}>{children}</main>

      <footer
        style={{ borderTop: borderRule, padding: "12px 16px", textAlign: "center" }}
      >
        © {YEAR_STR} {STUDENT_NAME} · {STUDENT_NUMBER} · {DATE_STR}
      </footer>
    </div>
  );
}
