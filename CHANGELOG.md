# Changelog: TON-SHA

All notable changes to this project will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.1.0] — 2026-02-23

### Added
- Initial Tact smart contract with four-gate verification model
- `AuthorizeDevice`, `ApproveFirmware`, `RevokeDevice`, `VerifyReceipt` message handlers
- `isAuthorized`, `isApprovedFirmware`, `getCounter`, `getOwner` getter functions
- `VerificationPassed` and `VerificationFailed` event emission
- TypeScript deploy script (`deployTonSha.ts`)
- TypeScript full demo script (`fullDemo.ts`)
- TypeScript state checker (`checkState.ts`)
- TypeScript owner checker (`checkOwner.ts`)
- TypeScript single-command agent demo (`agentDemo.ts`) — four scenarios: rogue agent, device registration, full four-gate pass, replay attack
- Live testnet deployment at `kQA2fMBzpJ8yOUtSTj8HAB2q1U37uDRoHNBRFqPbGFaBLvDO`
- All four gates verified on-chain (counter = 2)
- Full documentation suite: README, ARCHITECTURE, SETUP_GUIDE, DEPLOYMENT_GUIDE, THREAT_MODEL, TECHNICAL_CHALLENGES, ROADMAP, CHEATSHEET
- MIT License

### Technical Notes
- Uses SHA-256 (TON VM native) instead of Keccak-256 (Ethereum native)
- Receipt format: `hw_id (64-bit) || fw_hash (256-bit) || ex_hash (256-bit) || counter (64-bit)`
- Digest: `sha256(packed cell bits)` — must use `cell.bits.subbuffer()` not `cell.hash()` or `cell.toBoc()`
- `cell.bits.subbuffer()` can return null for certain bit alignments — safe pattern uses `slice.loadUint` as fallback (see `agentDemo.ts`)
- Requires Node.js 22+ (Tact compiler constraint)
- Requires `init()` pattern, not contract parameter syntax (Tact 1.6 limitation)

---

## Upcoming

### [0.2.0] — Planned
- Integration tests using `@ton/sandbox`
- Ownership transfer (two-step)
- Device expiry TTL
- Batch verification
- npm SDK publication
