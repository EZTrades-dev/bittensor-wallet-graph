import React, { useState } from "react";
import WalletGraph from "./WalletGraph";
import Legend from "./Legend";
import WalletLoader from "./WalletLoader";

export default function App() {
  const [walletData, setWalletData] = useState(null);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#181818', position: 'relative' }}>
      <header style={{
        padding: '1.5rem 2rem',
        background: '#222',
        color: '#fff',
        fontSize: '2rem',
        fontWeight: 700,
        letterSpacing: 1,
        boxShadow: '0 2px 8px #0006',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        minHeight: 80
      }}>
        <span style={{ flex: 1, textAlign: 'left', zIndex: 1 }}>Bittensor Wallet Knowledge Graph</span>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <img
            src="/bg-tile.png"
            alt="Avatar"
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 2px 12px #000a',
              border: '3px solid #00eaff',
              background: '#222',
              pointerEvents: 'auto'
            }}
          />
        </div>
        <a
          href="https://x.com/E_Z_Trades"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#00eaff',
            fontSize: '1.1rem',
            fontWeight: 500,
            textDecoration: 'none',
            marginLeft: 24,
            background: 'rgba(0,234,255,0.08)',
            borderRadius: 8,
            padding: '0.4rem 1.1rem',
            transition: 'background 0.2s',
            border: '1px solid #00eaff',
            boxShadow: '0 1px 6px #00eaff22',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            zIndex: 1
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(0,234,255,0.18)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(0,234,255,0.08)'}
        >
          Follow E_Z_Trades on X
        </a>
      </header>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'stretch', minHeight: 0, position: 'relative' }}>
        <WalletGraph walletData={walletData} />
        <Legend />
        <WalletLoader onWalletDataLoaded={setWalletData} />
      </main>
    </div>
  );
} 