import * as fs from "fs";
import * as https from "https";

const STATE_FILE = "./round-state.json";
const RIDDLES_FILE = "./app/src/utils/generatedRiddles.json";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

function log(msg: string) {
  console.log("[" + new Date().toISOString() + "] " + msg);
}

function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  }
  return { sol: { roundId: 0, endTime: 0 }, emlo: { roundId: 0, endTime: 0 }, launchTime: Date.now() };
}

function saveState(state: any) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function loadRiddles() {
  if (fs.existsSync(RIDDLES_FILE)) {
    return JSON.parse(fs.readFileSync(RIDDLES_FILE, "utf-8"));
  }
  return {};
}

function saveRiddles(riddles: any) {
  fs.writeFileSync(RIDDLES_FILE, JSON.stringify(riddles, null, 2));
}

function httpsPost(body: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(body);
    const options = {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Length": data.length
      }
    };
    const req = https.request(options, (res) => {
      let result = "";
      res.on("data", (chunk) => result += chunk);
      res.on("end", () => resolve(result));
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function generateRiddle(gameType: string, roundId: number): Promise<any> {
  log("Generating riddle for " + gameType + " round " + roundId);

  const prompt = gameType === "sol"
    ? `Generate a cryptic riddle for EmojiLotto lottery game. Describe exactly 6 emojis from this list without naming them: target,rocket,gem,moon,lightning,fire,circus,butterfly,rainbow,sparkles,dice,joker,fox,dragon,flower,purple,guitar,trophy,masks,clover,crystal,star,palette,wave. Make it very hard and poetic. Return ONLY JSON no markdown: {"hardRiddle":{"text":"...","hint":"..."},"easyRiddle":{"text":"...","hint":"..."},"answer":[0,1,2,3,4,5]} where answer has 6 unique indices 0-23.`
    : `Generate a crypto/memecoin themed riddle for EmojiLotto. Describe exactly 6 emojis from: target,rocket,gem,moon,lightning,fire,circus,butterfly,rainbow,sparkles,dice,joker,fox,dragon,flower,purple,guitar,trophy,masks,clover,crystal,star,palette,wave. Return ONLY JSON no markdown: {"hardRiddle":{"text":"...","hint":"..."},"easyRiddle":{"text":"...","hint":"..."},"answer":[0,1,2,3,4,5]} where answer has 6 unique indices 0-23.`;

  const body = JSON.stringify({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }]
  });

  const result = await httpsPost(body);
  const data = JSON.parse(result);
  const text = data.content[0].text;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

async function main() {
  log("EmojiLotto Automator starting...");
  const state = loadState();
  const riddles = loadRiddles();
  const now = Date.now();

  if (now >= state.sol.endTime) {
    const newRoundId = state.sol.roundId + 1;
    log("Starting SOL round #" + newRoundId);
    try {
      const riddle = await generateRiddle("sol", newRoundId);
      riddles["sol_" + newRoundId] = riddle;
      saveRiddles(riddles);
      log("Riddle generated for SOL round #" + newRoundId);
    } catch(e) {
      log("Riddle generation failed: " + e);
    }
    state.sol = { roundId: newRoundId, endTime: now + 900000 };
    saveState(state);
    log("SOL round #" + newRoundId + " started");
  } else {
    const mins = Math.floor((state.sol.endTime - now) / 60000);
    log("SOL round #" + state.sol.roundId + " has " + mins + " minutes left");
  }

  if (now >= state.emlo.endTime) {
    const newRoundId = state.emlo.roundId + 1;
    log("Starting EMLO round #" + newRoundId);
    try {
      const riddle = await generateRiddle("emlo", newRoundId);
      riddles["emlo_" + newRoundId] = riddle;
      saveRiddles(riddles);
      log("Riddle generated for EMLO round #" + newRoundId);
    } catch(e) {
      log("Riddle generation failed: " + e);
    }
    const isFirstWeek = now - state.launchTime < 7 * 24 * 60 * 60 * 1000;
    const duration = isFirstWeek ? 3600000 : 14400000;
    state.emlo = { roundId: newRoundId, endTime: now + duration };
    saveState(state);
    log("EMLO round #" + newRoundId + " started");
  } else {
    const mins = Math.floor((state.emlo.endTime - now) / 60000);
    log("EMLO round #" + state.emlo.roundId + " has " + mins + " minutes left");
  }

  log("Done!");
}

main().catch(e => { console.error(e); process.exit(1); });
