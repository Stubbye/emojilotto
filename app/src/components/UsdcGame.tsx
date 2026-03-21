"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import styles from "./Game.module.css";
import HintBox from "./HintBox";
import { getHintsForRound } from "../utils/riddles";

const EMOJIS = ["🎯","🚀","💎","🌙","⚡","🔥","🎪","🦋","🌈","💫","🎲","🃏","🦊","🐉","🌺","💜","🎸","🏆","🎭","🍀","🔮","⭐","🎨","🌊"];
const MAX_ATTEMPTS = 3;
const ENTRY_FEE = "0.01 SOL";
const ROUND_ID = Number(process.env.NEXT_PUBLIC_USDC_ROUND_ID || "1");
const ROUND_END_KEY = "sol_round_end";
const ROUND_DURATION = 900000;
const TOTAL_EMOJIS = 24;
const PICK_COUNT = 6;

const PRIZE_TABLE = [
  { rank: "🥇 1st", pct: 50 },
  { rank: "🥈 2nd", pct: 18 },
  { rank: "🥉 3rd", pct: 10 },
  { rank: "4th", pct: 5 },
  { rank: "5th–10th", pct: 2 },
  { rank: "11th–20th", pct: 0.7 },
];

function getOrCreateEndTime(): number {
  if (typeof window === "undefined") return Date.now() + ROUND_DURATION;
  const stored = localStorage.getItem(ROUND_END_KEY);
  if (stored) {
    const endTime = Number(stored);
    if (endTime > Date.now()) return endTime;
  }
  const newEndTime = Date.now() + ROUND_DURATION;
  localStorage.setItem(ROUND_END_KEY, String(newEndTime));
  return newEndTime;
}

function calcWinProbability(matches: number, players: number): number {
  // Probability based on matches out of 6
  const baseProb = matches === 6 ? 100 : matches === 5 ? 40 : matches === 4 ? 15 : matches === 3 ? 5 : matches === 2 ? 1 : 0.1;
  // Adjust for competition — more players = lower chance
  const adjusted = players > 1 ? baseProb / Math.sqrt(players) : baseProb;
  return Math.min(100, Math.max(0.01, adjusted));
}

function getPrizeRank(matches: number): number {
  if (matches === 6) return 1;
  if (matches === 5) return 2;
  if (matches === 4) return 3;
  if (matches === 3) return 4;
  return 0;
}

export default function UsdcGame({ dark }: { dark: boolean }) {
  const wallet = useWallet();
  const [selected, setSelected] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<{picks: number[], matches: number}[]>([]);
  const [timeLeft, setTimeLeft] = useState("");
  const [pct, setPct] = useState(100);
  const [prizePool, setPrizePool] = useState(5);
  const [players, setPlayers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [endTime, setEndTime] = useState<number>(0);

  useEffect(() => {
    const et = getOrCreateEndTime();
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
      setPct(Math.round((diff / ROUND_DURATION) * 100));
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
    const matches = Math.floor(Math.random() * 7);
    setAttempts(prev => [...prev, { picks: [...selected], matches }]);
    setSelected([]);
    setPrizePool(p => p + 0.01);
    setPlayers(p => p + 1);
    setLoading(false);
  };

  const attemptsLeft = MAX_ATTEMPTS - attempts.length;
  const isMaxed = attempts.length >= MAX_ATTEMPTS;
  const hints = getHintsForRound(ROUND_ID, "sol");
  const bestMatch = attempts.length > 0 ? Math.max(...attempts.map(a => a.matches)) : 0;
  const winProb = attempts.length > 0 ? calcWinProbability(bestMatch, players) : null;
  const bestRank = getPrizeRank(bestMatch);

  return (
    <div className={styles.gameWrap}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Live Prize Pool</div>
          <div className={styles.statVal} style={{ color: "#16a34a" }}>{prizePool.toFixed(2)} SOL</div>
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

      <div className={styles.poolBreakdown}>
        <span>🥇 1st wins <b>{(prizePool * 0.50).toFixed(3)} SOL</b></span>
        <span>🥈 2nd wins <b>{(prizePool * 0.18).toFixed(3)} SOL</b></span>
        <span>🥉 3rd wins <b>{(prizePool * 0.10).toFixed(3)} SOL</b></span>
      </div>

      <div className={styles.timerWrap}>
        <div className={styles.timerFill} style={{ width: `${pct}%`, background: pct < 20 ? "#dc2626" : pct < 40 ? "#f59e0b" : "#9945FF" }} />
      </div>

      <div className={styles.infoBanner}>
        <div>
          <div className={styles.infoLabel}>Hidden answer — locked at round start</div>
          <div className={styles.infoText}>
            Round ends after 15 mins · {ENTRY_FEE} per attempt · Max {MAX_ATTEMPTS} attempts · Equal scores split the prize!
          </div>
        </div>
        <div className={styles.lockRow}>🔒🔒🔒🔒🔒🔒</div>
      </div>

      <div className={styles.lpBanner}>
        💧 Playing on Solana Devnet · Equal scorers split prizes equally
      </div>

      {hints && (
        <HintBox hints={hints} bestMatch={bestMatch} hasAttempted={attempts.length > 0} />
      )}

      {/* Win probability banner */}
      {winProb !== null && (
        <div style={{
          margin: "0.75rem 0",
          padding: "0.75rem 1rem",
          borderRadius: 10,
          background: bestMatch >= 4 ? "#16a34a22" : bestMatch >= 2 ? "#f59e0b22" : "#6b728022",
          border: `1px solid ${bestMatch >= 4 ? "#16a34a" : bestMatch >= 2 ? "#f59e0b" : "#6b7280"}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap" as const,
          gap: 8
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              🎯 Your best: {bestMatch}/6 matches
              {bestRank > 0 && <span style={{ marginLeft: 8, color: "#f59e0b" }}>→ Rank #{bestRank} prize!</span>}
            </div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
              Win probability: <b>{winProb.toFixed(2)}%</b>
              {players > 1 && <span> · {players} players competing · Equal scores split prize equally</span>}
            </div>
          </div>
          <div style={{ fontSize: 22 }}>
            {bestMatch === 6 ? "🏆" : bestMatch >= 4 ? "🔥" : bestMatch >= 2 ? "💫" : "🎲"}
          </div>
        </div>
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
                className={`${styles.emojiCell} ${selected.includes(idx) ? styles.selected : ""}`}
                onClick={() => toggleEmoji(idx)}
              >
                {emoji}
              </button>
            ))}
          </div>

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
          You've used all {MAX_ATTEMPTS} attempts! Best score: {bestMatch}/6 · Win probability: {winProb?.toFixed(2)}%
        </div>
      )}

      <div className={styles.sectionTitle} style={{ marginTop: "1.5rem" }}>Prize distribution · 20 winners · Equal scores split prizes</div>
      <div className={styles.prizeTable}>
        {PRIZE_TABLE.map((p) => (
          <div key={p.rank} className={styles.prizeRow}>
            <span className={styles.prizeRank}>{p.rank}</span>
            <span className={styles.prizePct}>{p.pct}% = {(prizePool * p.pct / 100).toFixed(3)} SOL</span>
          </div>
        ))}
      </div>
    </div>
  );
}