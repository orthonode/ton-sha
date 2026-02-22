# Architecture: TON-SHA

*Orthonode Infrastructure Labs*

---

## Overview

TON-SHA is a three-layer system: a hardware device that generates receipts, a client SDK that assembles and submits them, and a Tact smart contract on TON that verifies them through four sequential gates.

The key design principle is **no trusted intermediary**. The contract does not call an oracle. It does not accept signed attestations from a server. It reconstructs the expected digest from the submitted fields and compares it to the submitted digest. If they match and the other three gates pass, the verification is accepted. If not, it is rejected with a specific failure code.

---

## Layer 1 — Hardware

The hardware device is the root of trust. It holds:

- A **hardware identifier** (`hw_id`) derived from manufacturer-burned identifiers that cannot be changed or cloned. On ESP32-S3, this comes from eFuse registers. On other hardware, equivalent permanent identifiers serve this role.
- A **firmware hash** (`fw_hash`) — the SHA-256 hash of the firmware binary currently running.
- A **monotonic counter** that increments with each receipt generated and is never reset.

The device computes:

```
digest = SHA-256(hw_id || fw_hash || ex_hash || counter)
```

where `ex_hash` is the SHA-256 of the current computation result, and `||` denotes bit-concatenation in the packed cell format.

---

## Layer 2 — Client SDK

The TypeScript SDK (scripts in this repository) handles:

- Packing the receipt fields into the correct cell format
- Computing the SHA-256 digest using `@ton/crypto`
- Constructing and sending the `VerifyReceipt` message to the contract
- Reading contract state via getters

**Digest computation (must match on-chain):**

```typescript
const cell = beginCell()
    .storeUint(hw_id, 64)
    .storeUint(fw_hash, 256)
    .storeUint(ex_hash, 256)
    .storeUint(counter, 64)
    .endCell();

const bits = cell.bits.subbuffer(0, cell.bits.length);
const digest = BigInt('0x' + (await sha256(bits)).toString('hex'));
```

The cell must be packed in exactly this order and field width. The contract packs identically before computing its expected digest. Any deviation causes Gate 4 to fail.

---

## Layer 3 — Smart Contract

The contract is written in Tact and compiled to FunC/FIFT for the TON VM.

### Storage

```
owner: Address
authorized_devices: map<Int, Bool>   // hw_id → authorized
approved_firmware:  map<Int, Bool>   // fw_hash → approved
counters:           map<Int, Int>    // hw_id → last seen counter
```

### Message Handlers

**`VerifyReceipt`** (permissionless)

Runs the four-gate check:

```
Gate 1: authorized_devices[hw_id] == true
Gate 2: approved_firmware[fw_hash] == true
Gate 3: counter > counters[hw_id]
Gate 4: sha256(packed_cell) == digest
```

On failure at gate N: emit `VerificationFailed { hw_id, reason: N }`
On success: `counters[hw_id] = counter`, emit `VerificationPassed { hw_id, counter }`

**`AuthorizeDevice { hw_id }`** (owner only)

Sets `authorized_devices[hw_id] = true`.

**`ApproveFirmware { fw_hash }`** (owner only)

Sets `approved_firmware[fw_hash] = true`.

**`RevokeDevice { hw_id }`** (owner only)

Sets `authorized_devices[hw_id] = false`. Does not reset the counter.

### Getters

```
isAuthorized(hw_id) → Bool
isApprovedFirmware(fw_hash) → Bool
getCounter(hw_id) → Int
getOwner() → Address
```

---

## Why SHA-256 (Not Keccak-256)

TON's VM has a native `sha256` opcode. Tact exposes it directly. Using it avoids implementing Keccak-256 in contract code, which would be both expensive and risky.

The original SHA on Arbitrum uses Keccak-256 because that is Ethereum's native hash. TON-SHA uses SHA-256 for the same reason in reverse — it is TON's native hash. Cross-chain receipt verification would require a hash translation layer, which is left for future work.

---

## Event Model

Events are emitted as cells via `emit()`. Indexers and clients can decode them:

```
VerificationPassed { hw_id: uint64, counter: uint64 }
VerificationFailed { hw_id: uint64, reason: uint8 }
```

`reason` values: 1 = unauthorized device, 2 = unapproved firmware, 3 = replay detected, 4 = digest mismatch.

---

## Gas Profile

Each message type has predictable gas cost:

| Operation | Estimated Gas |
|-----------|--------------|
| `AuthorizeDevice` | ~15,000 |
| `ApproveFirmware` | ~15,000 |
| `VerifyReceipt` (pass) | ~25,000 |
| `VerifyReceipt` (fail gate 1) | ~10,000 |
| `RevokeDevice` | ~10,000 |

Gas costs are low because the contract does no external calls and all storage is map-based with O(1) lookup.

---

## Trust Model

| Actor | Trusted For |
|-------|-------------|
| TON VM | Correct execution of Tact/FunC bytecode |
| Contract owner | Authorizing legitimate hardware and firmware |
| Hardware device | Generating correct receipts from real eFuse data |
| Client SDK | Correct digest computation and message packing |

The contract does **not** trust the caller's identity beyond checking `sender() == self.owner` for admin operations. Any address may submit a `VerifyReceipt` — the cryptographic gates are the defense.
