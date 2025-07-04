import React, { useState, useRef } from "react";

const API_KEY = "add your TAOSTATS API key";
const BASE_URL = "https://api.taostats.io";
const RATE_LIMIT = 5; // requests per minute
const MIN_INTERVAL = 60 / RATE_LIMIT; // seconds between requests

async function rateLimitedFetch(url, options, lastRequestTimeRef) {
  const now = Date.now();
  const elapsed = (now - lastRequestTimeRef.current) / 1000;
  if (elapsed < MIN_INTERVAL) {
    await new Promise(res => setTimeout(res, (MIN_INTERVAL - elapsed) * 1000));
  }
  lastRequestTimeRef.current = Date.now();
  return fetch(url, options);
}

export default function WalletLoader({ onWalletDataLoaded }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [skipBlocks, setSkipBlocks] = useState(false);
  const lastRequestTimeRef = useRef(0);

  async function fetchAllWalletData(address) {
    setLoading(true);
    setProgress(0);
    let accountHistory = null;
    let transfersFrom = [];
    let transfersTo = [];
    let totalRequests = skipBlocks ? 2 : 1; // 2 for transfers if skipping blocks, 1+ for account history if not
    let completedRequests = 0;

    if (!skipBlocks) {
      setProgressText("Fetching account history...");
      // Fetch account history (first page, get pagination info)
      const histUrl = `${BASE_URL}/api/account/history/v1?address=${address}&network=finney&page=1&limit=50`;
      const histResp = await rateLimitedFetch(histUrl, {
        headers: {
          accept: "application/json",
          Authorization: API_KEY
        }
      }, lastRequestTimeRef);
      completedRequests++;
      setProgress(completedRequests / totalRequests);
      if (!histResp.ok) {
        setProgressText("Failed to fetch account history");
        setLoading(false);
        return;
      }
      accountHistory = await histResp.json();
      // If more pages, queue them
      const histPages = accountHistory.pagination?.total_pages || 1;
      totalRequests += histPages - 1;
      let allHistory = accountHistory.data || [];
      for (let page = 2; page <= histPages; ++page) {
        setProgressText(`Fetching account history page ${page}/${histPages}...`);
        const url = `${BASE_URL}/api/account/history/v1?address=${address}&network=finney&page=${page}&limit=50`;
        const resp = await rateLimitedFetch(url, {
          headers: {
            accept: "application/json",
            Authorization: API_KEY
          }
        }, lastRequestTimeRef);
        completedRequests++;
        setProgress(completedRequests / totalRequests);
        if (resp.ok) {
          const pageData = await resp.json();
          allHistory = allHistory.concat(pageData.data || []);
        }
      }
    }
    // Fetch transfers (from and to)
    setProgressText("Fetching outgoing transfers...");
    const fromUrl = `${BASE_URL}/api/transfer/v1?from=${address}&network=finney&page=1&limit=100`;
    const fromResp = await rateLimitedFetch(fromUrl, {
      headers: {
        accept: "application/json",
        Authorization: API_KEY
      }
    }, lastRequestTimeRef);
    completedRequests++;
    setProgress(completedRequests / totalRequests);
    let fromData = [];
    if (fromResp.ok) {
      const fromJson = await fromResp.json();
      fromData = fromJson.data || [];
    }
    setProgressText("Fetching incoming transfers...");
    const toUrl = `${BASE_URL}/api/transfer/v1?to=${address}&network=finney&page=1&limit=100`;
    const toResp = await rateLimitedFetch(toUrl, {
      headers: {
        accept: "application/json",
        Authorization: API_KEY
      }
    }, lastRequestTimeRef);
    completedRequests++;
    setProgress(completedRequests / totalRequests);
    let toData = [];
    if (toResp.ok) {
      const toJson = await toResp.json();
      toData = toJson.data || [];
    }
    setProgressText("Done!");
    setProgress(1);
    setTimeout(() => setLoading(false), 800);
    onWalletDataLoaded({
      wallet_address: address,
      account_history: skipBlocks ? { data: [], pagination: null } : { data: allHistory, pagination: accountHistory.pagination },
      transfers: { transfers: [...fromData, ...toData], wallet: address }
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    fetchAllWalletData(input.trim());
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          position: "absolute",
          left: 32,
          bottom: 32,
          background: "rgba(24,24,24,0.95)",
          color: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 16px #000a",
          padding: "1.2rem 1.5rem",
          zIndex: 100,
          minWidth: 320,
          fontSize: 15,
          lineHeight: 1.7,
          border: "1px solid #333",
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}
      >
        <label style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Load Another Wallet</label>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter Bittensor wallet address"
          style={{
            fontSize: 16,
            padding: '0.6rem 1rem',
            borderRadius: 8,
            border: '1px solid #444',
            background: '#181818',
            color: '#fff',
            marginBottom: 8
          }}
        />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginTop: 8
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14,
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={skipBlocks}
              onChange={e => setSkipBlocks(e.target.checked)}
              style={{
                width: 16,
                height: 16,
                cursor: 'pointer'
              }}
            />
            Skip block nodes (faster)
          </label>
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            background: loading ? '#444' : '#00eaff',
            color: loading ? '#bbb' : '#181818',
            border: 'none',
            borderRadius: 8,
            padding: '0.7rem 1.5rem',
            fontWeight: 700,
            fontSize: 15,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            marginTop: 8
          }}
        >
          {loading ? 'Loading...' : 'Load'}
        </button>
      </form>
      {loading && (
        <div style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          height: 8,
          background: '#222',
          zIndex: 200
        }}>
          <div style={{
            width: `${Math.round(progress * 100)}%`,
            height: '100%',
            background: '#00eaff',
            transition: 'width 0.3s'
          }} />
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 12,
            textAlign: 'center',
            color: '#fff',
            fontSize: 18,
            fontWeight: 600,
            textShadow: '0 1px 4px #000a'
          }}>{progressText}</div>
        </div>
      )}
    </>
  );
} 