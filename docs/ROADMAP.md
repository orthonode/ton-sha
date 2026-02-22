# Roadmap: TON-SHA

*Orthonode Infrastructure Labs*

---

## Current State (Phase 0 — Prototype)

TON-SHA is live on TON testnet with all four gates verified on-chain. The contract is deployed, the TypeScript SDK works, and the receipt format is defined. This is a research prototype demonstrating the feasibility of hardware-anchored identity on TON.

**What exists today:**
- Tact smart contract with four-gate verification
- TypeScript SDK for deploy, authorize, approve, and verify
- Live testnet deployment with 4+ on-chain transactions
- Full documentation suite

**What does not exist yet:**
- Production-grade hardware integration
- A mainnet deployment
- A third-party security audit
- An SDK published to npm
- An on-chain registry of verified agents

---

## Phase 1 — Testnet Hardening (3 months)

**Goal:** Make TON-SHA production-ready at the contract and SDK layer.

### 1.1 Contract Security

- [ ] Add ownership transfer with a two-step confirmation (propose + accept)
- [ ] Add device expiry — authorized devices can have an optional TTL
- [ ] Add batch verification — verify multiple receipts in one transaction
- [ ] Add emergency pause — owner can halt verification without revoking devices
- [ ] Fuzz test the receipt parser with randomized inputs

### 1.2 SDK

- [ ] Publish `@orthonode/ton-sha` to npm
- [ ] Add TypeScript types for all messages and events
- [ ] Add receipt validation helper (client-side pre-check before sending)
- [ ] Add event decoder for `VerificationPassed` and `VerificationFailed`
- [ ] Support both testnet and mainnet in one SDK

### 1.3 Developer Experience

- [ ] Add integration tests using `@ton/sandbox`
- [ ] Add gas cost documentation per operation
- [ ] Write integration guide for agent marketplace builders
- [ ] Create 3 reference integration templates

---

## Phase 2 — Hardware Integration (3 months)

**Goal:** Connect the contract to real hardware devices.

### 2.1 ESP32-S3 Firmware

- [ ] Port the SHA Arbitrum ESP32 receipt generator to produce TON-compatible receipts
- [ ] Replace Keccak-256 with SHA-256 throughout the firmware
- [ ] Implement monotonic counter storage in NVS (non-volatile storage)
- [ ] Add OTA firmware update support with automatic hash registration

### 2.2 Receipt Pipeline

- [ ] Define the device-to-chain pipeline: device → local SDK → TON RPC → contract
- [ ] Add receipt queuing for intermittent connectivity
- [ ] Add receipt expiry window — receipts older than N seconds are rejected

### 2.3 Reference Hardware

- [ ] Document the reference hardware configuration (ESP32-S3 board spec)
- [ ] Publish hardware BOM and PCB design files
- [ ] Build 5 reference devices for testing with partner DePIN projects

---

## Phase 3 — Mainnet and Ecosystem (6 months)

**Goal:** Production deployment and ecosystem adoption.

### 3.1 Security

- [ ] Commission a professional third-party security audit
- [ ] Address all findings before mainnet deployment
- [ ] Set up a responsible disclosure program

### 3.2 Mainnet Deployment

- [ ] Deploy to TON mainnet with a multisig owner wallet
- [ ] Transfer ownership to a Gnosis Safe equivalent on TON (after audit)
- [ ] Publish the mainnet contract address officially

### 3.3 Ecosystem

- [ ] Build an on-chain agent registry — map verified `hw_id` to agent addresses
- [ ] Integrate with ton-analyst and other TON agent frameworks
- [ ] Apply for TON Ecosystem grant
- [ ] Publish case study with first DePIN project integration

### 3.4 Cross-Chain

- [ ] Define cross-chain receipt format (SHA-256 ↔ Keccak-256 translation layer)
- [ ] Enable Arbitrum SHA devices to register on TON-SHA via bridge message
- [ ] Publish unified hardware identity standard across both chains

---

## Grant Milestones

### Milestone 1 — Contract and SDK ($TBD)
Deliverables: audited contract, npm SDK, 3 integration templates, gas documentation.

### Milestone 2 — Hardware Integration ($TBD)
Deliverables: ESP32-S3 firmware, receipt pipeline, reference hardware design.

### Milestone 3 — Mainnet ($TBD)
Deliverables: audit report, mainnet deployment, on-chain agent registry.

---

## Out of Scope

- Mainnet deployment before security audit
- Custodial key management for hardware devices
- Building the hardware at scale (manufacturing is a partner problem)
- Governance token or DAO structure (infrastructure, not protocol)
