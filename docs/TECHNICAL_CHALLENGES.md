# Technical Challenges: TON-SHA

*Orthonode Infrastructure Labs*

---

## Overview

Building TON-SHA required solving several non-obvious problems across the Tact language, TON's address system, and cross-layer digest computation. This document records what went wrong, why, and how it was fixed.

---

## 1. Tact Contract Parameter Syntax Conflict

**Problem:** Tact v1.6 introduced a contract parameter syntax (`contract Foo(param: Type)`) intended to replace `init()` for simple cases. However, this syntax is incompatible with declaring additional storage fields in the contract body. The compiler rejects any field declarations when parameters are present.

```tact
// FAILS in Tact 1.6.13
contract TonSha(owner: Address) {
    authorized_devices: map<Int, Bool>;  // ← error: cannot define fields with parameters
}
```

**Fix:** Revert to the classic `init(owner: Address)` pattern with explicit field declarations:

```tact
// WORKS
contract TonSha {
    owner: Address;
    authorized_devices: map<Int, Bool>;

    init(owner: Address) {
        self.owner = owner;
    }
}
```

---

## 2. Heredoc Shell Corruption

**Problem:** Using bash heredocs (`<< 'EOF'`) to write multi-line Tact files in the terminal caused systematic corruption. Long files would have lines concatenated, truncated, or interleaved, producing syntactically invalid Tact that the compiler rejected with confusing errors.

**Root cause:** Terminal line-length limits and shell buffering behavior when piping long heredoc content.

**Fix:** Write files externally and copy them to the project directory. Never use heredocs for files longer than ~20 lines.

---

## 3. TON Address Format: EQ vs kQ Checksum Mismatch

**Problem:** TON addresses exist in two forms — `EQ...` (non-bounceable) and `kQ...` (bounceable). They refer to the same contract but have different checksums. `Address.parse()` validates the checksum strictly and throws `Invalid checksum` if the format doesn't match.

The deploy script outputs the `EQ...` form. The testnet explorer shows the `kQ...` form. Manually mixing these caused `Invalid checksum` errors across all scripts.

**Fix:** Always copy the address from deploy output verbatim. Never retype or convert manually. The `EQ` form works with `Address.parse()` if the characters are copied exactly.

---

## 4. Digest Computation Cross-Layer Alignment

**Problem:** The client and the contract must compute the same SHA-256 digest from the same inputs. Three different methods produce different results:

| Method | Input | Result |
|--------|-------|--------|
| `sha256(cell.hash())` | Hash of the cell structure | Different — hashes the cell's Merkle hash |
| `sha256(cell.toBoc())` | Full BOC serialization | Different — includes BOC framing |
| `sha256(cell.bits.subbuffer(...))` | Raw bit content of the cell | ✅ Matches Tact's `sha256(slice)` |

**Root cause:** Tact's `sha256(slice)` hashes the raw bit content of the slice, not the cell hash or the BOC encoding. The client must extract the same raw bits.

**Fix:** Extract bits from the cell using `subbuffer` and hash those:

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

This was confirmed empirically: the resulting digest `e1e5de5317ac5e0b...` matched the on-chain computation and Gate 4 passed.

---

## 5. npm Permissions and Node Version

**Problem:** The system Node.js was v18.19.1 (installed system-wide to `/usr/local`). Tact requires Node 22+. Global npm installs failed with `EACCES` because `/usr/local/lib/node_modules` requires root.

**Fix:**
1. Install nvm and Node 22 (user-level, no root required)
2. Set npm global prefix to `~/.npm-global` to avoid permission issues
3. Clear any stale `_authToken` config from npm

---

## 6. Blueprint `init` Command Does Not Exist

**Problem:** Blueprint v2.x does not have a `blueprint init` command. Documentation and AI tooling frequently suggest it, but it does not exist. Running it returns `Error: command init not found`.

**Fix:** Use `blueprint create ContractName` to scaffold a new contract. Use `npx blueprint build` and `npx blueprint run scriptName` for build and execution.

---

## 7. Missing `package.json` After Blueprint Create

**Problem:** After running `blueprint create TonSha` in an empty directory, blueprint creates the contract files but does not create `package.json`. Running `npm install` fails because there is no package manifest.

**Fix:** Run `npm init -y` first, then `npm install @ton/core @ton/blueprint @ton/crypto @ton/ton`. Blueprint's create command only scaffolds the contract — the project dependencies must be installed separately.

---

## 8. Transaction Reaching Wrong Contract Address

**Problem:** The `verifyReceipt.ts` script was hardcoded with an address that had a typo in the final characters (`LvDO` vs `LktE`). Three transactions were signed and sent but reached a different contract that either did not exist or was a different deployment, resulting in TON being returned or lost.

**Fix:** Always derive the contract address programmatically from the compiled artifact hash, or copy it character-by-character from the deploy output. Added `checkOwner.ts` as a diagnostic to confirm the script is targeting the correct contract before sending any value transactions.

---

## 9. `ApproveFirmware` Appearing to Fail

**Problem:** After fixing the contract address, `ApproveFirmware` still showed `false` from getters immediately after the transaction was sent.

**Root cause:** TON's block time is ~5 seconds. The script was calling getters within 1-2 seconds of sending the transaction, before the block containing it had been finalized.

**Fix:** Increased all post-transaction wait times to 15 seconds. After the wait, all getters returned correct values.

---

## Summary

| Challenge | Root Cause | Fix |
|-----------|------------|-----|
| Parameter syntax | Tact 1.6 breaking change | Use `init()` pattern |
| File corruption | Heredoc shell limits | Write files externally |
| Address checksum | EQ/kQ format mismatch | Copy addresses verbatim |
| Digest mismatch | Wrong SHA-256 input | Hash raw cell bits |
| npm permissions | System Node + root dirs | nvm + home prefix |
| Blueprint command | Docs outdated | Use `create` not `init` |
| Missing package.json | Blueprint doesn't create it | `npm init -y` first |
| Wrong contract | Address typo | Verify with `checkOwner` |
| False getter reads | 5s block time | Wait 15s after send |
