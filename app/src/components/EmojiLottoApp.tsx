"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import UsdcGame from "./UsdcGame";
import EmloGame from "./EmloGame";
import SwapWidget from "./SwapWidget";
import GameHistory from "./GameHistory";
import styles from "./Layout.module.css";

type Tab = "sol" | "emlo" | "swap" | "history";

export default function EmojiLottoApp() {
  const wallet = useWallet();
  const [tab, setTab] = useState<Tab>("sol");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDark(true);
  }, []);

  const toggleTheme = () => {
    setDark((d) => {
      localStorage.setItem("theme", !d ? "dark" : "light");
      return !d;
    });
  };

  return (
    <div className={dark ? styles.appDark : styles.app}>
      {/* Top Nav */}
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <img src="/logo.webp" alt="EmojiLotto" style={{ height: 36, width: "auto" }} />
          <span className={styles.emloTag}>$EMLO</span>
        </div>
        
        <div className={styles.navRight}>
          <button className={styles.themeBtn} onClick={toggleTheme}>
            {dark ? "☀️" : "🌙"}
          </button>
          <WalletMultiButton className={styles.walletBtn} />
        </div>
      </nav>

      {/* Devnet Banner */}
      <div style={{ background: "#f59e0b", color: "#000", textAlign: "center", padding: "6px 12px", fontSize: 13, fontWeight: 600 }}>
        🧪 Playing on Solana Devnet · Get free SOL at <a href="https://faucet.solana.com" target="_blank" rel="noopener noreferrer" style={{ color: "#000", textDecoration: "underline" }}>faucet.solana.com</a>
      </div>

      {/* Tab Bar */}
      <div className={styles.tabBar}>
        <button className={`${styles.tab} ${tab === "sol" ? styles.tabActive : ""}`} onClick={() => setTab("sol")}>
          ◎ SOL Game
        </button>
        <button className={`${styles.tab} ${tab === "emlo" ? styles.tabActive : ""}`} onClick={() => setTab("emlo")}>
          🪙 EMLO Game
        </button>
        <button className={`${styles.tab} ${tab === "swap" ? styles.tabActive : ""}`} onClick={() => setTab("swap")}>
          🔄 Swap
        </button>
        <button className={`${styles.tab} ${tab === "history" ? styles.tabActive : ""}`} onClick={() => setTab("history")}>
          📜 History
        </button>
      </div>

      {/* Content */}
      <main className={styles.main}>
        {tab === "sol" && <UsdcGame dark={dark} />}
        {tab === "emlo" && <EmloGame dark={dark} />}
        {tab === "swap" && <SwapWidget dark={dark} />}
        {tab === "history" && <GameHistory dark={dark} />}
      </main>

      <footer className={styles.footer}>
        EmojiLotto · Built on Solana Devnet · $EMLO token ·{" "}
        <a href="https://explorer.solana.com?cluster=devnet" target="_blank" rel="noopener noreferrer">
          View on Explorer
        </a>
      </footer>
    </div>
  );
}
```

