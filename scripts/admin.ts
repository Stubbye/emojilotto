#!/usr/bin/env ts-node
/**
 * EmojiLotto Admin Scripts
 * Run with: npx ts-node scripts/admin.ts <command>
 *
 * Commands:
 *   create-round   — Initialize a new round on-chain
 *   reveal-answer  — Reveal the answer after round ends
 *   score-all      — Score all entries (fetch all entry PDAs and call scoreEntry)
 *   withdraw-fees  — Withdraw platform fees to authority wallet
 */

import * as anchor from "@coral-xyz/anchor";
import { Program, BN, web3 } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as crypto from "crypto";
import * as fs from "fs";
git add scripts\admin.ts
git commit -m "Fix build error"
git push

const EMOJIS = [
  "🎯","🚀","💎","🌙","⚡","🔥","🎪","🦋",
  "🌈","💫","🎲","🃏","🦊","🐉","🌺","💜",
  "🎸","🏆","🎭","🍀","🔮","⭐","🎨","🌊",
];

const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID || "ELot1oXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
const NETWORK = process.env.NETWORK || "devnet";
const WALLET_PATH = process.env.WALLET || `${process.env.HOME}/.config/solana/id.json`;

function loadWallet(): Keypair {
  const raw = JSON.parse(fs.readFileSync(WALLET_PATH, "utf-8"));
  return Keypair.fromSecretKey(Uint8Array.from(raw));
}

function getRoundPDA(roundId: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("round"), new BN(roundId).toArrayLike(Buffer, "le", 8)],
    PROGRAM_ID
  );
}

function getVaultPDA(roundId: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), new BN(roundId).toArrayLike(Buffer, "le", 8)],
    PROGRAM_ID
  );
}

/**
 * Create a new round.
 * Generates a random 6-emoji answer, hashes it, stores hash on-chain.
 * Saves the plaintext answer + salt to a local file (keep this SECRET).
 */
async function createRound(program: Program<any>, roundId: number) {
  // Pick random answer
  const indices = Array.from({ length: 24 }, (_, i) => i);
  const shuffled = indices.sort(() => Math.random() - 0.5);
  const answer = shuffled.slice(0, 6) as [number, number, number, number, number, number];
  const salt = crypto.randomBytes(32);

  // Compute hash
  const preimage = Buffer.alloc(38);
  answer.forEach((v, i) => preimage.writeUInt8(v, i));
  salt.copy(preimage, 6);
  const answerHash = Array.from(crypto.createHash("sha256").update(preimage).digest());

  // Save secret
  const secretPath = `./round-${roundId}-secret.json`;
  fs.writeFileSync(
    secretPath,
    JSON.stringify({
      roundId,
      answer,
      answerEmojis: answer.map((i) => EMOJIS[i]),
      salt: Array.from(salt),
      answerHash,
    }, null, 2)
  );
  console.log(`🔒 Secret saved to ${secretPath} — KEEP THIS SAFE!`);
  console.log(`🎯 Answer: ${answer.map((i) => EMOJIS[i]).join(" ")}`);

  const [roundPDA] = getRoundPDA(roundId);
  const [vaultPDA] = getVaultPDA(roundId);

  const ENTRY_FEE = 0.001 * LAMPORTS_PER_SOL;

  // Smart duration logic:
  // USDC game  → always 24 hours
  // EMLO game  → 1 hour for first week after launch, then 4 hours
  const launchFile = './launch-timestamp.json';
  let launchTime = Date.now();
  if (fs.existsSync(launchFile)) {
    launchTime = JSON.parse(fs.readFileSync(launchFile, 'utf-8')).launchTime;
  } else {
    fs.writeFileSync(launchFile, JSON.stringify({ launchTime }, null, 2));
    console.log('🚀 First launch! Timestamp saved.');
  }
  const isFirstWeek = (Date.now() - launchTime) < 7 * 24 * 60 * 60 * 1000;
  const gameType = process.env.GAME_TYPE || 'usdc'; // set via env: GAME_TYPE=emlo
  const DURATION =
    gameType === 'usdc' ? 86400 :          // USDC: 24 hours always
    isFirstWeek        ? 3600  :           // EMLO week 1: 1 hour
                         14400;            // EMLO after week 1: 4 hours
  const durationLabel =
    gameType === 'usdc' ? '24h (USDC game)' :
    isFirstWeek         ? '1h (EMLO — week 1)' :
                          '4h (EMLO — normal)';
  console.log(`⏱  Duration: ${durationLabel}`);

  const tx = await program.methods
    .initializeRound(
      new BN(roundId),
      answerHash,
      new BN(DURATION),
      new BN(ENTRY_FEE)
    )
    .accounts({ round: roundPDA, vault: vaultPDA, authority: program.provider.publicKey, systemProgram: web3.SystemProgram.programId })
    .rpc();

  console.log(`✅ Round ${roundId} created!`);
  console.log(`   TX: https://explorer.solana.com/tx/${tx}?cluster=${NETWORK}`);
  console.log(`   Round PDA: ${roundPDA.toBase58()}`);
  console.log(`   Vault PDA: ${vaultPDA.toBase58()}`);
  console.log(`   Entry fee: ${ENTRY_FEE / LAMPORTS_PER_SOL} SOL`);
  console.log(`   Duration: ${DURATION / 3600}h`);
}

/**
 * Reveal the answer after round ends.
 */
async function revealAnswer(program: Program<any>, roundId: number) {
  const secretPath = `./round-${roundId}-secret.json`;
  if (!fs.existsSync(secretPath)) {
    throw new Error(`Secret file not found: ${secretPath}`);
  }
  const secret = JSON.parse(fs.readFileSync(secretPath, "utf-8"));
  const [roundPDA] = getRoundPDA(roundId);

  const tx = await program.methods
    .revealAnswer(secret.answer, secret.salt)
    .accounts({ round: roundPDA, authority: program.provider.publicKey })
    .rpc();

  console.log(`✅ Answer revealed for round ${roundId}!`);
  console.log(`   Answer: ${secret.answerEmojis.join(" ")}`);
  console.log(`   TX: https://explorer.solana.com/tx/${tx}?cluster=${NETWORK}`);
}

async function main() {
  const command = process.argv[2];
  const roundId = parseInt(process.argv[3] || "1");

  const keypair = loadWallet();
  const connection = new Connection(
    process.env.RPC_ENDPOINT || clusterApiUrl(NETWORK as any),
    "confirmed"
  );

  const wallet = new anchor.Wallet(keypair);
  const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });
  const program = new Program(IDL as any, PROGRAM_ID, provider);

  console.log(`🔑 Authority: ${keypair.publicKey.toBase58()}`);
  const balance = await connection.getBalance(keypair.publicKey);
  console.log(`💰 Balance: ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL`);

  switch (command) {
    case "create-round":
      await createRound(program, roundId);
      break;
    case "reveal-answer":
      await revealAnswer(program, roundId);
      break;
    default:
      console.log("Commands: create-round <id> | reveal-answer <id>");
  }
}

main().catch(console.error);
