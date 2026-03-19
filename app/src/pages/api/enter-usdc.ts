// pages/api/enter-usdc.ts
// Free tier — rate limit 5 req/min per IP (stricter to save Upstash quota)

import type { NextApiRequest, NextApiResponse } from "next";

const UPSTASH_URL = process.env.UPSTASH_REDIS_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_TOKEN;

async function redis(...args: (string | number)[]) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return { result: null };
  try {
    const res = await fetch(`${UPSTASH_URL}/${args.join("/")}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    return res.json();
  } catch { return { result: null }; }
}

async function hashIp(ip: string): Promise<string> {
  const salt = process.env.IP_SALT || "emlo_free_salt";
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(ip + salt)
  );
  return Buffer.from(buf).toString("hex").slice(0, 16); // shorter key = saves Redis memory
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim()
    || req.socket.remoteAddress
    || "unknown";

  // Rate limit: 5 req/min per IP (free tier friendly)
  const rlKey = `rl:${ip.slice(0, 20)}:${Math.floor(Date.now() / 60000)}`;
  const rl = await redis("INCR", rlKey);
  if (rl.result === 1) await redis("EXPIRE", rlKey, "120");
  if (rl.result > 5) {
    return res.status(429).json({ error: "Too many requests. Wait a minute and try again." });
  }

  const { roundId, emojiPicks, walletAddress, gameType } = req.body;

  if (!roundId || !emojiPicks || !walletAddress) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Validate picks
  if (!Array.isArray(emojiPicks) || emojiPicks.length !== 6) {
    return res.status(400).json({ error: "Pick exactly 6 emojis" });
  }
  if (new Set(emojiPicks).size !== 6) {
    return res.status(400).json({ error: "No duplicate emojis" });
  }
  if (emojiPicks.some((i: number) => i < 0 || i > 23)) {
    return res.status(400).json({ error: "Invalid emoji index" });
  }

  // IP multi-account check
  const ipHash = await hashIp(ip);
  const ipKey = `r${roundId}:${gameType || "u"}:ip`;
  const ipExists = await redis("SISMEMBER", ipKey, ipHash);
  if (ipExists.result === 1) {
    return res.status(403).json({
      error: "This device already entered this round from a different wallet."
    });
  }

  // Attempt count check
  const maxAttempts = gameType === "emlo" ? 2 : 3;
  const attKey = `r${roundId}:${gameType || "u"}:att:${walletAddress.slice(0, 12)}`;
  const att = await redis("GET", attKey);
  const count = att.result ? parseInt(att.result as string) : 0;
  if (count >= maxAttempts) {
    return res.status(403).json({ error: `Max ${maxAttempts} attempts reached.` });
  }

  // Mark IP + increment attempt
  await redis("SADD", ipKey, ipHash);
  await redis("EXPIRE", ipKey, "172800");
  await redis("SET", attKey, String(count + 1), "EX", "172800");

  return res.status(200).json({
    approved: true,
    ipHash,
    attemptNumber: count + 1,
    attemptsRemaining: maxAttempts - (count + 1),
  });
}
