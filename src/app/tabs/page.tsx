"use client";
import { useEffect, useMemo, useState } from "react";
import { generateInlineHTML } from "../lib/generateInlineHTML";

type Tab = { id: number; title: string; content: string };

export default function TabsBuilder() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [viewerDark, setViewerDark] = useState(false); // viewer-only toggle
  const [fileName, setFileName] = useState("tabs_output_inline.html");

  // Load once
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tabs-data");
      setTabs(saved ? JSON.parse(saved) : [{ id: 1, title: "Tab 1", content: "Hello, world!" }]);
    } catch {
      setTabs([{ id: 1, title: "Tab 1", content: "Hello, world!" }]);
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem("tabs-data", JSON.stringify(tabs));
    } catch {}
  }, [tabs]);

  // Derived output
  const outputHtml = useMemo(() => generateInlineHTML(tabs), [tabs]);

  // Helpers
  const sanitizeFileName = (raw: string) => {
    let name = (raw || "").trim();
    if (!name) name = "tabs_output_inline.html";
    // remove illegal characters for most filesystems
    name = name.replace(/[\\/:*?"<>|]/g, "_");
    if (!name.toLowerCase().endsWith(".html")) name += ".html";
    return name;
  };

  // Actions
  const addTab = () => {
    if (tabs.length >= 15) return alert("Maximum of 15 tabs");
    const id = tabs.length ? Math.max(...tabs.map((t) => t.id)) + 1 : 1;
    setTabs([...tabs, { id, title: `Tab ${tabs.length + 1}`, content: "" }]);
  };
  const removeTab = (id: number) => setTabs(tabs.filter((t) => t.id !== id));
  const updateTab = (id: number, key: "title" | "content", val: string) =>
    setTabs(tabs.map((t) => (t.id === id ? { ...t, [key]: val } : t)));

  const downloadOutput = () => {
    const blob = new Blob([outputHtml], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = sanitizeFileName(fileName);
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(outputHtml);
      alert("HTML copied to clipboard!");
    } catch {
      alert("Copy failed — use Download instead.");
    }
  };
  const openPreview = () => {
    const blob = new Blob([outputHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const escapeForPre = (s: string) =>
    s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Tabs Builder</h1>

      {/* Top actions */}
      <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={addTab} style={btn}>+ Add Tab</button>
        <button onClick={downloadOutput} style={btn}>Output (Download)</button>
        <button onClick={copyOutput} style={btn}>Output (Copy)</button>
        <button onClick={openPreview} style={btnStrong}>Open Preview</button>
      </div>

      {/* Two-column layout */}
      <div style={twoCol}>
        {/* LEFT: Tab editor */}
        <div style={{ maxWidth: "100%" }}>
          {tabs.length === 0 && (
            <div style={{ color: "#6b7280", marginBottom: 12 }}>
              No tabs yet — click <strong>+ Add Tab</strong> to begin.
            </div>
          )}
          {tabs.map((t) => (
            <div key={t.id} style={card}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, minWidth: 0 }}>
                <input
                  value={t.title}
                  onChange={(e) => updateTab(t.id, "title", e.target.value)}
                  placeholder="Tab title"
                  style={{ ...field, flex: 1, minWidth: 0 }}
                />
                <button onClick={() => removeTab(t.id)} style={btn}>- Remove</button>
              </div>
              <textarea
                value={t.content}
                onChange={(e) => updateTab(t.id, "content", e.target.value)}
                placeholder="Tab content…"
                rows={6}
                style={{ ...field, resize: "vertical" }}
              />
            </div>
          ))}
        </div>

        {/* RIGHT: Output panel */}
        <div style={{ maxWidth: "100%" }}>
          {/* Row: "Output" + filename | viewer Dark Mode */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontWeight: 600 }}>Output</label>
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") downloadOutput(); }}
                placeholder="filename.html"
                style={{
                  width: 220,
                  height: 28,
                  border: "1px solid #aaa",
                  borderRadius: 6,
                  background: "#fff",
                  color: "#111827",
                  outline: "none",
                  boxSizing: "border-box",
                  padding: "4px 8px",
                }}
                aria-label="Output filename"
                title="Set the download filename; press Enter to download"
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#6b7280" }}>Dark Mode</span>
              <button
                role="switch"
                aria-checked={viewerDark}
                onClick={() => setViewerDark(v => !v)}
                style={{
                    width: 46, height: 24, borderRadius: 999, border: "1px solid #aaa",
                    background: viewerDark ? "#111827" : "#e5e7eb",
                    position: "relative", cursor: "pointer"
                }}
                title="Toggle viewer theme"
              >
                <span
                  style={{
                    position: "absolute", top: 2, left: viewerDark ? 24 : 2,
                    width: 20, height: 20, borderRadius: 999, background: "#fff",
                    boxShadow: "0 1px 2px rgba(0,0,0,.2)", transition: "left .15s"
                  }}
                />
              </button>
            </div>
          </div>

          {/* Code window — wraps to width; no horizontal scroll */}
          <div
            style={{
              border: "3px solid #111",
              borderRadius: 4,
              padding: 10,
              background: viewerDark ? "#0b1220" : "#f8fafc",
              maxWidth: "100%",
              overflow: "hidden",
            }}
          >
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                maxWidth: "100%",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                fontSize: 12,
                lineHeight: 1.4,
                color: viewerDark ? "#e5e7eb" : "#111827",
              }}
            >
              {escapeForPre(outputHtml)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== inline styles ===== */

const btn: React.CSSProperties = {
  padding: "6px 10px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  cursor: "pointer",
  background: "#f3f4f6",
  color: "#111827",
};

const btnStrong: React.CSSProperties = {
  padding: "6px 10px",
  border: "1px solid #2563eb",
  borderRadius: 8,
  cursor: "pointer",
  background: "#dbeafe",
  color: "#1e40af",
};

const field: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "6px 8px",
  border: "1px solid #94a3b8",
  borderRadius: 8,
  background: "#ffffff",
  color: "#111827",
};

const card: React.CSSProperties = {
  border: "1px solid #334155",
  borderRadius: 12,
  padding: 12,
  marginBottom: 12,
  maxWidth: "100%",
  overflow: "hidden",
};

const twoCol: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
  gap: 16,
  alignItems: "start",
  maxWidth: "100%",
};
