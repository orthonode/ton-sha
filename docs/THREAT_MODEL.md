# Threat Model: TON-SHA

*Orthonode Infrastructure Labs*

---

## Scope

This document covers the threat model for the TON-SHA smart contract system: the Tact contract, the TypeScript client SDK, and the receipt format. It does not cover threats to the underlying TON blockchain itself or to hardware manufacturing supply chains.

---

## Assets

| Asset | Description |
|-------|-------------|
| Contract state | `authorized_devices`, `approved_firmware`, `counters` maps |
| Owner private key | Controls device authorization and firmware approval |
| Hardware receipts | The signed 640-bit structures submitted for verification |
| Counter state | Per-device monotonic counter preventing replay |

---

## Threat Actors

| Actor | Capability |
|-------|------------|
| External attacker | Can send any message to the contract |
| Compromised agent | Has access to a valid but potentially stolen receipt |
| Malicious owner | Could authorize rogue devices or approve malicious firmware |
| TON validator | Can reorder or censor transactions (standard blockchain assumption) |

---

## Attack Surface and Mitigations

### 1. Receipt Replay

**Threat:** Attacker captures a valid receipt from a prior session and resubmits it.

**Mitigation:** Gate 3 enforces strict monotonic counter increase. The contract stores the last accepted counter per `hw_id`. Any receipt with `counter ≤ stored_counter` is rejected with failure code 3. The counter is updated atomically on-chain only after all four gates pass.

**Residual risk:** If the attacker can submit a receipt before the legitimate device, they advance the counter and lock the device out until it generates a receipt with a higher counter. This is a denial-of-service risk, not an impersonation risk.

### 2. Receipt Forgery

**Threat:** Attacker constructs a receipt for a device they do not control, passing Gate 4.

**Mitigation:** Gate 4 requires the digest to equal `sha256(hw_id || fw_hash || ex_hash || counter)`. Without knowledge of the pre-image fields that produce the correct digest for an authorized `hw_id`, an attacker cannot forge a valid receipt. SHA-256 preimage resistance is the cryptographic assumption here.

**Residual risk:** If the hardware secret (the actual hardware identifier data used to derive `hw_id`) is compromised, the attacker can generate valid receipts. This is a hardware security problem, not a contract problem.

### 3. Unauthorized Device Registration

**Threat:** Attacker registers their own device as authorized.

**Mitigation:** `AuthorizeDevice` is owner-only. The contract checks `sender() == self.owner` and requires the transaction fail if this check fails. Only the address that deployed the contract (or a transferred owner) can authorize devices.

**Residual risk:** If the owner's private key is compromised, the attacker can authorize arbitrary devices. Key management is outside the contract's scope.

### 4. Firmware Substitution

**Threat:** Agent runs unauthorized firmware but passes verification.

**Mitigation:** Gate 2 checks that `fw_hash` is in `approved_firmware`. The owner must explicitly call `ApproveFirmware` for any firmware hash. Unrecognized firmware hashes are rejected.

**Residual risk:** If the owner approves a firmware hash without verifying the binary, malicious firmware could be legitimized. The integrity of the approval process is the owner's responsibility.

### 5. Front-Running

**Threat:** Validator or attacker observes a `VerifyReceipt` transaction in the mempool and submits it first.

**Mitigation:** TON does not have a public mempool in the same sense as EVM chains. Transactions are routed through validators and settled quickly. The counter mechanism ensures that even a successful front-run only advances the counter — the attacker does not gain anything beyond a temporary denial of service.

**Residual risk:** Timing-based attacks remain theoretically possible on any blockchain. Applications requiring strict ordering should manage nonces at the application layer.

### 6. Digest Collision

**Threat:** Attacker finds two different receipts with the same SHA-256 digest.

**Mitigation:** SHA-256 collision resistance. As of 2026, no practical collision attack on SHA-256 is known.

### 7. Contract Upgrade / Ownership Transfer

**Threat:** Owner transfers contract ownership to a malicious address.

**Mitigation:** The current contract has no ownership transfer mechanism. The owner set at deploy time is permanent. Adding ownership transfer would require a contract upgrade, which requires redeployment.

**Residual risk:** The owner is a single point of failure. A multisig owner address is recommended for production deployments.

---

## Out of Scope

- **TON validator compromise:** Standard blockchain assumption. If validators collude to reorder or censor, all TON contracts are affected equally.
- **Hardware supply chain attacks:** If eFuse data is cloned at the manufacturing level, `hw_id` could be duplicated. This is a hardware problem.
- **Client SDK compromise:** If the SDK is replaced with a malicious version, the digest computation could be altered. Users should verify SDK integrity.
- **Social engineering of the owner:** If the owner is tricked into authorizing a rogue device, the contract correctly processes that authorization.

---

## Security Assumptions

1. SHA-256 is collision-resistant and preimage-resistant.
2. The TON VM executes Tact/FunC bytecode correctly.
3. The owner's private key is not compromised.
4. Hardware identifiers (`hw_id`) are not cloneable from the physical device.

---

## Recommended Production Hardening

- Use a multisig wallet as the contract owner
- Implement a time-lock on `AuthorizeDevice` and `ApproveFirmware` operations
- Add an event indexer to monitor for repeated Gate 3 failures (replay attempts)
- Rotate firmware hashes regularly and revoke old ones
- Consider adding an expiry mechanism to authorized devices
