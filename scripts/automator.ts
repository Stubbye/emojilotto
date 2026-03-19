import * as fs from "fs";

const STATE_FILE = "./round-state.json";

function log(msg: string) {
  console.log("[" + new Date().toISOString() + "] " + msg);
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

async function main() {
  log("EmojiLotto Automator starting...");
  const state = loadState();
  const now = Date.now();

  if (now >= state.usdc.endTime) {
    state.usdc.roundId += 1;
    state.usdc.endTime = now + 86400000;
    saveState(state);
    log("Started USDC round " + state.usdc.roundId);
  } else {
    log("USDC round " + state.usdc.roundId + " still running");
  }

  if (now >= state.emlo.endTime) {
    state.emlo.roundId += 1;
    state.emlo.endTime = now + 3600000;
    saveState(state);
    log("Started EMLO round " + state.emlo.roundId);
  } else {
    log("EMLO round " + state.emlo.roundId + " still running");
  }

  log("Done!");
}

main().catch(e => { console.error(e); process.exit(1); });
