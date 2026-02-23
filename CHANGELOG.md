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
- TypeScript receipt verification script (`verifyReceipt.ts`)
- TypeScript approve + verify combo script (`approveAndVerify.ts`)

### Fixed
- **Critical**: TON transaction deduplication issue - added 1-second delay before Scenario 3 to ensure unique `valid_until` timestamps
- **Critical**: Digest computation alignment - ensured off-chain SHA-256 matches on-chain computation exactly
- **Critical**: Contract address consistency - updated all scripts to use the correct deployed contract address

### Verified
- All four security gates working perfectly on TON testnet
- Counter successfully incremented to 3 (proving full verification cycle)
- Smart waiting system with dynamic timeout and progress feedback
- Production-ready status achieved

### Live Contract
- Address: `kQBVqAhPv_ANWm0hfjJdLnQmvvC8_rQ_NEryVX3uFOUF05OP`
- Network: TON Testnet
- Status: ✅ Production Ready (All 4 gates verified)
- Explorer: https://testnet.tonscan.org/address/kQBVqAhPv_ANWm0hfjJdLnQmvvC8_rQ_NEryVX3uFOUF05OP

### Documentation
- Full documentation suite: README, ARCHITECTURE, SETUP_GUIDE, DEPLOYMENT_GUIDE, THREAT_MODEL, TECHNICAL_CHALLENGES, ROADMAP, CHEATSHEET
- MIT License

### Technical Notes
- Uses SHA-256 (TON VM native) instead of Keccak-256 (Ethereum native)
- Receipt format: `hw_id (64-bit) || fw_hash (256-bit) || ex_hash (256-bit) || counter (64-bit)`
- Digest: `sha256(packed cell bits)` — computed exactly as contract expects
- Smart waiting system prevents timeouts with dynamic polling and progress feedback
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
