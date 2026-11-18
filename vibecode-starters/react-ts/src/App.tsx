import React, { useState } from "react";
import { Sparkles, Code2, Zap } from "lucide-react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "2rem",
      boxSizing: "border-box"
    }}>
      <div style={{
        background: "rgba(30, 41, 59, 0.8)",
        border: "1px solid rgba(51, 65, 85, 0.8)",
        borderRadius: "16px",
        padding: "2.5rem",
        textAlign: "center",
        maxWidth: "480px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
      }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "1rem" }}>
          <Sparkles color="#38bdf8" size={28} />
          <Code2 color="#a855f7" size={28} />
          <Zap color="#f59e0b" size={28} />
        </div>
        <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "1.75rem", fontWeight: "700" }}>
          VibeCode Editor
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", margin: "0 0 1.5rem 0" }}>
          React + TypeScript running live in your browser powered by WebContainers & Groq AI.
        </p>
        <button
          onClick={() => setCount((c) => c + 1)}
          style={{
            background: "linear-gradient(to right, #3b82f6, #6366f1)",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "transform 0.1s ease"
          }}
        >
          Clicked {count} times
        </button>
      </div>
    </div>
  );
}
