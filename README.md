# TON-SHA: Hardware-Anchored Agent Identity for TON

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TON](https://img.shields.io/badge/TON-Testnet-blue.svg)
![Tact](https://img.shields.io/badge/Language-Tact-orange.svg)
![Status](https://img.shields.io/badge/Status-Live-green.svg)

> **Hardware truth as a primitive. Silicon identity on TON. No oracle. No trusted intermediary. Just a chip.**

---

## The Problem

TON agents today are identified by wallet addresses. An address proves nothing about the hardware the agent runs on. Anyone can spin up a virtual machine, clone a key, and impersonate any agent on the network. The chain has no idea.

**The gap is at the silicon level.**

---

## What TON-SHA Does

TON-SHA is a hardware-anchored identity registry for TON agents. Any agent submits a hardware receipt — a cryptographically packed 640-bit structure — and the contract either verifies it through four sequential gates or rejects it with a specific failure code.

No oracle. No trusted intermediary. No off-chain component. The contract state is the source of truth.

This is the identity layer that lets TON agent marketplaces, DAOs, and DeFi protocols trust the agents they interact with at the silicon level.

---

## Connection to SHA on Arbitrum

TON-SHA ports the SHA (Silicon Hardware Anchor) four-gate model — already live on Arbitrum Sepolia with 89+ transactions — to TON. One deliberate difference: TON-SHA uses SHA-256 (native to TON's VM) rather than Keccak-256. This is a TON-native implementation that uses the VM's built-in hash primitive for lower gas cost. The receipt format is compatible across chains.

---

## The Four-Gate Model

Every verification receipt passes through four gates in sequence:

| Gate | Check | Failure Code |
|------|-------|-------------|
| 1 | `authorized_devices[hw_id] == true` | `1` — device not registered |
| 2 | `approved_firmware[fw_hash] == true` | `2` — firmware not approved |
| 3 | `counter > last_counter[hw_id]` | `3` — replay detected |
| 4 | `sha256(hw_id ++ fw_hash ++ ex_hash ++ counter) == digest` | `4` — digest mismatch |

All four gates must pass. Failure at any gate emits `VerificationFailed { hw_id, reason }`. Success emits `VerificationPassed { hw_id, counter }` and advances the counter permanently on-chain.

---

## Live Evidence

| Artifact | Link |
|----------|------|
| Contract | [`kQA2fMBzpJ8yOUtSTj8HAB2q1U37uDRoHNBRFqPbGFaBLvDO`](https://testnet.tonscan.org/address/kQA2fMBzpJ8yOUtSTj8HAB2q1U37uDRoHNBRFqPbGFaBLvDO) |
| Network | TON Testnet |
| Gates Verified | All four — counter on-chain = 1 |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              LAYER 1 — HARDWARE DEVICE                  │
│                                                         │
│  Manufacturer-burned hardware identifiers               │
│  → Hardware ID (hw_id, 64-bit)                          │
│  → Firmware Hash (fw_hash, 256-bit)                     │
│  → Execution Hash (ex_hash, 256-bit)                    │
│  → Monotonic Counter (counter, 64-bit)                  │
└─────────────────────┬───────────────────────────────────┘
                      │ packed receipt + sha256 digest
                      ▼
┌─────────────────────────────────────────────────────────┐
│            LAYER 2 — SDK / CLIENT                       │
│                                                         │
│  Receipt assembly and digest computation                │
│  sha256(hw_id ++ fw_hash ++ ex_hash ++ counter)         │
│  TON-compatible message construction                    │
└─────────────────────┬───────────────────────────────────┘
                      │ VerifyReceipt message
                      ▼
┌─────────────────────────────────────────────────────────┐
│         LAYER 3 — TON-SHA CONTRACT (Tact / TON VM)      │
│                                                         │
│  Gate 1: authorized_devices[hw_id] == true              │
│  Gate 2: approved_firmware[fw_hash] == true             │
│  Gate 3: counter > counters[hw_id]                      │
│  Gate 4: sha256(packed cell) == digest                  │
│                                                         │
│  → VerificationFailed(hw_id, reason) on any failure     │
│  → VerificationPassed(hw_id, counter) on success        │
└─────────────────────────────────────────────────────────┘
```

### Receipt Format (640 bits)

| Field | Size | Description |
|-------|------|-------------|
| `hw_id` | 64 bits | Hardware device identifier |
| `fw_hash` | 256 bits | SHA-256 of firmware binary |
| `ex_hash` | 256 bits | SHA-256 of execution result |
| `counter` | 64 bits | Monotonic counter (Big-Endian) |
| **Digest** | **256 bits** | **sha256(all above, packed)** |

---

## Project Structure

```
contracts/
  ton_sha.tact          # Four-gate verification contract

scripts/
  deployTonSha.ts       # Deploy to testnet
  fullDemo.ts           # End-to-end: authorize → approve → verify
  checkState.ts         # Read on-chain state via getters
  checkOwner.ts         # Verify owner address

build/
  TonSha/
    TonSha_TonSha.ts    # TypeScript bindings (auto-generated)
    TonSha_TonSha.abi   # ABI

docs/
  ARCHITECTURE.md       # Detailed system design
  SETUP_GUIDE.md        # Installation and environment
  DEPLOYMENT_GUIDE.md   # Deploy and interact with the contract
  THREAT_MODEL.md       # Security assumptions and attack surface
  TECHNICAL_CHALLENGES.md # Engineering challenges overcome
  ROADMAP.md            # Phase 1 and Phase 2 plans
  CAST_CHEATSHEET.md    # Quick reference for interactions
```

---

## Quick Start

### Prerequisites
- Node.js 22+
- TON testnet wallet (Tonkeeper recommended, set to testnet mode)
- Testnet TON from [@testgiver_ton_bot](https://t.me/testgiver_ton_bot)

### Install

```bash
git clone https://github.com/orthonode/ton-sha
cd ton-sha
npm install
```

### Check the live contract state

```bash
npx blueprint run checkState --testnet
# Device authorized: true
# Firmware approved: true
# Counter on-chain: 1
```

### Deploy your own instance

```bash
npx blueprint run deployTonSha --testnet
```

### Run the full four-gate demo

```bash
npx blueprint run fullDemo --testnet
```

See [`docs/SETUP_GUIDE.md`](docs/SETUP_GUIDE.md) for full environment setup.
See [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md) for deployment details.

---

## Building on TON-SHA

TON-SHA is designed as infrastructure. The verification call is permissionless — any contract or agent can query it. Only the owner controls device and firmware authorization.

**Integration patterns:**

- **Agent marketplaces** — gate listing on hardware verification status
- **DAOs** — require hardware attestation for proposal rights
- **DeFi protocols** — hardware-verified agents for privileged operations
- **Cross-chain bridges** — hardware attestation as additional signer requirement

```typescript
// Check if an agent is hardware-verified
const isAuth = await tonSha.getIsAuthorized(hw_id);
const isFw = await tonSha.getIsApprovedFirmware(fw_hash);
const counter = await tonSha.getGetCounter(hw_id);
```

---

## Grant Status

- TON Ecosystem grant: under preparation
- No funding received to date. Pre-revenue infrastructure project.

---

## License

MIT — See [LICENSE](LICENSE)

---

*Built by [Orthonode Infrastructure Labs](https://github.com/orthonode) — hardware-rooted verification for TON.*
