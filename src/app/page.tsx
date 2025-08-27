// src/app/page.tsx
"use client";

import Link from "next/link";

const STUDENT_NAME = "Vayun";
const STUDENT_NUMBER = "92444685";

export default function HomePage() {
  const rowStyle: React.CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 12,
  };

  // White pill buttons (match across themes)
  const buttonWhite: React.CSSProperties = {
    textDecoration: "none",
    display: "inline-block",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    fontWeight: 600,
  };

  const card: React.CSSProperties = {
    border: "1px solid var(--border-col, #ddd)",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    background: "var(--bg, #fff)",
  };

  return (
    <div>
      {/* Title + identity */}
      <h1 style={{ margin: "0 0 6px 0", fontSize: 32, lineHeight: 1.1, fontWeight: 900 }}>
        CSE3CWA
        <br />
        Assessment 1: Front-End UI
      </h1>
      <p style={{ margin: 0 }}>
        by <strong>{STUDENT_NAME}</strong> · Student ID: <strong>{STUDENT_NUMBER}</strong>
      </p>

      {/* Actions */}
      <div style={rowStyle}>
        <Link href="/tabs" style={buttonWhite}>Open Tabs Builder</Link>
        <Link href="/about" style={buttonWhite}>Watch Demo</Link>
      </div>

      {/* Comprehensive features list */}
      <section style={card}>
        <h2 style={{ margin: "0 0 8px 0", fontSize: 20 }}>What this app includes</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Header, navigation bar (tab bar), footer, and an About page (name + student ID + demo video)</li>
          <li>Light / Dark / Sepia themes that remember your choice across pages</li>
          <li>Hamburger menu (top-right) with CSS transform (three lines → X) and dropdown links:
            Home / About / Tabs (+ placeholders: Pre-lab Questions, Escape Room, Coding Races)</li>
          <li>Active navigation highlight for the current page</li>
          <li>Accessibility nicety: “Skip to content” link</li>
          <li>Tabs Builder operations:
            <ul style={{ marginTop: 6, paddingLeft: 18 }}>
              <li>Create up to <strong>15</strong> tabs</li>
              <li>Rename tab headings</li>
              <li>Edit tab content</li>
              <li>Remove tabs</li>
              <li>All tabs & content are saved in <code>localStorage</code></li>
            </ul>
          </li>
          <li>Output tools:
            <ul style={{ marginTop: 6, paddingLeft: 18 }}>
              <li><strong>Copy</strong> or <strong>Download</strong> a single HTML file</li>
              <li>HTML uses <strong>only inline CSS</strong> (no classes, no external CSS/JS)</li>
              <li>Opens standalone in any browser</li>
              <li>Live preview code window with line-wrapping (no horizontal scroll)</li>
              <li>Filename box for downloads</li>
            </ul>
          </li>
        </ul>
      </section>
    </div>
  );
}
