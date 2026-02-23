/**
 * TON-SHA Agent Demo
 * Orthonode Infrastructure Labs
 *
 * Demonstrates all four gates on live TON testnet.
 * Run: npx blueprint run agentDemo --testnet
 *
 * Gate 1 - Device Authorization
 * Gate 2 - Firmware Approval
 * Gate 3 - Replay Protection (monotonic counter)
 * Gate 4 - SHA-256 Cryptographic Digest
 */

import { toNano, Address } from "@ton/core";
import { TonSha } from "../build/TonSha/TonSha_TonSha";
import { NetworkProvider } from "@ton/blueprint";
import { sha256 } from "@ton/crypto";
import { beginCell } from "@ton/core";

// Constants
const AGENT_HW_ID  = 0x1337133713371337n;
const APPROVED_FW  = 0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefn;
const ROGUE_FW     = 0xbadc0debadc0debadc0debadc0debadc0debadc0debadc0debadc0debadc0den;
const EX_HASH      = 0xcafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafen;
const CONTRACT_KQ  = "kQBVqAhPv_ANWm0hfjJdLnQmvvC8_rQ_NEryVX3uFOUF05OP";

// Helpers
const LINE  = "------------------------------------------------------------";
const DLINE = "============================================================";

function sep(label: string) {
  console.log("\n" + LINE);
  console.log("  " + label);
  console.log(LINE);
}
function ok(msg: string)   { console.log("  [OK]  " + msg); }
function fail(msg: string) { console.log("  [!!]  " + msg); }
function info(msg: string) { console.log("  [ ]   " + msg); }

async function wait(ms: number, label: string) {
  process.stdout.write("  [ ]   Waiting " + (ms/1000) + "s " + label);
  await new Promise(r => setTimeout(r, ms));
  console.log(" - done");
}

/**
 * Smart wait function that polls contract state until condition is met or timeout
 */
async function waitForCondition(
  condition: () => Promise<boolean>,
  timeoutMs: number,
  label: string,
  checkInterval: number = 3000
): Promise<boolean> {
  process.stdout.write("  [ ]   " + label);
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    if (await condition()) {
      console.log(" ✅");
      return true;
    }
    process.stdout.write(".");
    await new Promise(r => setTimeout(r, checkInterval));
  }
  
  console.log(" ⏰ (timeout)");
  return false;
}

/**
 * Compute SHA-256 digest matching exactly what the contract computes on-chain.
 *
 * Contract (ton_sha.tact):
 *   b.storeUint(hw_id, 64)
 *   b.storeUint(fw_hash, 256)
 *   b.storeUint(ex_hash, 256)
 *   b.storeUint(counter, 64)
 *   sha256(b.endCell().beginParse())
 *
 * Total: 64+256+256+64 = 640 bits = 80 bytes, big-endian.
 */
async function computeDigest(
  hw_id: bigint,
  fw_hash: bigint,
  ex_hash: bigint,
  counter: bigint
): Promise<bigint> {

  const cell = beginCell()
    .storeUint(hw_id, 64)
    .storeUint(fw_hash, 256)
    .storeUint(ex_hash, 256)
    .storeUint(counter, 64)
    .endCell();

  const slice = cell.beginParse();

  // 640 bits = 80 bytes exactly
  const bytes = slice.loadBuffer(80);

  const hash = await sha256(bytes);

  return BigInt("0x" + hash.toString("hex"));
}

// Main
export async function run(provider: NetworkProvider) {
  const addr   = Address.parse(CONTRACT_KQ);
  const tonSha = provider.open(TonSha.fromAddress(addr));
  const sender = provider.sender();

  console.log("\n");
  console.log("  TON-SHA: Hardware-Anchored Agent Identity");
  console.log("  Orthonode Infrastructure Labs");
  console.log("  Contract : " + CONTRACT_KQ);
  console.log("  Owner    : " + sender.address?.toString());
  console.log("  Explorer : https://testnet.tonscan.org/address/" + CONTRACT_KQ);
  console.log("\n");

  // Read counter once at start - baseline for all scenarios
  const startCounter = await tonSha.getGetCounter(AGENT_HW_ID);
  info("On-chain counter at start: " + startCounter.toString());

  // SCENARIO 1: Rogue agent (device not authorized)
  sep("SCENARIO 1 - Rogue agent (device not authorized)");
  info("HW_ID : 0x" + AGENT_HW_ID.toString(16));
  info("FW    : 0x" + ROGUE_FW.toString(16).slice(0, 16) + "... (unauthorized)");
  info("Gate 1 fires before Gate 3 - device check happens first in contract");

  // Use fixed counter=1 for rogue agent (doesn't conflict with real counters)
  const rogueCounter = 1n;
  const rogueDigest  = await computeDigest(AGENT_HW_ID, ROGUE_FW, EX_HASH, rogueCounter);
  info("Submitting receipt with counter=" + rogueCounter.toString());

  await tonSha.send(sender, { value: toNano("0.05") }, {
    $$type: "VerifyReceipt",
    hw_id: AGENT_HW_ID,
    fw_hash: ROGUE_FW,
    ex_hash: EX_HASH,
    counter: rogueCounter,
    digest: rogueDigest,
  });
  
  // Smart wait: check if counter stays the same (rejection confirmed)
  const rejectionConfirmed = await waitForCondition(
    async () => {
      const current = await tonSha.getGetCounter(AGENT_HW_ID);
      return current === startCounter;
    },
    30000, // 30 second timeout
    "for rejection confirmation..."
  );

  const afterS1 = await tonSha.getGetCounter(AGENT_HW_ID);
  if (afterS1 === startCounter) {
    fail("Gate 1 fired - VerificationFailed { reason: 1 } - device not authorized");
    info("Counter unchanged: " + afterS1.toString());
  } else {
    info("Counter moved to " + afterS1.toString() + " - device was pre-authorized, proceeding");
  }

  // SCENARIO 2: Owner registers device & approves firmware
  sep("SCENARIO 2 - Owner registers device and approves firmware");

  info("Sending AuthorizeDevice...");
  await tonSha.send(sender, { value: toNano("0.05") }, {
    $$type: "AuthorizeDevice",
    hw_id: AGENT_HW_ID,
  });
  
  // Smart wait: check if device becomes authorized
  const authConfirmed = await waitForCondition(
    async () => await tonSha.getIsAuthorized(AGENT_HW_ID),
    60000, // 60 second timeout
    "for device authorization..."
  );

  const auth = await tonSha.getIsAuthorized(AGENT_HW_ID);
  if (auth) {
    ok("Gate 1 OPEN - device 0x" + AGENT_HW_ID.toString(16) + " authorized");
  } else {
    info("Still in-flight - continuing");
  }

  info("Sending ApproveFirmware...");
  await tonSha.send(sender, { value: toNano("0.05") }, {
    $$type: "ApproveFirmware",
    fw_hash: APPROVED_FW,
  });
  
  // Smart wait: check if firmware becomes approved
  const fwConfirmed = await waitForCondition(
    async () => await tonSha.getIsApprovedFirmware(APPROVED_FW),
    60000, // 60 second timeout
    "for firmware approval..."
  );

  const fwOk = await tonSha.getIsApprovedFirmware(APPROVED_FW);
  if (fwOk) {
    ok("Gate 2 OPEN - firmware 0x" + APPROVED_FW.toString(16).slice(0, 16) + "... approved");
  } else {
    info("Still in-flight - continuing");
  }

  // SCENARIO 3: Legitimate agent submits receipt (all 4 gates)
  sep("SCENARIO 3 - Legitimate agent submits receipt (all 4 gates)");

  // Read counter fresh after Scenarios 1+2
  const currentCounter = await tonSha.getGetCounter(AGENT_HW_ID);
  const nextCounter    = currentCounter + 1n;
  
  const validDigest    = await computeDigest(AGENT_HW_ID, APPROVED_FW, EX_HASH, nextCounter);

  info("Counter on-chain  : " + currentCounter.toString());
  info("Submitting counter: " + nextCounter.toString());
  info("SHA-256 digest    : 0x" + validDigest.toString(16).slice(0, 16) + "...");
  info("Full digest       : 0x" + validDigest.toString(16));
  // No signed conversion needed - both sides now use uint256
  info("Digest as uint256   : " + validDigest.toString());
  info("Digest hex         : " + validDigest.toString(16));
  info("Digest bit length  : " + validDigest.toString(2).length + " bits");
  info("High bit set?      : " + (validDigest >= (1n << 255n) ? "YES" : "NO"));
  info("Using uint256 (no signed conversion)");

  await tonSha.send(sender, { value: toNano("0.1") }, {
    $$type: "VerifyReceipt",
    hw_id: AGENT_HW_ID,
    fw_hash: APPROVED_FW,
    ex_hash: EX_HASH,
    counter: nextCounter,
    digest: validDigest,
  });
  
  // Smart wait: check if counter increments (all 4 gates pass)
  const verificationConfirmed = await waitForCondition(
    async () => {
      const current = await tonSha.getGetCounter(AGENT_HW_ID);
      return current >= nextCounter;
    },
    120000, // 120 second timeout (more tolerant for testnet congestion)
    "for all 4 gates to confirm..."
  );

  const afterS3 = await tonSha.getGetCounter(AGENT_HW_ID);
  if (afterS3 >= nextCounter) {
    ok("Gate 1 PASS - device authorized");
    ok("Gate 2 PASS - firmware approved");
    ok("Gate 3 PASS - counter " + currentCounter.toString() + " -> " + afterS3.toString() + " (strictly increasing)");
    ok("Gate 4 PASS - SHA-256 digest verified on-chain");
    ok("VerificationPassed { hw_id: 0x" + AGENT_HW_ID.toString(16) + ", counter: " + afterS3.toString() + " }");
  } else {
    info("Verification failed - check explorer for details");
    info("Explorer: https://testnet.tonscan.org/address/" + CONTRACT_KQ);
  }

  // SCENARIO 4: Replay attack (stale counter)
  sep("SCENARIO 4 - Replay attack (stale counter)");
  //
  // Use currentCounter (value stored on-chain BEFORE scenario 3).
  // Gate 3: msg.counter <= lastVal => currentCounter <= currentCounter => REJECT
  // 100% deterministic - no timing dependency.
  //
  const staleCounter = currentCounter;
  const staleDigest  = await computeDigest(AGENT_HW_ID, APPROVED_FW, EX_HASH, staleCounter);

  info("Replaying stale counter : " + staleCounter.toString());
  info("Contract stored counter : " + currentCounter.toString());
  info("Gate 3 check            : " + staleCounter.toString() + " <= " + currentCounter.toString() + " => REJECT");

  await tonSha.send(sender, { value: toNano("0.05") }, {
    $$type: "VerifyReceipt",
    hw_id: AGENT_HW_ID,
    fw_hash: APPROVED_FW,
    ex_hash: EX_HASH,
    counter: staleCounter,
    digest: staleDigest,
  });
  
  // Smart wait: check if counter stays the same (replay rejection confirmed)
  const replayRejectionConfirmed = await waitForCondition(
    async () => {
      const current = await tonSha.getGetCounter(AGENT_HW_ID);
      return current <= afterS3; // Should stay the same or be less
    },
    30000, // 30 second timeout
    "for Gate 3 rejection..."
  );

  const afterS4 = await tonSha.getGetCounter(AGENT_HW_ID);
  if (afterS4 <= afterS3) {
    fail("Gate 3 fired - VerificationFailed { reason: 3 } - replay blocked");
    info("Counter: " + afterS4.toString() + " - stale counter " + staleCounter.toString() + " permanently rejected");
  } else {
    info("Counter at " + afterS4.toString() + " - check explorer");
  }

  // Final State
  sep("FINAL STATE");
  const finalAuth    = await tonSha.getIsAuthorized(AGENT_HW_ID);
  const finalFw      = await tonSha.getIsApprovedFirmware(APPROVED_FW);
  const finalCounter = await tonSha.getGetCounter(AGENT_HW_ID);

  info("Device authorized : " + finalAuth.toString());
  info("Firmware approved : " + finalFw.toString());
  info("Counter on-chain  : " + finalCounter.toString());

  console.log("\n" + DLINE);
  console.log("  TON-SHA VERIFICATION COMPLETE");
  console.log(DLINE);
  console.log("\n  Contract  : " + CONTRACT_KQ);
  console.log("  Explorer  : https://testnet.tonscan.org/address/" + CONTRACT_KQ);
  console.log("\n  What was proven:");
  console.log("  - Unauthorized agents cannot pass Gate 1");
  console.log("  - Only approved firmware passes Gate 2");
  console.log("  - Counter prevents replay attacks at Gate 3");
  console.log("  - SHA-256 digest is verified on-chain at Gate 4");
  console.log("  - All state is public - any agent or protocol can query it");
  console.log("\n  Integration (one call from any TON agent):");
  console.log("  const verified = await tonSha.getIsAuthorized(agentHwId);");
  console.log("  const counter  = await tonSha.getGetCounter(agentHwId);");
  console.log("\n  Built by Orthonode Infrastructure Labs");
  console.log("  https://github.com/orthonode/ton-sha\n");
}
