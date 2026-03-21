export type Riddle = {
  id: number;
  text: string;
  hint: string;
};

export type RoundHints = {
  roundId: number;
  hardRiddle: Riddle;
  easyRiddle: Riddle;
};

export function getHintsForRound(
  roundId: number,
  gameType: "usdc" | "emlo"
): RoundHints | null {
  try {
    const key = gameType === "usdc" ? "sol_" + roundId : "emlo_" + roundId;
    const riddles = require("./generatedRiddles.json");
    const data = riddles[key];
    if (!data) return null;
    return {
      roundId,
      hardRiddle: { id: 1, text: data.hardRiddle.text, hint: data.hardRiddle.hint },
      easyRiddle: { id: 2, text: data.easyRiddle.text, hint: data.easyRiddle.hint },
    };
  } catch(e) {
    return null;
  }
}

export function shouldShowEasyHint(bestMatchCount: number): boolean {
  return bestMatchCount <= 2;
}