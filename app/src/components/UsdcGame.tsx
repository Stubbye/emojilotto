"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import styles from "./Game.module.css";
import HintBox from "./HintBox";
import { getHintsForRound } from "../utils/riddles";

const EMOJIS = ["🎯","🚀","💎","🌙","⚡","🔥","🎪","🦋","🌈","💫","🎲","🃏","🦊","🐉","🌺","💜","🎸","🏆","🎭","🍀","🔮","⭐","🎨","🌊"];
const MAX_ATTEMPTS = 3;
const ENTRY_FEE = "$1.00 USDC";
const ROUND_ID = Number(process.env.NEXT_PUBLIC_USDC_ROUND_ID || "1");

const PRIZE_TABLE = [
  { rank: "🥇 1st", pct: "50%" },
  { rank: "🥈 2nd", pct: "18%" },
  { rank: "🥉 3rd", pct: "10%" },
  { rank: "4th", pct: "5%" },
  { rank: "5th–10th", pct: "2% each" },
  { rank: "11th–20th", pct: "0.7% each" },
];

export default function UsdcGame({ dark }: { dark: boolean }) {
  const wallet = useWallet();
  const [selected, setSelected] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<{picks: number[], matches: number}[]>([]);
  const [timeLeft, setTimeLeft] = useState("");
  const [pct, setPct] = useState(100);
  const [prizePool, setPrizePool] = useState(0);
  const [players, setPlayers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const endTime = Date.now() + 86400000;

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, endTime - Date.now());
      const h = Math.floor(diff / 3600000).toString().padStart(2, "0");
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
      setTimeLeft(`${h}:${m}:${s}`);
      setPct(Math.round((diff / 86400000) * 100));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const toggleEmoji = (idx: number) => {
    if (attempts.length >= MAX_ATTEMPTS) return;
    setSelected(prev =>
      prev.includes(idx) ? prev.filter(x => x !== idx) : prev.length < 6 ? [...prev, idx] : prev
    );
  };

  const submitEntry = async () => {
    if (!wallet.connected || selected.length !== 6) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const matches = Math.floor(Math.random() * 4);
    setAttempts(prev => [...prev, { picks: [...selected], matches }]);
    setSelected([]);
    setPrizePool(p => p + 1);
    setPlayers(p => p + 1);
    setLoading(false);
  };

  const attemptsLeft = MAX_ATTEMPTS - attempts.length;
  const isMaxed = attempts.length >= MAX_ATTEMPTS;

  const hints = getHintsForRound(ROUND_ID, "usdc");
  const bestMatch = attempts.length > 0 ? Math.max(...attempts.map(a => a.matches)) : 0;

  return (
    <div className={styles.gameWrap}>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Live Prize Pool</div>
          <div className={styles.statVal} style={{ color: "#16a34a" }}>${prizePool.toFixed(2)}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Players</div>
          <div className={styles.statVal}>{players}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Your Attempts</div>
          <div className={styles.statVal} style={{ color: attemptsLeft === 0 ? "#dc2626" : "inherit" }}>
            {attempts.length}/{MAX_ATTEMPTS}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Time Left</div>
          <div className={styles.statVal} style={{ color: pct < 20 ? "#dc2626" : "inherit" }}>
            {timeLeft}
          </div>
        </div>
      </div>

      {/* Prize pool breakdown — always from current pool */}
      <div className={styles.poolBreakdown}>
        <span>🥇 1st wins <b>${(prizePool * 0.50).toFixed(2)}</b></span>
        <span>🥈 2nd wins <b>${(prizePool * 0.18).toFixed(2)}</b></span>
        <span>🥉 3rd wins <b>${(prizePool * 0.10).toFixed(2)}</b></span>
      </div>

      {/* Timer bar */}
      <div className={styles.timerWrap}>
        <div className={styles.timerFill} style={{ width: `${pct}%`, background: pct < 20 ? "#dc2626" : pct < 40 ? "#f59e0b" : "#9945FF" }} />
      </div>

      {/* Info banner */}
      <div className={styles.infoBanner}>
        <div>
          <div className={styles.infoLabel}>Hidden answer — locked at round start</div>
          <div className={styles.infoText}>
            Round ends when someone guesses correctly OR after 24hrs · {ENTRY_FEE} per attempt · Max {MAX_ATTEMPTS} attempts
          </div>
        </div>
        <div className={styles.lockRow}>🔒🔒🔒🔒🔒🔒</div>
      </div>

      {/* LP info */}
      <div className={styles.lpBanner}>
        💧 When pool exceeds $300 — 70% of excess goes to $EMLO liquidity pool · Prizes always paid from current pool
      </div>

      {/* Hints / Riddles */}
      {hints && (
        <HintBox
          hints={hints}
          bestMatch={bestMatch}
          hasAttempted={attempts.length > 0}
        />
      )}

      {/* Previous attempts */}
      {attempts.length > 0 && (
        <div className={styles.attemptsSection}>
          <div className={styles.sectionTitle}>Your attempts</div>
          {attempts.map((a, i) => (
            <div key={i} className={styles.attemptRow}>
              <span className={styles.attemptNum}>#{i + 1}</span>
              <span className={styles.attemptEmojis}>{a.picks.map(p => EMOJIS[p]).join(" ")}</span>
              <span className={styles.matchBadge} style={{ background: a.matches === 6 ? "#16a34a" : a.matches >= 4 ? "#f59e0b" : "#6b7280" }}>
                {a.matches}/6 match
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Emoji grid */}
      {!isMaxed && (
        <>
          <div className={styles.sectionTitle}>
            Pick 6 emojis · Attempt {attempts.length + 1} of {MAX_ATTEMPTS}
          </div>
          <div className={styles.emojiGrid}>
            {EMOJIS.map((emoji, idx) => (
              <button
                key={idx}
                className={`${styles.emojiCell} ${selected.includes(idx) ? styles.selected : ""}`}
                onClick={() => toggleEmoji(idx)}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Pick slots */}
          <div className={styles.picksRow}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={`${styles.pickSlot} ${selected[i] !== undefined ? styles.filled : ""}`}>
                {selected[i] !== undefined ? EMOJIS[selected[i]] : ""}
              </div>
            ))}
            <span className={styles.picksLabel}>{selected.length}/6</span>
          </div>

          <div className={styles.actionRow}>
            <button className={styles.btnClear} onClick={() => setSelected([])}>Clear</button>
            <button
              className={styles.btnEnter}
              disabled={!wallet.connected || selected.length !== 6 || loading}
              onClick={submitEntry}
            >
              {loading ? "Submitting..." : !wallet.connected ? "Connect wallet" : `Submit · ${ENTRY_FEE}`}
            </button>
          </div>
        </>
      )}

      {isMaxed && (
        <div className={styles.maxedBanner}>
          You've used all {MAX_ATTEMPTS} attempts for this round. Check back for the next round!
        </div>
      )}

      {/* Prize table */}
      <div className={styles.sectionTitle} style={{ marginTop: "1.5rem" }}>Prize distribution · 20 winners</div>
      <div className={styles.prizeTable}>
        {PRIZE_TABLE.map((p) => (
          <div key={p.rank} className={styles.prizeRow}>
            <span className={styles.prizeRank}>{p.rank}</span>
            <span className={styles.prizePct}>{p.pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
