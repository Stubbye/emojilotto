// lib/rateLimit.ts
// Rate limiting + Redis caching for high traffic (15k+ users)
// Uses Upstash Redis — free tier handles 10k req/day, paid handles millions

import { NextRequest, NextResponse } from "next/server";

const UPSTASH_URL = process.env.UPSTASH_REDIS_URL!;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_TOKEN!;

// Simple Upstash REST API call (no extra package needed)
async function redisCmd(...args: (string | number)[]) {
  const res = await fetch(`${UPSTASH_URL}/${args.join("/")}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  return res.json();
}

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
// Max 10 requests per IP per minute
// Uses Redis sliding window

export async function rateLimit(req: NextRequest): Promise<boolean> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const key = `rl:${ip}:${Math.floor(Date.now() / 60000)}`; // 1-min window

  try {
    const result = await redisCmd("INCR", key);
    // Set expiry on first request
    if (result.result === 1) {
      await redisCmd("EXPIRE", key, "120");
    }
    return result.result <= 10; // allow up to 10 req/min per IP
  } catch {
    return true; // fail open if Redis is down
  }
}

// ─── Cache Helper ─────────────────────────────────────────────────────────────
// Cache round state for 10 seconds — prevents 15k users hammering Solana RPC

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const result = await redisCmd("GET", key);
    if (result.result) return JSON.parse(result.result as string);
    return null;
  } catch {
    return null;
  }
}

export async function setCached(key: string, value: unknown, ttlSeconds = 10) {
  try {
    await redisCmd("SET", key, JSON.stringify(value), "EX", ttlSeconds);
  } catch {
    // fail silently
  }
}

export async function invalidateCache(key: string) {
  try {
    await redisCmd("DEL", key);
  } catch {}
}

// ─── IP Hash for multi-account prevention ────────────────────────────────────
// Hash the IP before storing on-chain (privacy + uniqueness)

export async function getIpHash(req: NextRequest): Promise<Uint8Array> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ||
             req.headers.get("x-real-ip") ||
             "unknown";

  const encoder = new TextEncoder();
  const data = encoder.encode(ip + process.env.IP_SALT || "emlo_salt_2024");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hashBuffer);
}

// ─── Check if IP already entered this round ──────────────────────────────────
export async function hasIpEntered(
  roundId: number,
  ipHash: string
): Promise<boolean> {
  try {
    const result = await redisCmd("SISMEMBER", `round:${roundId}:ips`, ipHash);
    return result.result === 1;
  } catch {
    return false;
  }
}

export async function markIpEntered(roundId: number, ipHash: string) {
  try {
    await redisCmd("SADD", `round:${roundId}:ips`, ipHash);
    await redisCmd("EXPIRE", `round:${roundId}:ips`, "172800"); // 48 hours
  } catch {}
}
