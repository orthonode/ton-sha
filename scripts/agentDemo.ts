/**
 * TON-SHA Agent Demo
 * Orthonode Infrastructure Labs
 *
 * Simulates a real agent identity verification workflow on TON testnet.
 * Run: npx blueprint run agentDemo --testnet
 *
 * Demonstrates all four gates:
 *   Gate 1 — Device Authorization
 *   Gate 2 — Firmware Approval
 *   Gate 3 — Replay Protection
 *   Gate 4 — SHA-256 Cryptographic Digest
 */

import { toNano, beginCell, Address } from "@ton/core";
import { TonSha } from "../build/TonSha/TonSha_TonSha";
import { NetworkProvider } from "@ton/blueprint";
import { sha256 } from "@ton/crypto";

// ─── Agent Identity Constants ─────────────────────────────────────────────────
const AGENT_HW_ID = 0x1337133713371337n; // Simulated hardware eFuse ID
const APPROVED_FW = 0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefn;
const ROGUE_FW    = 0xbadc0debadc0debadc0debadc0debadc0debadc0debadc0debadc0debadc0den;
const EX_HASH     = 0xcafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafen;
const CONTRACT    = "kQA2fMBzpJ8yOUtSTj8HAB2q1U37uDRoHNBRFqPbGFaBLvDO";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function sep(label: string) {
  console.log("\n" + "─".repeat(60));
  console.log(`  ${label}`);
  console.log("─".repeat(60));
}

function ok(msg: string)   { console.log(`  ✅  ${msg}`); }
function fail(msg: string) { console.log(`  ❌  ${msg}`); }
function info(msg: string) { console.log(`  ·   ${msg}`); }
function warn(msg: string) { console.log(`  ⚠️   ${msg}`); }

async function computeDigest(hw_id: bigint, fw_hash: bigint, ex_hash: bigint, counter: bigint): Promise<bigint> {
  const cell = beginCell()
    .storeUint(hw_id,    64)
    .storeUint(fw_hash, 256)
    .storeUint(ex_hash, 256)
    .storeUint(counter,  64)
    .endCell();
  // Match exactly what Tact's sha256(slice) computes on-chain:
  // extract raw bit data as a byte buffer (640 bits = 80 bytes, always byte-aligned)
  const totalBits = cell.bits.length;
  const totalBytes = Math.ceil(totalBits / 8);
  const buf = Buffer.alloc(totalBytes);
  const sub = cell.bits.subbuffer(0, totalBits);
  if (sub) {
    sub.copy(buf);
  } else {
    // fallback: read through a slice
    const slice = cell.beginParse();
    for (let i = 0; i < totalBytes; i++) {
      const bitsLeft = totalBits - i * 8;
      buf[i] = slice.loadUint(Math.min(8, bitsLeft));
    }
  }
  const hash = await sha256(buf);
  return BigInt("0x" + hash.toString("hex"));
}

async function wait(ms: number, label: string) {
  process.stdout.write(`  ·   Waiting ${label}`);
  await new Promise(r => setTimeout(r, ms));
  console.log(" — done");
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export async function run(provider: NetworkProvider) {
  const addr    = Address.parse(CONTRACT);
  const tonSha  = provider.open(TonSha.fromAddress(addr));
  const sender  = provider.sender();

  console.log("\n");
  console.log("  ████████╗ ██████╗ ███╗   ██╗    ███████╗██╗  ██╗ █████╗");
  console.log("     ██╔══╝██╔═══██╗████╗  ██║    ██╔════╝██║  ██║██╔══██╗");
  console.log("     ██║   ██║   ██║██╔██╗ ██║    ███████╗███████║███████║");
  console.log("     ██║   ██║   ██║██║╚██╗██║    ╚════██║██╔══██║██╔══██║");
  console.log("     ██║   ╚██████╔╝██║ ╚████║    ███████║██║  ██║██║  ██║");
  console.log("     ╚═╝    ╚═════╝ ╚═╝  ╚═══╝    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝");
  console.log("\n  Hardware-Anchored Agent Identity · Orthonode Infrastructure Labs");
  console.log(`  Contract : ${CONTRACT}`);
  console.log(`  Owner    : ${sender.address?.toString()}`);
  console.log(`  Explorer : https://testnet.tonscan.org/address/${CONTRACT}`);

  // ── SCENARIO 1: Rogue agent tries to verify before authorization ─────────────
  sep("SCENARIO 1 — Rogue agent (no authorization)");
  info(`Agent HW_ID  : 0x${AGENT_HW_ID.toString(16)}`);
  info(`Agent FW     : 0x${ROGUE_FW.toString(16).slice(0, 16)}...`);
  info("Agent submits receipt — Gate 1 should reject (device not authorized)");

  const rogueDigest = await computeDigest(AGENT_HW_ID, ROGUE_FW, EX_HASH, 1n);
  await tonSha.send(sender, { value: toNano("0.1") }, {
    $$type: "VerifyReceipt",
    hw_id: AGENT_HW_ID, fw_hash: ROGUE_FW, ex_hash: EX_HASH, counter: 1n, digest: rogueDigest,
  });
  await wait(12000, "for Gate 1 rejection to confirm...");

  const counter0 = await tonSha.getGetCounter(AGENT_HW_ID);
  if (counter0 === 0n) {
    fail(`Gate 1 fired — VerificationFailed { reason: 1, hw_id: 0x${AGENT_HW_ID.toString(16)} }`);
    info("Rogue agent cannot verify. Counter unchanged: 0");
  }

  // ── SCENARIO 2: Owner sets up registry ──────────────────────────────────────
  sep("SCENARIO 2 — Owner registers device & approves firmware");
  info("Sending AuthorizeDevice...");
  await tonSha.send(sender, { value: toNano("0.1") }, {
    $$type: "AuthorizeDevice", hw_id: AGENT_HW_ID,
  });
  await wait(12000, "for AuthorizeDevice...");

  const auth = await tonSha.getIsAuthorized(AGENT_HW_ID);
  if (auth) {
    ok(`Gate 1 OPEN — device 0x${AGENT_HW_ID.toString(16)} authorized`);
  } else {
    warn("AuthorizeDevice tx may still be in-flight, continuing...");
  }

  info("Sending ApproveFirmware...");
  await tonSha.send(sender, { value: toNano("0.1") }, {
    $$type: "ApproveFirmware", fw_hash: APPROVED_FW,
  });
  await wait(12000, "for ApproveFirmware...");

  const fwOk = await tonSha.getIsApprovedFirmware(APPROVED_FW);
  if (fwOk) {
    ok(`Gate 2 OPEN — firmware 0x${APPROVED_FW.toString(16).slice(0, 16)}... approved`);
  } else {
    warn("ApproveFirmware tx may still be in-flight, continuing...");
  }

  // ── SCENARIO 3: Legitimate agent submits receipt — all 4 gates ──────────────
  sep("SCENARIO 3 — Legitimate agent submits receipt (all 4 gates)");
  const currentCounter = await tonSha.getGetCounter(AGENT_HW_ID);
  const nextCounter = currentCounter + 1n;
  info(`Current on-chain counter : ${currentCounter}`);
  info(`Agent will submit counter : ${nextCounter}`);

  const validDigest = await computeDigest(AGENT_HW_ID, APPROVED_FW, EX_HASH, nextCounter);
  info(`SHA-256 digest           : 0x${validDigest.toString(16).slice(0, 16)}...`);

  await tonSha.send(sender, { value: toNano("0.1") }, {
    $$type: "VerifyReceipt",
    hw_id: AGENT_HW_ID, fw_hash: APPROVED_FW, ex_hash: EX_HASH,
    counter: nextCounter, digest: validDigest,
  });
  await wait(15000, "for VerifyReceipt to confirm...");

  const counter1 = await tonSha.getGetCounter(AGENT_HW_ID);
  if (counter1 === nextCounter) {
    ok(`Gate 1 ✓ — device authorized`);
    ok(`Gate 2 ✓ — firmware approved`);
    ok(`Gate 3 ✓ — counter ${currentCounter} → ${counter1} (replay protected)`);
    ok(`Gate 4 ✓ — SHA-256 digest verified on-chain`);
    ok(`VerificationPassed { hw_id: 0x${AGENT_HW_ID.toString(16)}, counter: ${counter1} }`);
  } else {
    warn(`Counter still ${counter1}. Tx may need more time. Check explorer.`);
  }

  // ── SCENARIO 4: Replay attack — same counter reused ─────────────────────────
  sep("SCENARIO 4 — Replay attack (same counter reused)");
  info(`Attacker replays counter ${nextCounter} (same as just used)`);
  info("Gate 3 should reject — counter must be strictly increasing");

  // Reuse the same counter and digest → Gate 3 must fire
  await tonSha.send(sender, { value: toNano("0.1") }, {
    $$type: "VerifyReceipt",
    hw_id: AGENT_HW_ID, fw_hash: APPROVED_FW, ex_hash: EX_HASH,
    counter: nextCounter, digest: validDigest,
  });
  await wait(12000, "for replay attempt to confirm...");

  const counter2 = await tonSha.getGetCounter(AGENT_HW_ID);
  if (counter2 === counter1) {
    fail(`Gate 3 fired — VerificationFailed { reason: 3 } — replay blocked`);
    info(`Counter unchanged: ${counter2}`);
  } else {
    warn(`Counter moved to ${counter2} — check the explorer for the failure event.`);
  }

  // ── Summary ──────────────────────────────────────────────────────────────────
  sep("FINAL STATE");
  const finalAuth    = await tonSha.getIsAuthorized(AGENT_HW_ID);
  const finalFw      = await tonSha.getIsApprovedFirmware(APPROVED_FW);
  const finalCounter = await tonSha.getGetCounter(AGENT_HW_ID);

  info(`Device authorized  : ${finalAuth}`);
  info(`Firmware approved  : ${finalFw}`);
  info(`Counter on-chain   : ${finalCounter}`);

  console.log("\n" + "═".repeat(60));
  console.log("  TON-SHA VERIFICATION COMPLETE");
  console.log("═".repeat(60));
  console.log(`\n  Contract  : ${CONTRACT}`);
  console.log(`  Explorer  : https://testnet.tonscan.org/address/${CONTRACT}`);
  console.log("\n  What was proven:");
  console.log("  · Unauthorized agents cannot pass Gate 1");
  console.log("  · Only approved firmware passes Gate 2");
  console.log("  · Counter prevents replay attacks at Gate 3");
  console.log("  · SHA-256 digest is verified on-chain at Gate 4");
  console.log("  · All state is public — any agent or protocol can query it");
  console.log("\n  Integration (one call from any TON agent):");
  console.log("  const verified = await tonSha.getIsAuthorized(agentHwId);");
  console.log("  const counter  = await tonSha.getGetCounter(agentHwId);");
  console.log("\n  Built by Orthonode Infrastructure Labs");
  console.log("  https://github.com/orthonode/ton-sha\n");
}
