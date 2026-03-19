"use client";
import { useState } from "react";
import styles from "./History.module.css";

const EMOJIS = ["🎯","🚀","💎","🌙","⚡","🔥","🎪","🦋","🌈","💫","🎲","🃏","🦊","🐉","🌺","💜","🎸","🏆","🎭","🍀","🔮","⭐","🎨","🌊"];

// Mock history data — replace with real on-chain data
const MOCK_HISTORY = Array.from({ length: 10 }, (_, i) => ({
  roundId: 10 - i,
  gameType: i % 2 === 0 ? "USDC" : "EMLO",
  date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
  answer: [0, 3, 7, 12, 18, 22],
  prizePool: i % 2 === 0 ? `$${(Math.random() * 200 + 50).toFixed(2)}` : `${Math.floor(Math.random() * 20000 + 30000).toLocaleString()} EMLO`,
  totalPlayers: Math.floor(Math.random() * 80 + 20),
  winners: Array.from({ length: Math.min(5, Math.floor(Math.random() * 8 + 1)) }, (_, j) => ({
    rank: j + 1,
    address: "5TRE...rVSC",
    matches: 6 - j,
    prize: j === 0 ? "50%" : j === 1 ? "18%" : j === 2 ? "10%" : j === 3 ? "5%" : "2%",
  })),
}));

export default function GameHistory({ dark }: { dark: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "USDC" | "EMLO">("all");

  const filtered = MOCK_HISTORY.filter(r => filter === "all" || r.gameType === filter);

  return (
    <div className={styles.historyWrap}>
      <div className={styles.historyHeader}>
        <div className={styles.historyTitle}>Last 10 rounds</div>
        <div className={styles.filterRow}>
          {(["all", "USDC", "EMLO"] as const).map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "USDC" ? "💵 USDC" : "🪙 EMLO"}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.roundList}>
        {filtered.map((round) => (
          <div key={round.roundId} className={styles.roundCard}>
            <div
              className={styles.roundHeader}
              onClick={() => setSelected(selected === round.roundId ? null : round.roundId)}
            >
              <div className={styles.roundLeft}>
                <span className={`${styles.gameTag} ${round.gameType === "USDC" ? styles.usdcTag : styles.emloTag}`}>
                  {round.gameType === "USDC" ? "💵 USDC" : "🪙 EMLO"}
                </span>
                <span className={styles.roundNum}>Round #{round.roundId}</span>
                <span className={styles.roundDate}>{round.date}</span>
              </div>
              <div className={styles.roundRight}>
                <span className={styles.roundPool}>{round.prizePool}</span>
                <span className={styles.roundPlayers}>{round.totalPlayers} players</span>
                <span className={styles.expandIcon}>{selected === round.roundId ? "▲" : "▼"}</span>
              </div>
            </div>

            {selected === round.roundId && (
              <div className={styles.roundDetail}>
                <div className={styles.answerRow}>
                  <span className={styles.answerLabel}>Winning combination:</span>
                  <span className={styles.answerEmojis}>
                    {round.answer.map(i => EMOJIS[i]).join(" ")}
                  </span>
                </div>

                <div className={styles.winnersTitle}>🏆 Top winners</div>
                <div className={styles.winnersList}>
                  {round.winners.map((w) => (
                    <div key={w.rank} className={styles.winnerRow}>
                      <span className={styles.winnerRank}>
                        {w.rank === 1 ? "🥇" : w.rank === 2 ? "🥈" : w.rank === 3 ? "🥉" : `#${w.rank}`}
                      </span>
                      <span className={styles.winnerAddr}>{w.address}</span>
                      <span className={styles.winnerMatches}>{w.matches}/6 matches</span>
                      <span className={styles.winnerPrize}>{w.prize}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
