"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const GlbViewer = dynamic(() => import("@/components/GlbViewer"), { ssr: false });

const DEFAULT_URL = "/models/ER-0001.glb";

const GOLD_OPTIONS = [
  { key: "rose",   label: "Rose Gold",   color: "#B76E79" },
  { key: "yellow", label: "Yellow Gold", color: "#FFD700" },
  { key: "white",  label: "White Gold",  color: "#E5E4E2" },
];

function encodePath(raw: string) {
  const parts = raw.trim().split("/");
  const filename = parts.pop() ?? "";
  return [...parts, encodeURIComponent(filename)].join("/");
}

export default function ComparePage() {
  const [modelUrl, setModelUrl] = useState(DEFAULT_URL);
  const [input, setInput] = useState(DEFAULT_URL);
  const [color, setColor] = useState("rose");

  return (
    <div style={{
      minHeight: "100vh", background: "#0a1833",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 24, gap: 16,
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/" style={{ color: "#888", fontSize: 12 }}>← Our viewer</Link>
        <span style={{ color: "#333", fontSize: 12 }}>|</span>
        <Link href="/stl" style={{ color: "#888", fontSize: 12 }}>STL viewer</Link>
        <span style={{ color: "#333", fontSize: 12 }}>|</span>
        <span style={{ color: "#aaa", fontSize: 13, fontWeight: 600 }}>Original glb.jsx</span>
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{
            width: 360, padding: "8px 12px", borderRadius: 8,
            background: "#112244", border: "1px solid #224",
            color: "#eee", fontSize: 13, outline: "none",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setModelUrl(encodePath(input))}
          placeholder="GLB path or URL…"
        />
        <button
          onClick={() => setModelUrl(encodePath(input))}
          style={{
            padding: "8px 16px", borderRadius: 8, border: "none",
            background: "#e0b84e", color: "#000", fontSize: 13,
            fontWeight: 600, cursor: "pointer",
          }}
        >
          Load
        </button>
      </div>

      {/* Card */}
      <div style={{
        width: 600, height: 600, borderRadius: 16,
        background: "#0a1833", boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}>
        <GlbViewer modelUrl={modelUrl} color={color} />
      </div>

      {/* Gold buttons */}
      <div style={{
        display: "flex", gap: 10,
        background: "rgba(250,250,245,0.08)",
        backdropFilter: "blur(10px)",
        padding: "10px 16px", borderRadius: 12,
      }}>
        {GOLD_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setColor(opt.key)}
            style={{
              padding: "6px 16px", borderRadius: 8, border: "none",
              fontWeight: 600, fontSize: 13, cursor: "pointer",
              background: color === opt.key ? "#fff" : "rgba(255,255,255,0.12)",
              color: color === opt.key ? "#000" : "#ccc",
              transition: "all 0.2s",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

    </div>
  );
}
