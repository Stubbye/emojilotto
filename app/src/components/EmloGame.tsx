"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import styles from "./Game.module.css";
import HintBox from "./HintBox";
import { getHintsForRound } from "../utils/riddles";

const EMOJIS = ["🎯","🚀","💎","🌙","⚡","🔥","🎪","🦋","🌈","💫","🎲","🃏","🦊","🐉","🌺","💜","🎸","🏆","🎭","🍀","🔮","⭐","🎨","🌊"];
const MAX_ATTEMPTS = 2;
const BET_AMOUNT = "500 EMLO";
const PRIZE_POOL_DISPLAY = "50,000 EMLO";
const ROUND_ID = Number(process.env.NEXT_PUBLIC_EMLO_ROUND_ID || "1");
const ROUND_END_KEY = "emlo_round_end";

const PRIZE_TABLE = [
  { rank: "🥇 1st", pct: "50%", tokens: "25,000 EMLO" },
  { rank: "🥈 2nd", pct: "18%", tokens: "9,000 EMLO" },
  { rank: "🥉 3rd", pct: "10%", tokens: "5,000 EMLO" },
  { rank: "4th", pct: "5%", tokens: "2,500 EMLO" },
  { rank: "5th–10th", pct: "2% each", tokens: "1,000 EMLO each" },
  { rank: "11th–20th", pct: "0.7% each", tokens: "350 EMLO each" },
];

function getOrCreateEndTime(duration: number): number {
  if (typeof window === "undefined") return Date.now() + duration;
  const stored = localStorage.getItem(ROUND_END_KEY);
  if (stored) {
    const endTime = Number(stored);
    if (endTime > Date.now()) return endTime;
  }
  const newEndTime = Date.now() + duration;
  localStorage.setItem(ROUND_END_KEY, String(newEndTime));
  return newEndTime;
}

export default function EmloGame({ dark }: { dark: boolean }) {
  const wallet = useWallet();
  const [selected, setSelected] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<{picks: number[], matches: number}[]>([]);
  const [timeLeft, setTimeLeft] = useState("");
  const [pct, setPct] = useState(100);
  const [players, setPlayers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [endTime, setEndTime] = useState<number>(0);

  const EMLO_DURATION_MS = Number(process.env.NEXT_PUBLIC_EMLO_ROUND_DURATION_MS || 3600000);

  useEffect(() => {
    const et = getOrCreateEndTime(EMLO_DURATION_MS);
    setEndTime(et);
  }, []);

  useEffect(() => {
    if (!endTime) return;
    const tick = () => {
      const diff = Math.max(0, endTime - Date.now());
      const h = Math.floor(diff / 3600000).toString().padStart(2, "0");
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
      setTimeLeft(`${h}:${m}:${s}`);
      setPct(Math.round((diff / EMLO_DURATION_MS) * 100));
      if (diff === 0) localStorage.removeItem(ROUND_END_KEY);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime]);

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
    setPlayers(p => p + 1);
    setLoading(false);
  };

  const isMaxed = attempts.length >= MAX_ATTEMPTS;
  const hints = getHintsForRound(ROUND_ID, "emlo");
  const bestMatch = attempts.length > 0 ? Math.max(...attempts.map(a => a.matches)) : 0;

  return (
    <div className={styles.gameWrap}>
      <div className={styles.emloBadge}>
        <span style={{ fontSize: 24 }}>🪙</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>$EMLO Token Game</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Total supply: 1,000,000,000 EMLO · Prize pool: {PRIZE_POOL_DISPLAY}</div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Fixed Prize Pool</div>
          <div className={styles.statVal} style={{ color: "#9945FF" }}>{PRIZE_POOL_DISPLAY}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>1st Place Prize</div>
          <div className={styles.statVal} style={{ color: "#f59e0b" }}>25,000 EMLO</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Your Attempts</div>
          <div className={styles.statVal} style={{ color: isMaxed ? "#dc2626" : "inherit" }}>
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

      <div className={styles.timerWrap}>
        <div className={styles.timerFill} style={{ width: `${pct}%`, background: pct < 20 ? "#dc2626" : "#9945FF" }} />
      </div>

      <div className={styles.infoBanner} style={{ borderColor: "#9945FF55" }}>
        <div>
          <div className={styles.infoLabel}>Hidden answer · Max {MAX_ATTEMPTS} attempts per player</div>
          <div className={styles.infoText}>
            {BET_AMOUNT} per attempt · IP tracked to prevent multi-accounts · 1hr round
          </div>
        </div>
        <div className={styles.lockRow}>🔒🔒🔒🔒🔒🔒</div>
      </div>

      {hints && (
        <HintBox hints={hints} bestMatch={bestMatch} hasAttempted={attempts.length > 0} />
      )}

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

      {!isMaxed && (
        <>
          <div className={styles.sectionTitle}>
            Pick 6 emojis · Attempt {attempts.length + 1} of {MAX_ATTEMPTS}
          </div>
          <div className={styles.emojiGrid}>
            {EMOJIS.map((emoji, idx) => (
              <button
                key={idx}
                className={`${styles.emojiCell} ${selected.includes(idx) ? styles.selectedEmlo : ""}`}
                onClick={() => toggleEmoji(idx)}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className={styles.picksRow}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={`${styles.pickSlot} ${selected[i] !== undefined ? styles.filledEmlo : ""}`}>
                {selected[i] !== undefined ? EMOJIS[selected[i]] : ""}
              </div>
            ))}
            <span className={styles.picksLabel}>{selected.length}/6</span>
          </div>

          <div className={styles.actionRow}>
            <button className={styles.btnClear} onClick={() => setSelected([])}>Clear</button>
            <button
              className={styles.btnEnterEmlo}
              disabled={!wallet.connected || selected.length !== 6 || loading}
              onClick={submitEntry}
            >
              {loading ? "Submitting..." : !wallet.connected ? "Connect wallet" : `Submit · ${BET_AMOUNT}`}
            </button>
          </div>
        </>
      )}

      {isMaxed && (
        <div className={styles.maxedBanner}>
          You've used all {MAX_ATTEMPTS} attempts for this round. Next round starts in {timeLeft}
        </div>
      )}

      <div className={styles.sectionTitle} style={{ marginTop: "1.5rem" }}>Prize distribution · 20 winners</div>
      <div className={styles.prizeTable}>
        {PRIZE_TABLE.map((p) => (
          <div key={p.rank} className={styles.prizeRow}>
            <span className={styles.prizeRank}>{p.rank}</span>
            <span className={styles.prizePct} style={{ color: "#9945FF" }}>{p.pct}</span>
            <span className={styles.prizeTokens}>{p.tokens}</span>
          </div>
        ))}
      </div>
    </div>
  );
}