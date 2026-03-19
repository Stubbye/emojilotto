"use client";
import { useState } from "react";
import { RoundHints, shouldShowEasyHint } from "../utils/riddles";
import styles from "./HintBox.module.css";

type Props = {
  hints: RoundHints;
  bestMatch: number;        // best match count player has achieved so far
  hasAttempted: boolean;    // has the player tried at least once?
};

export default function HintBox({ hints, bestMatch, hasAttempted }: Props) {
  const [hardOpen, setHardOpen] = useState(true);
  const [easyOpen, setEasyOpen] = useState(false);
  const showEasy = hasAttempted && shouldShowEasyHint(bestMatch);

  return (
    <div className={styles.wrap}>
      {/* Hard riddle — always visible */}
      <div className={styles.riddleCard}>
        <div className={styles.riddleHeader} onClick={() => setHardOpen(o => !o)}>
          <div className={styles.riddleLeft}>
            <span className={styles.diffBadge} style={{
              background: hints.hardRiddle.difficulty === 8 ? "#dc262614" : "#f59e0b14",
              color: hints.hardRiddle.difficulty === 8 ? "#dc2626" : "#f59e0b",
              border: hints.hardRiddle.difficulty === 8 ? "0.5px solid #dc262644" : "0.5px solid #f59e0b44"
            }}>
              🧩 Riddle · {hints.hardRiddle.difficulty}/10 difficulty
            </span>
            <span className={styles.riddleTitle}>Main clue — revealed at round start</span>
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

      {/* Easy riddle — unlocked after low score */}
      <div className={`${styles.riddleCard} ${!showEasy ? styles.locked : ""}`}>
        <div className={styles.riddleHeader} onClick={() => showEasy && setEasyOpen(o => !o)}>
          <div className={styles.riddleLeft}>
            <span className={styles.diffBadge} style={{
              background: showEasy ? "#f59e0b14" : "#88888814",
              color: showEasy ? "#f59e0b" : "#888",
              border: showEasy ? "0.5px solid #f59e0b44" : "0.5px solid #88888844"
            }}>
              {showEasy ? "🔓 Hint · 6/10 difficulty" : "🔒 Hint locked"}
            </span>
            <span className={styles.riddleTitle}>
              {showEasy
                ? "Easier clue — unlocked because your score was ≤ 2/6"
                : "Score 2/6 or less to unlock an easier clue"}
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
