import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
import GraphControls from "./GraphControls";

cytoscape.use(coseBilkent);

// Helper to load the wallet history JSON
async function loadWalletHistory() {
  const resp = await fetch("./account_history_5FZ3kzkS3t.json");
  return resp.json();
}

// Helper to load the wallet transfers JSON
async function loadWalletTransfers() {
  try {
    const resp = await fetch("./transfers_5FZ3kzkS3t.json");
    return resp.json();
  } catch {
    return { transfers: [] };
  }
}

function buildGraphElements(history, transfers, mainWallet) {
  if (!history || !history.account_history || !history.account_history.data) return [];
  const data = history.account_history.data;
  const nodes = [];
  const edges = [];
  const walletId = "wallet";

  // Add a node for the wallet itself
  nodes.push({
    data: {
      id: walletId,
      label: "Wallet",
      type: "wallet",
      address: mainWallet
    },
    classes: "wallet"
  });

  // Add nodes for each balance state (by block)
  data.forEach((entry, i) => {
    const blockId = `block_${entry.block_number}`;
    nodes.push({
      data: {
        id: blockId,
        label: `Block ${entry.block_number}`,
        block: entry.block_number,
        time: entry.timestamp,
        free: entry.balance_free,
        staked: entry.balance_staked,
        total: entry.balance_total,
        rank: entry.rank,
      },
      classes: "block"
    });
    // Edge from wallet to first block, then chain blocks
    if (i === 0) {
      edges.push({ data: { source: walletId, target: blockId, label: "created" } });
    } else {
      const prevBlockId = `block_${data[i - 1].block_number}`;
      edges.push({ data: { source: prevBlockId, target: blockId, label: "next" } });
    }
  });

  // Highlight large changes
  for (let i = 1; i < data.length; ++i) {
    const prev = data[i - 1];
    const curr = data[i];
    const prevTotal = parseFloat(prev.balance_total);
    const currTotal = parseFloat(curr.balance_total);
    if (Math.abs(currTotal - prevTotal) / prevTotal > 0.01) {
      edges.push({
        data: {
          source: `block_${prev.block_number}`,
          target: `block_${curr.block_number}`,
          label: "large change"
        },
        classes: "event"
      });
    }
  }

  // Add transfer nodes and edges
  if (transfers && Array.isArray(transfers.transfers)) {
    const otherWallets = new Set();
    transfers.transfers.forEach((tx) => {
      const from = tx.from?.ss58;
      const to = tx.to?.ss58;
      const isOutgoing = from === mainWallet;
      const isIncoming = to === mainWallet;
      const other = isOutgoing ? to : from;
      if (!other || other === mainWallet) return;
      // Add other wallet node if not already
      if (!otherWallets.has(other)) {
        nodes.push({
          data: {
            id: other,
            label: `${other.slice(0, 6)}...${other.slice(-4)}`,
            type: "other-wallet",
            address: other
          },
          classes: "other-wallet"
        });
        otherWallets.add(other);
      }
      // Add transfer edge
      edges.push({
        data: {
          source: isOutgoing ? walletId : other,
          target: isOutgoing ? other : walletId,
          label: `${parseFloat(tx.amount) / 1e9} TAO\nBlock ${tx.block_number}`,
          amount: tx.amount,
          block: tx.block_number,
          txid: tx.transaction_hash,
          direction: isOutgoing ? "out" : "in"
        },
        classes: isOutgoing ? "transfer-out" : "transfer-in"
      });
    });
  }

  return [...nodes, ...edges];
}

function CopyModal({ open, onClose, label, value }) {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", zIndex: 200,
      background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center"
    }} onClick={onClose}>
      <div style={{
        background: "#232323", color: "#fff", borderRadius: 12, padding: "2rem 2.5rem", minWidth: 320,
        boxShadow: "0 4px 32px #000a", display: "flex", flexDirection: "column", alignItems: "center"
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{label}</div>
        <input
          ref={inputRef}
          value={value}
          readOnly
          style={{
            fontFamily: "monospace",
            fontSize: 16,
            marginBottom: 18,
            width: "100%",
            background: "#181818",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: 6,
            padding: "0.5rem 0.7rem",
            textAlign: "center",
            userSelect: "all"
          }}
          onFocus={e => e.target.select()}
        />
        <button
          style={{
            background: copied ? "#00e676" : "#00eaff",
            color: "#181818",
            border: "none",
            borderRadius: 8,
            padding: "0.6rem 1.5rem",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          onClick={() => {
            navigator.clipboard.writeText(value);
            setCopied(true);
            if (inputRef.current) inputRef.current.select();
            setTimeout(() => setCopied(false), 1200);
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          style={{
            marginTop: 18,
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "0.4rem 1.2rem",
            fontSize: 14,
            cursor: "pointer"
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function WalletGraph({ walletData }) {
  const cyRef = useRef(null);
  const containerRef = useRef(null);
  const [showBlocks, setShowBlocks] = useState(true);
  const [showWallets, setShowWallets] = useState(true);
  const [modal, setModal] = useState({ open: false, label: "", value: "" });

  useEffect(() => {
    let cy;
    let destroyed = false;
    let mainWallet = null;
    function renderGraph(history, transfers, mainWallet) {
      const elements = buildGraphElements(history, transfers, mainWallet);
      cy = cytoscape({
        container: containerRef.current,
        elements,
        style: [
          {
            selector: "node.wallet",
            style: {
              "background-color": "#00eaff",
              "label": "data(label)",
              "font-size": 22,
              "color": "#fff",
              "text-outline-color": "#222",
              "text-outline-width": 3,
              "width": 60,
              "height": 60,
              "z-index": 10
            }
          },
          {
            selector: "node.block",
            style: {
              "background-color": "#fff",
              "label": "data(label)",
              "font-size": 12,
              "color": "#fff",
              "text-outline-color": "#444",
              "text-outline-width": 2,
              "width": 16,
              "height": 16,
              "opacity": 0.8
            }
          },
          {
            selector: "node.other-wallet",
            style: {
              "background-color": "#ffb300",
              "label": "data(label)",
              "font-size": 13,
              "color": "#fff",
              "text-outline-color": "#222",
              "text-outline-width": 2,
              "width": 28,
              "height": 28,
              "opacity": 0.95
            }
          },
          {
            selector: "edge",
            style: {
              "width": 2,
              "line-color": "#888",
              "target-arrow-color": "#888",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier",
              "opacity": 0.5
            }
          },
          {
            selector: "edge.event",
            style: {
              "line-color": "#ff00a0",
              "target-arrow-color": "#ff00a0",
              "width": 4,
              "opacity": 0.9
            }
          },
          {
            selector: "edge.transfer-out",
            style: {
              "line-color": "#ff3b3b",
              "target-arrow-color": "#ff3b3b",
              "width": 3,
              "opacity": 0.85,
              "label": "data(label)",
              "font-size": 10,
              "color": "#ffb3b3",
              "text-background-color": "#181818",
              "text-background-opacity": 1,
              "text-background-padding": 2
            }
          },
          {
            selector: "edge.transfer-in",
            style: {
              "line-color": "#00e676",
              "target-arrow-color": "#00e676",
              "width": 3,
              "opacity": 0.85,
              "label": "data(label)",
              "font-size": 10,
              "color": "#baffc9",
              "text-background-color": "#181818",
              "text-background-opacity": 1,
              "text-background-padding": 2
            }
          }
        ],
        layout: {
          name: "cose-bilkent",
          animate: true,
          fit: true,
          padding: 40,
          nodeDimensionsIncludeLabels: true,
          randomize: false,
          idealEdgeLength: 80,
          edgeElasticity: 0.1,
          gravity: 0.25,
          numIter: 2500
        },
        minZoom: 0.1,
        maxZoom: 2.5,
        wheelSensitivity: 0.2,
        boxSelectionEnabled: false,
        autoungrabify: true
      });
      cyRef.current = cy;

      // Node click handler for copy modal
      cy.on('tap', 'node', (evt) => {
        const node = evt.target;
        if (node.hasClass('block')) {
          setModal({ open: true, label: 'Block Number', value: node.data('block').toString() });
        } else if (node.hasClass('wallet') || node.hasClass('other-wallet')) {
          setModal({ open: true, label: 'Wallet Address', value: node.data('address') });
        }
      });
    }

    if (walletData && walletData.wallet_address && walletData.account_history && walletData.transfers) {
      // Use provided wallet data
      renderGraph(
        { account_history: { data: walletData.account_history.data, pagination: walletData.account_history.pagination } },
        walletData.transfers,
        walletData.wallet_address
      );
    } else {
      // Load default data
      Promise.all([loadWalletHistory(), loadWalletTransfers()]).then(([history, transfers]) => {
        if (destroyed) return;
        const mainWallet = history?.wallet_address || (transfers && transfers.wallet);
        renderGraph(history, transfers, mainWallet);
      });
    }
    return () => {
      destroyed = true;
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [walletData]);

  // Show/hide blocks and wallets
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.batch(() => {
      cy.elements('node.block, edge[label="next"], edge.event').forEach(ele => {
        ele.style('display', showBlocks ? 'element' : 'none');
      });
      cy.elements('node.other-wallet, edge.transfer-in, edge.transfer-out').forEach(ele => {
        ele.style('display', showWallets ? 'element' : 'none');
      });
    });
  }, [showBlocks, showWallets]);

  return (
    <>
      <GraphControls
        showBlocks={showBlocks}
        setShowBlocks={setShowBlocks}
        showWallets={showWallets}
        setShowWallets={setShowWallets}
      />
      <div
        ref={containerRef}
        style={{ flex: 1, minHeight: 0, background: "#181818", borderRadius: 12, margin: 24, boxShadow: "0 4px 32px #000a" }}
      />
      <CopyModal {...modal} onClose={() => setModal({ open: false, label: "", value: "" })} />
    </>
  );
} 