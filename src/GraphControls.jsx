import React from "react";

export default function GraphControls({ showBlocks, setShowBlocks, showWallets, setShowWallets }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 32,
        left: 32,
        background: "rgba(24,24,24,0.95)",
        color: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 16px #000a",
        padding: "1.2rem 1.5rem",
        zIndex: 100,
        minWidth: 220,
        fontSize: 15,
        lineHeight: 1.7,
        border: "1px solid #333"
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Controls</div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={showBlocks}
            onChange={e => setShowBlocks(e.target.checked)}
            style={{ accentColor: "#00eaff", width: 18, height: 18 }}
          />
          Show Block Nodes
        </label>
      </div>
      <div>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={showWallets}
            onChange={e => setShowWallets(e.target.checked)}
            style={{ accentColor: "#ffb300", width: 18, height: 18 }}
          />
          Show Other Wallets
        </label>
      </div>
    </div>
  );
} 