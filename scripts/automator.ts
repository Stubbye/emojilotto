import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as fs from "fs";
import * as crypto from "crypto";

const PROGRAM_ID = process.env.PROGRAM_ID || "BSddc8F1yCUqNnMDSYhtBC79Huu3GZHfJPTJngQSM7Ru";
const RPC = process.env.RPC_ENDPOINT || "https://api.devnet.solana.com";
const STATE_FILE = "./round-state.json";

const EMOJIS = ["🎯","🚀","💎","🌙","⚡","🔥","🎪","🦋","🌈","💫","🎲","🃏","🦊","🐉","🌺","💜","🎸","🏆","🎭","🍀","🔮","⭐","🎨","🌊"];

function log(msg: string) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  }
  return { usdc: { roundId: 0, endTime: 0 }, emlo: { roundId: 0, endTime: 0 }, launchTime: Date.now() };
}

function saveState(state: any) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function generateAnswer() {
  const indices = Array.from({ length: 24 }, (_, i) => i).sort(() => Math.random() - 0.5);
  const answer = indices.slice(0, 6);
  log(`Generated answer: ${answer.map(i => EMOJIS[i]).join(" ")}`);
  return answer;
}

async function main() {
  log("EmojiLotto Automator starting...");
  
  const state = loadState();
  const now = Date.now();
  
  if (now >= state.usdc.endTime) {
    const newRoundId = state.usdc.roundId + 1;
    const answer = generateAnswer();
    log(`Starting USDC round #${newRoundId}`);
    state.usdc = { roundId: newRoundId, endTime: now + 86400000 };
    saveState(state);
    log(`USDC round #${newRoundId} started, ends in 24hrs`);
  } else {
    const mins = Math.floor((state.usdc.endTime - now) / 60000);
    log(`USDC round #${state.usdc.roundId} has ${mins} minutes left`);
  }

  if (now >= state.emlo.endTime) {
    const newRoundId = state.emlo.roundId + 1;
    const answer = generateAnswer();
    const isFirstWeek = now - state.launchTime < 7 * 24 * 60 * 60 * 1000;
    const duration = isFirstWeek ? 3600000 : 14400000;
    log(`Starting EMLO round #${newRoundId}`);
    state.emlo = { roundId: newRoundId, endTime: now + duration };
    saveState(state);
    log(`EMLO round #${newRoundId} started`);
  } else {
    const mins = Math.floor((state.emlo.endTime - now) / 60000);
    log(`EMLO round #${state.emlo.roundId} has ${mins} minutes left`);
  }

  log("Automator finished!");
}

main().catch(e => {
  console.error("Error:", e);
  process.exit(1);
});
```

