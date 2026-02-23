# Cheatsheet: TON-SHA

*Orthonode Infrastructure Labs*

---

## Contract Address

```
Testnet: kQBVqAhPv_ANWm0hfjJdLnQmvvC8_rQ_NEryVX3uFOUF05OP
Explorer: https://testnet.tonscan.org/address/kQBVqAhPv_ANWm0hfjJdLnQmvvC8_rQ_NEryVX3uFOUF05OP
Gas Cost: 0.03 TON per operation (70% optimized)
```

---

## Blueprint Commands

```bash
# Build contract
npx blueprint build

# Deploy to testnet
npx blueprint run deployTonSha --testnet

# Run agent trust demo (gas-optimized with state polling)
npx blueprint run agentTrustDemo --testnet

# Run full four-scenario demo
npx blueprint run agentDemo --testnet

# Check on-chain state
npx blueprint run checkState --testnet

# Check contract owner
npx blueprint run checkOwner --testnet

# Approve firmware + verify receipt (skip authorize)
npx blueprint run approveAndVerify --testnet

# Single receipt verification
npx blueprint run verifyReceipt --testnet
```

---

## Message Types

### VerifyReceipt (permissionless)
```typescript
{
    $$type: 'VerifyReceipt',
    hw_id: bigint,      // uint64
    fw_hash: bigint,    // uint256
    ex_hash: bigint,    // uint256
    counter: bigint,    // uint64 — must be > last accepted counter
    digest: bigint,     // uint256 — sha256 of packed cell
}
```

### AuthorizeDevice (owner only)
```typescript
{
    $$type: 'AuthorizeDevice',
    hw_id: bigint,      // uint64
}
```

### ApproveFirmware (owner only)
```typescript
{
    $$type: 'ApproveFirmware',
    fw_hash: bigint,    // uint256
}
```

### RevokeDevice (owner only)
```typescript
{
    $$type: 'RevokeDevice',
    hw_id: bigint,      // uint64
}
```

---

## Getters

```typescript
await tonSha.getIsAuthorized(hw_id)         // → boolean
await tonSha.getIsApprovedFirmware(fw_hash) // → boolean
await tonSha.getGetCounter(hw_id)           // → bigint
await tonSha.getGetOwner()                  // → Address
```

---

## Digest Computation

```typescript
import { beginCell } from '@ton/core';
import { sha256 } from '@ton/crypto';

const cell = beginCell()
    .storeUint(hw_id, 64)
    .storeUint(fw_hash, 256)
    .storeUint(ex_hash, 256)
    .storeUint(counter, 64)
    .endCell();

const bits = cell.bits.subbuffer(0, cell.bits.length);
const digest = BigInt('0x' + (await sha256(bits)).toString('hex'));
```

**Critical:** Use `subbuffer` on cell bits, NOT `cell.hash()` or `cell.toBoc()`. Only the raw cell bits match what Tact's `sha256(slice)` computes on-chain.

---

## Events

```
VerificationPassed { hw_id: uint64, counter: uint64 }
VerificationFailed { hw_id: uint64, reason: uint8 }
```

Failure reason codes:
- `1` — device not authorized
- `2` — firmware not approved
- `3` — counter replay detected
- `4` — digest mismatch

---

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Invalid checksum` | Wrong address format (EQ vs kQ) | Copy address from deploy output exactly |
| Gate 1 fails | Device not authorized | Call `AuthorizeDevice` as owner first |
| Gate 2 fails | Firmware not approved | Call `ApproveFirmware` as owner first |
| Gate 3 fails | Counter too low | Use a counter higher than last accepted |
| Gate 4 fails | Wrong digest | Use `subbuffer` method, not `cell.hash()` |
| Getter shows stale data | Block not finalized yet | Wait 10-15 seconds after transaction |
| Tonkeeper won't sign | On mainnet, not testnet | Settings → Dev Tools → Switch to Testnet |

---

## Receipt Format (640 bits)

```
[hw_id: 64 bits][fw_hash: 256 bits][ex_hash: 256 bits][counter: 64 bits]
                                                                          → sha256 → digest (256 bits)
```

Total packed: 640 bits = 80 bytes
