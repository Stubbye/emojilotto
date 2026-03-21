"use client";
import { useState } from "react";
import { RoundHints, shouldShowEasyHint } from "../utils/riddles";
import styles from "./HintBox.module.css";

type Props = {
  hints: RoundHints;
  bestMatch: number;
  hasAttempted: boolean;
};

export default function HintBox({ hints, bestMatch, hasAttempted }: Props) {
  const [hardOpen, setHardOpen] = useState(true);
  const [easyOpen, setEasyOpen] = useState(false);
  const showEasy = hasAttempted && shouldShowEasyHint(bestMatch);

  return (
    <div className={styles.wrap}>
      <div className={styles.riddleCard}>
        <div className={styles.riddleHeader} onClick={() => setHardOpen(o => !o)}>
          <div className={styles.riddleLeft}>
            <span className={styles.diffBadge} style={{
              background: "#9945FF14",
              color: "#9945FF",
              border: "0.5px solid #9945FF44"
            }}>
              🧩 Round Riddle
            </span>
            <span className={styles.riddleTitle}>Clue revealed at round start</span>
          </div>
          <span className={styles.chevron}>{hardOpen ? "▲" : "▼"}</span>
        </div>
        {hardOpen && (
          <div className={styles.riddleBody}>
            <p className={styles.riddleText}>"{hints.hardRiddle.text}"</p>
            <div className={styles.hintTag}>
              💡 {hints.hardRiddle.hint}
            </div>
          </div>
        )}
      </div>

      <div className={`${styles.riddleCard} ${!showEasy ? styles.locked : ""}`}>
        <div className={styles.riddleHeader} onClick={() => showEasy && setEasyOpen(o => !o)}>
          <div className={styles.riddleLeft}>
            <span className={styles.diffBadge} style={{
              background: showEasy ? "#f59e0b14" : "#88888814",
              color: showEasy ? "#f59e0b" : "#888",
              border: showEasy ? "0.5px solid #f59e0b44" : "0.5px solid #88888844"
            }}>
              {showEasy ? "🔓 Bonus Hint" : "🔒 Hint locked"}
            </span>
            <span className={styles.riddleTitle}>
              {showEasy ? "Unlocked — use this to improve your guess" : "Get a low score to unlock a bonus hint"}
            </span>
          </div>
          {showEasy && <span className={styles.chevron}>{easyOpen ? "▲" : "▼"}</span>}
        </div>
        {showEasy && easyOpen && (
          <div className={styles.riddleBody}>
            <p className={styles.riddleText}>"{hints.easyRiddle.text}"</p>
            <div className={styles.hintTag}>
              💡 {hints.easyRiddle.hint}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}