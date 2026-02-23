# Deployment Guide: TON-SHA

*Orthonode Infrastructure Labs*

---

## Live Contract

The reference deployment is already live on TON testnet:

```
Address: kQBVqAhPv_ANWm0hfjJdLnQmvvC8_rQ_NEryVX3uFOUF05OP
Network: TON Testnet
Owner:   EQC4J5GXJfu-a1zegwbILPPhQ6xZozsgP8CDSSrv5TlWXnVs
Status:  ✅ Production Ready (All 4 gates verified)
```

Explorer: https://testnet.tonscan.org/address/kQBVqAhPv_ANWm0hfjJdLnQmvvC8_rQ_NEryVX3uFOUF05OP

---

## Deploying Your Own Instance

### 1. Build

```bash
npx blueprint build
# Select: TonSha
```

### 2. Deploy

```bash
npx blueprint run deployTonSha --testnet
```

- Select **Tonkeeper** when prompted
- Scan the QR code with Tonkeeper (must be in testnet mode)
- Approve the transaction

Output:
```
Contract deployed at address kQ...
✅ TonSha deployed at: EQ...
Owner: EQ...
Contract owner confirmed: EQ...
```

Save the contract address — you'll need it for all subsequent interactions.

---

## Interacting with the Contract

### Authorize a Hardware Device (owner only)

Edit `scripts/fullDemo.ts` and set your `HW_ID`. Then:

```bash
npx blueprint run fullDemo --testnet
```

This runs the full sequence: authorize device → approve firmware → submit receipt.

Or use the individual scripts:

**Authorize only:**
Edit `scripts/approveAndVerify.ts` and call only the `AuthorizeDevice` send.

### Approve Firmware (owner only)

Set your `FW_HASH` and send `ApproveFirmware`. The hash must be the SHA-256 of your actual firmware binary.

### Submit a Receipt

Send `VerifyReceipt` with:
- `hw_id` — the hardware identifier
- `fw_hash` — must match an approved firmware hash
- `ex_hash` — the SHA-256 of your computation result
- `counter` — must be strictly greater than the last accepted counter for this `hw_id`
- `digest` — `sha256(packed cell of above four fields)`

See `scripts/fullDemo.ts` for the exact digest computation.

### Check State

```bash
npx blueprint run checkState --testnet
```

### Check Owner

```bash
npx blueprint run checkOwner --testnet
```

---

## Address Format Notes

TON addresses appear in two formats:
- `EQ...` — non-bounceable (use for wallets receiving TON)
- `kQ...` — bounceable (standard contract address format)

Both point to the same contract. `Address.parse()` accepts either format but validates the checksum strictly. Always copy addresses from deploy output exactly — do not retype them.

---

## Updating the Contract

Tact contracts on TON are not upgradeable by default. To update logic:

1. Modify `contracts/ton_sha.tact`
2. Run `npx blueprint build`
3. Run `npx blueprint run deployTonSha --testnet`
4. Update the contract address in all scripts

The old contract continues to exist at its address indefinitely.

---

## Verifying Deployment

After deploy, verify via getter:

```bash
npx blueprint run checkOwner --testnet
# Contract owner: EQ... (your wallet address)
# Your wallet:    EQ... (same)
```

Then run the full demo to verify all four gates work:

```bash
npx blueprint run fullDemo --testnet
# authorized: true
# fw approved: true
# counter: 1
```

Check the explorer to see the three on-chain transactions confirming the gates.
