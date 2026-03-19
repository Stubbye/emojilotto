"use client";
import { useEffect, useRef } from "react";
import styles from "./Swap.module.css";

// Jupiter Terminal embed
// Docs: https://terminal.jup.ag/

const EMLO_MINT = process.env.NEXT_PUBLIC_EMLO_MINT || "YOUR_EMLO_MINT_ADDRESS";

export default function SwapWidget({ dark }: { dark: boolean }) {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    // Load Jupiter Terminal script
    const script = document.createElement("script");
    script.src = "https://terminal.jup.ag/main-v3.js";
    script.async = true;
    script.onload = () => {
      (window as any).Jupiter?.init({
        displayMode: "integrated",
        integratedTargetId: "jupiter-terminal",
        endpoint: process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com",
        defaultExplorer: "Solana Explorer",
        formProps: {
          initialInputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
          initialOutputMint: EMLO_MINT,
          fixedOutputMint: true,
        },
        appearance: dark ? "dark" : "light",
      });
    };
    document.head.appendChild(script);

    return () => {
      (window as any).Jupiter?.close?.();
    };
  }, []);

  // Re-init when theme changes
  useEffect(() => {
    if ((window as any).Jupiter) {
      (window as any).Jupiter?.init({
        displayMode: "integrated",
        integratedTargetId: "jupiter-terminal",
        endpoint: process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com",
        formProps: {
          initialInputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          initialOutputMint: EMLO_MINT,
          fixedOutputMint: true,
        },
        appearance: dark ? "dark" : "light",
      });
    }
  }, [dark]);

  return (
    <div className={styles.swapWrap}>
      <div className={styles.swapHeader}>
        <div className={styles.swapTitle}>Swap for $EMLO</div>
        <div className={styles.swapSub}>
          Powered by Jupiter · Swap any token for $EMLO to play the EMLO game
        </div>
      </div>

      <div className={styles.tokenInfo}>
        <div className={styles.tokenCard}>
          <div className={styles.tokenLabel}>Token</div>
          <div className={styles.tokenName}>EmojiLotto</div>
          <div className={styles.tokenTicker}>$EMLO</div>
        </div>
        <div className={styles.tokenCard}>
          <div className={styles.tokenLabel}>Total Supply</div>
          <div className={styles.tokenName}>1,000,000,000</div>
          <div className={styles.tokenTicker}>1 Billion EMLO</div>
        </div>
        <div className={styles.tokenCard}>
          <div className={styles.tokenLabel}>Network</div>
          <div className={styles.tokenName}>Solana</div>
          <div className={styles.tokenTicker}>SPL Token</div>
        </div>
      </div>

      {/* Jupiter Terminal renders here */}
      <div id="jupiter-terminal" className={styles.jupiterContainer} />

      <div className={styles.mintAddress}>
        Contract: <code>{EMLO_MINT}</code>
      </div>
    </div>
  );
}
