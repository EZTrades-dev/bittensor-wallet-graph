import React from "react";

export default function Legend() {
  return (
    <div
      style={{
        position: "absolute",
        top: 32,
        right: 32,
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
      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Legend</div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <span style={{
          display: "inline-block",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#00eaff",
          marginRight: 10,
          border: "2px solid #222"
        }} />
        Wallet Node
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <span style={{
          display: "inline-block",
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#fff",
          marginRight: 10,
          border: "2px solid #444"
        }} />
        <span style={{marginLeft: 2}}>Block Node</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <span style={{
          display: "inline-block",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#ffb300",
          marginRight: 10,
          border: "2px solid #222"
        }} />
        Other Wallet
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <span style={{
          display: "inline-block",
          width: 28,
          height: 4,
          background: "#888",
          marginRight: 10,
          borderRadius: 2
        }} />
        Standard Edge
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <span style={{
          display: "inline-block",
          width: 28,
          height: 4,
          background: "#ff00a0",
          marginRight: 10,
          borderRadius: 2
        }} />
        Large Change Edge
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <span style={{
          display: "inline-block",
          width: 28,
          height: 4,
          background: "#ff3b3b",
          marginRight: 10,
          borderRadius: 2
        }} />
        Outgoing Transfer
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{
          display: "inline-block",
          width: 28,
          height: 4,
          background: "#00e676",
          marginRight: 10,
          borderRadius: 2
        }} />
        Incoming Transfer
      </div>
    </div>
  );
} 