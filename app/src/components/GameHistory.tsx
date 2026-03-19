"use client";
import { useState } from "react";
import styles from "./History.module.css";

export default function GameHistory({ dark }: { dark: boolean }) {
  const [filter, setFilter] = useState<"all" | "SOL" | "EMLO">("all");

  return (
    <div className={styles.historyWrap}>
      <div className={styles.historyHeader}>
        <div className={styles.historyTitle}>Round History</div>
        <div className={styles.filterRow}>
          {(["all", "SOL", "EMLO"] as const).map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "SOL" ? "◎ SOL" : "🪙 EMLO"}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        textAlign: "center",
        padding: "3rem 1rem",
        color: "#888",
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎲</div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No rounds yet</div>
        <div style={{ fontSize: 13 }}>
          Round history will appear here once the first round is completed.
        </div>
      </div>
    </div>
  );
}