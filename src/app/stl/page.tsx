"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { METAL_PRESETS, type MetalPreset } from "@/components/presets";

const STLViewer = dynamic(() => import("@/components/STLViewer"), { ssr: false });

function Swatch({ color, label, selected, onClick }: {
  color: string; label: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      style={{
        width: 32, height: 32, borderRadius: "50%",
        background: color,
        border: selected ? "3px solid #222" : "2px solid #555",
        cursor: "pointer", outline: "none", padding: 0,
        boxShadow: selected ? "0 0 0 2px #1a1a1a inset" : "none",
        transition: "border 0.15s",
      }}
    />
  );
}

export default function STLPage() {
  const [modelUrl, setModelUrl] = useState("");
  const [input, setInput] = useState("");
  const [metal, setMetal] = useState<MetalPreset>(METAL_PRESETS["Yellow Gold 18K"]);

  function load() {
    const url = input.trim();
    if (!url) return;
    if (/^[A-Za-z]:[\\\/]/.test(url) || url.startsWith("file://")) {
      alert("Use a web path like /models/ER-0001.stl, not a full file path.");
      return;
    }
    const parts = url.split("/");
    const filename = parts.pop() ?? "";
    setModelUrl([...parts, encodeURIComponent(filename)].join("/"));
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#1a1a1a",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 24, gap: 16,
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/" style={{ color: "#888", fontSize: 12 }}>← GLB viewer</Link>
        <span style={{ color: "#555", fontSize: 12 }}>|</span>
        <span style={{ color: "#aaa", fontSize: 13, fontWeight: 600 }}>STL Viewer</span>
      </div>

      {/* Input row */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{
            width: 400, padding: "8px 12px", borderRadius: 8,
            background: "#2a2a2a", border: "1px solid #444",
            color: "#eee", fontSize: 13, outline: "none",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="/models/ER-0001.stl"
        />
        <button
          onClick={load}
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
        background: "#111", boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {modelUrl ? (
          <STLViewer modelUrl={modelUrl} metal={metal} />
        ) : (
          <span style={{ color: "#555", fontSize: 13 }}>
            Place a .stl file in public/models/ and enter its path above
          </span>
        )}
      </div>

      {/* Metal swatches */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 12, color: "#666", width: 42 }}>Metal</span>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(METAL_PRESETS).map(([name, preset]) => (
            <Swatch
              key={name}
              label={name}
              color={preset.color}
              selected={metal === preset}
              onClick={() => setMetal(preset)}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
