/**
 * How to add custom riddles for each round
 * ==========================================
 * 
 * Open this file: app/src/utils/riddles.ts
 * 
 * To add a USDC riddle for round 6, add to USDC_RIDDLE_BANK:
 * 
 * {
 *   roundId: 6,
 *   hardRiddle: {
 *     id: 601,
 *     difficulty: 8,
 *     text: "YOUR HARD RIDDLE HERE — make it cryptic and poetic",
 *     hint: "A small nudge that doesn't give it away",
 *   },
 *   easyRiddle: {
 *     id: 602,
 *     difficulty: 6,
 *     text: "YOUR EASIER RIDDLE HERE — more descriptive but still vague",
 *     hint: "A clearer nudge",
 *   },
 * }
 * 
 * Tips for writing good riddles:
 * ================================
 * 
 * HARD (8/10):
 * - Use metaphorical, poetic language
 * - Describe the emoji's MEANING or SYMBOLISM, not its appearance
 * - Example for 🔥: "the hunger that feeds on light itself"
 * - Example for 💎: "the stone of kings"
 * - Example for 🌊: "the tide that never sleeps"
 * - Group all 6 emojis into one riddle — don't hint which is which
 * 
 * EASY (6/10):
 * - More descriptive but still no direct emoji names
 * - Break into 6 clear descriptions, one per emoji
 * - Example for 🔥: "something that consumes everything it touches"
 * - Example for 💎: "a rare shiny stone found deep underground"
 * - Still don't mention the emoji name directly
 * 
 * The system automatically cycles riddles if you have fewer riddles
 * than rounds (e.g. 5 riddles will cycle: round 6 uses riddle 1 again).
 * So always add new riddles before the round starts!
 * 
 * Hint unlock logic:
 * ==================
 * - Player submits a guess
 * - If they match 2/6 or fewer emojis → easy hint unlocks automatically
 * - If they match 3/6 or more → only the hard riddle stays visible
 * - This is all handled in HintBox.tsx automatically
 */

export {};
