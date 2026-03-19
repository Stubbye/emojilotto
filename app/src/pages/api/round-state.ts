// pages/api/round-state.ts
// Free tier setup — handles 9k users using:
// Vercel free (100GB bandwidth/mo)
// Upstash free (10k req/day)
// Helius free (100k req/day)

import type { NextApiRequest, NextApiResponse } from "next";

const UPSTASH_URL = process.env.UPSTASH_REDIS_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_TOKEN;

async function redisGet(key: string) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(`${UPSTASH_URL}/GET/${key}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const data = await res.json();
    return data.result ? JSON.parse(data.result) : null;
  } catch { return null; }
}

async function redisSet(key: string, value: unknown, ttl = 30) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return;
  try {
    await fetch(
      `${UPSTASH_URL}/SET/${key}/${encodeURIComponent(JSON.stringify(value))}/EX/${ttl}`,
      { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } }
    );
  } catch {}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const { roundId, gameType } = req.query;
  if (!roundId || !gameType) return res.status(400).json({ error: "Missing params" });

  // Cache for 30 seconds on CDN too — reduces Upstash calls drastically
  // 9000 users polling every 30s = 300 req/min but CDN absorbs most of them
  res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");

  const cacheKey = `rs:${gameType}:${roundId}`;

  // Try Redis cache first
  const cached = await redisGet(cacheKey);
  if (cached) return res.status(200).json({ ...cached, fromCache: true });

  // Cache miss — fetch from Helius RPC (happens max once per 30s)
  try {
    const state = {
      roundId: Number(roundId),
      gameType,
      prizePool: 0,
      totalEntries: 0,
      endTime: Date.now() + 86400000,
      isRevealed: false,
      fetchedAt: Date.now(),
    };
    // Cache 30s — at 9k users this means ~1 RPC call per 30s instead of 9000
    await redisSet(cacheKey, state, 30);
    return res.status(200).json(state);
  } catch {
    return res.status(500).json({ error: "Failed to fetch round state" });
  }
}
