// Riddle bank for EmojiLotto
// Each round gets one hard riddle (8/10) shown at start
// and one easy riddle (6/10) unlocked after 2/6 or less matches

export type Riddle = {
  id: number;
  text: string;
  difficulty: 8 | 6 | 4;
  hint: string;
};

export type RoundHints = {
  roundId: number;
  hardRiddle: Riddle;
  easyRiddle: Riddle;
};

// ─── USDC Game Riddles ────────────────────────────────────────────────────────
// These are cryptic riddles that describe the 6 winning emojis as a group
// without directly naming them. Written by admin when creating the round.

export const USDC_RIDDLE_BANK: RoundHints[] = [
  {
    roundId: 1,
    hardRiddle: {
      id: 101,
      difficulty: 8,
      text: "I am the archer's purpose, the void between stars, the stone of kings, the tide that never sleeps, the bolt that splits silence, and the hunger that feeds on light itself. What are we?",
      hint: "We are six. Some of us are forces of nature, some are symbols of human desire.",
    },
    easyRiddle: {
      id: 102,
      difficulty: 6,
      text: "Among us you will find: something you aim at, something found deep in the earth, something that lights the night sky, something the ocean does, something that powers a storm, and something that consumes everything it touches.",
      hint: "Think: a target, a gemstone, a celestial body, a natural force × 3.",
    },
  },
  {
    roundId: 2,
    hardRiddle: {
      id: 201,
      difficulty: 8,
      text: "We are a vessel that sails without water, a butterfly that never lands, a spectrum born from rain, a spark that never fades, a dancer without a stage, and a jungle spirit with orange fur. Find us.",
      hint: "We cross the sky, the forest, and the imagination.",
    },
    easyRiddle: {
      id: 202,
      difficulty: 6,
      text: "Look for something that travels through space, something with colourful wings, something you see after rain, something that electrifies the air, something that performs for crowds, and a wild creature with a bushy tail.",
      hint: "Think: flight, colour, weather, energy, entertainment, wildlife.",
    },
  },
  {
    roundId: 3,
    hardRiddle: {
      id: 301,
      difficulty: 8,
      text: "I am what warriors chase, what gamblers roll, what jesters hold, what healers brew, what gardeners find lucky, and what musicians strike. Name all six.",
      hint: "We live between chance, performance, and tradition.",
    },
    easyRiddle: {
      id: 302,
      difficulty: 6,
      text: "Search for: a symbol of victory, something with dots on its face, something a clown carries, something found in a witch's potion, a four-leaf symbol, and something with strings.",
      hint: "Think: achievement, games, comedy, mystery, luck, music.",
    },
  },
  {
    roundId: 4,
    hardRiddle: {
      id: 401,
      difficulty: 8,
      text: "We are the beast of myth, the bloom of the tropics, the colour of royalty, the voice of rock, the pinnacle of all contests, and the mask that hides a thousand faces. Who are we?",
      hint: "We span myth, nature, colour, sound, glory, and illusion.",
    },
    easyRiddle: {
      id: 402,
      difficulty: 6,
      text: "Among us: a fire-breathing legendary creature, a flower that grows in warm climates, a shade between red and blue, an instrument played loudly on stage, a golden cup given to champions, and something worn at a theatre.",
      hint: "Think: fantasy, flora, colour, music, sport, performance.",
    },
  },
  {
    roundId: 5,
    hardRiddle: {
      id: 501,
      difficulty: 8,
      text: "We are the eye in the sky at night, the wish-granter in orbit, the painter's tool, the ocean's eternal motion, the wizard's gaze, and the warrior's dream. Seek us.",
      hint: "We belong to the cosmos, the canvas, the sea, and the mind.",
    },
    easyRiddle: {
      id: 502,
      difficulty: 6,
      text: "Look for: Earth's natural satellite, a luminous body in space, something used to create art, the movement of seawater, a ball of crystal used for seeing the future, and a shining five-pointed shape.",
      hint: "Think: moon, star, art, ocean, magic, light.",
    },
  },
];

// ─── EMLO Game Riddles ────────────────────────────────────────────────────────
// EMLO riddles are EASIER than USDC ones (crypto/meme themed)
// Hard riddle = 6/10 (shown at start)
// Easy riddle = 4/10 (unlocked after 2/6 or less matches)

export const EMLO_RIDDLE_BANK: RoundHints[] = [
  {
    roundId: 1,
    hardRiddle: {
      id: 1001,
      difficulty: 6,
      text: "Six things every crypto degen knows: the dream destination of every coin, the rarest thing in any wallet, the color of the sky when charts are red, the power source of every blockchain, what happens to your portfolio in a bear market, and what a sniper aims at on launch day.",
      hint: "Think about what degens say, hold, see, need, fear, and hunt.",
    },
    easyRiddle: {
      id: 1002,
      difficulty: 4,
      text: "Find these six: where every coin wants to go (up), something shiny whales accumulate, the dark sky behind every candlestick chart, what powers a mining rig, a red candle describes this, and the bullseye on a token launch.",
      hint: "🚀 💎 🌙 ⚡ 🔥 🎯 — one of these is NOT in the answer, the rest might be!",
    },
  },
  {
    roundId: 2,
    hardRiddle: {
      id: 2001,
      difficulty: 6,
      text: "Six symbols from the memecoin jungle: something luck brings to an airdrop, a creature that became a meme token, what an NFT reveal looks like, the weather inside a leverage trade, the energy of a token launch, and what a diamond hand's portfolio does.",
      hint: "Luck, wildlife, sparkle, storm, launch energy, and long-term gains.",
    },
    easyRiddle: {
      id: 2002,
      difficulty: 4,
      text: "Look for: a four-leaf symbol of luck, a sly orange animal that's also a browser, something that glitters on an NFT thumbnail, a zigzag bolt in the sky, something that burns bright at launch, and an arc of colours after rain.",
      hint: "🍀 🦊 💫 ⚡ 🔥 🌈 — two of these might be your answer!",
    },
  },
  {
    roundId: 3,
    hardRiddle: {
      id: 3001,
      difficulty: 6,
      text: "Six things from the world of crypto culture: what you win when you top a leaderboard, what a degen rolls when they ape in, a CT personality known for jokes, something a dev deploys, what shines above every 100x project, and what every PFP collection is made with.",
      hint: "Victory, chance, humour, code, fame, and art.",
    },
    easyRiddle: {
      id: 3002,
      difficulty: 4,
      text: "Find: a golden cup for the winner, a cube with dots used in games, a playing card character who is the fool, a swirling ball of magic, a five-pointed shape in the sky, and a palette used for painting.",
      hint: "🏆 🎲 🃏 🔮 ⭐ 🎨 — these are all in the emoji grid!",
    },
  },
];

// ─── Helper functions ─────────────────────────────────────────────────────────

export function getHintsForRound(
  roundId: number,
  gameType: "usdc" | "emlo"
): RoundHints | null {
  const bank = gameType === "usdc" ? USDC_RIDDLE_BANK : EMLO_RIDDLE_BANK;
  // Cycle through riddles if roundId exceeds bank size
  const idx = (roundId - 1) % bank.length;
  return bank[idx] || null;
}

export function shouldShowEasyHint(bestMatchCount: number): boolean {
  return bestMatchCount <= 2;
}
