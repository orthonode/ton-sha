# Setup Guide: TON-SHA

*Orthonode Infrastructure Labs*

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 22+ | Required by Tact compiler |
| npm | 10+ | Comes with Node 22 |
| Tonkeeper | Latest | Mobile wallet for testnet |
| Testnet TON | 1+ TON | From faucet bot |

---

## Step 1 — Install Node.js 22

**Using nvm (recommended):**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
node --version  # should show v22.x.x
```

**Verify:**
```bash
node --version   # v22.x.x
npm --version    # 10.x.x
```

---

## Step 2 — Clone and Install

```bash
git clone https://github.com/orthonode/ton-sha
cd ton-sha
npm install
```

---

## Step 3 — Install Blueprint

```bash
# Fix npm global permissions first
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Install blueprint globally
npm install -g @ton/blueprint
```

---

## Step 4 — Get a Testnet Wallet

1. Install [Tonkeeper](https://tonkeeper.com/) on your phone
2. Create or import a wallet
3. Enable testnet mode: **Settings → Dev Tools → Switch to Testnet**
4. Your testnet wallet address will appear in the app

---

## Step 5 — Get Testnet TON

Open Telegram and message [@testgiver_ton_bot](https://t.me/testgiver_ton_bot):

```
/start
<your testnet wallet address>
```

The bot sends 2 testnet TON within seconds. This is enough for multiple deploys and dozens of interactions.

---

## Step 6 — Get a Testnet API Key (Optional)

For direct RPC access, get a key from [@tonapibot](https://t.me/tonapibot) on Telegram:

```
/get_api_key
→ select testnet
```

Store it in `.env` if you add custom scripts that use direct RPC.

---

## Step 7 — Build the Contract

```bash
npx blueprint build
# Select: TonSha
# Should output: ✅ Compiled successfully!
```

---

## Step 8 — Quick Test Commands

```bash
# Check live contract state
npx blueprint run checkState --testnet

# Run complete four-scenario demo  
npx blueprint run agentDemo --testnet

# Quick end-to-end demo
npx blueprint run fullDemo --testnet

# Deploy your own instance
npx blueprint run deployTonSha --testnet
```

All scripts use the live testnet contract at `kQBVqAhPv_ANWm0hfjJdLnQmvvC8_rQ_NEryVX3uFOUF05OP`.

---

## Troubleshooting

### `EACCES: permission denied` on npm install
```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### `nvm prefix conflict` warning
```bash
nvm use --delete-prefix v22.22.0
```

### Blueprint says `command init not found`
Use `blueprint create ContractName` not `blueprint init`.

### `Invalid checksum` on address parse
TON addresses have two formats: `EQ...` (non-bounceable) and `kQ...` (bounceable). Both refer to the same contract but have different checksums. The deploy script outputs the correct format — always copy the address exactly from deploy output.

### Transaction signed but contract state unchanged
The transaction may have hit the wrong address (EQ vs kQ format mismatch), or Tonkeeper was on mainnet instead of testnet when signing. Verify Tonkeeper is in testnet mode before every session.

### Getters return `false` immediately after transaction
TON has ~5 second block time. Wait 10-15 seconds after a transaction before calling getters. The scripts include delays for this reason.
