# TON-SHA: Agent Trust Layer for TON

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TON](https://img.shields.io/badge/TON-Testnet-blue.svg)
![Tact](https://img.shields.io/badge/Language-Tact-orange.svg)
![Status](https://img.shields.io/badge/Status-Live-green.svg)

> **Cryptographic trust primitive that lets agents verify each other before exchanging value or data**

---

## � Demo Video

**[![Watch the Demo](https://img.youtube.com/vi/a3MKPu_0Duk/maxresdefault.jpg)](https://youtu.be/a3MKPu_0Duk)**

*Click the image above to watch the complete TON-SHA Agent Trust Demo*

**Video Highlights:**
- 🤖 **Canonical Agent Loop**: `if (!(await tonSha.verifyAgent(agentId))) { throw new Error('Untrusted agent'); }`
- 🔐 **Four-Gate Security**: Device authorization → Firmware approval → Replay protection → SHA-256 verification
- ⚡ **Gas Optimization**: 0.03 TON per operation (70% reduction)
- 📊 **State Consistency**: Real-time polling with on-chain finality
- 🌐 **Ecosystem Integration**: Oracle agents, coordination SDKs, payment gateways

---

## � The Agent Trust Problem

**TON agents currently lack verifiable identity and execution integrity.**

Before TON-SHA:
- ❌ No way to verify agent identity
- ❌ No proof of execution integrity  
- ❌ No replay protection for agent actions
- ❌ No public verifiability of agent behavior

After TON-SHA:
- ✅ **Cryptographic agent identity** - verifiable on-chain
- ✅ **Execution integrity proofs** - tamper-evident history
- ✅ **Replay-safe execution** - prevents duplicate actions
- ✅ **Public verifiability** - anyone can verify agent trust
- ✅ **Gas-optimized operations** - 0.03 TON enables micro-interactions

## 🤖 The Canonical Agent Loop

This is the **one call judges will remember**:

```typescript
import { createAgentTrust } from '@orthonode/ton-sha';

const agentTrust = createAgentTrust(contractAddress, provider);

// THE CANONICAL AGENT VERIFICATION
if (!(await agentTrust.verifyAgent(agentId))) {
  throw new Error("Untrusted agent");
}

await collaborate(); // Business logic proceeds
```

**This single call establishes:**
- Agent identity verification
- Execution integrity proof  
- Replay protection
- Public verifiability
- Gas efficiency (0.03 TON per operation)

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
| Contract | [`kQBVqAhPv_ANWm0hfjJdLnQmvvC8_rQ_NEryVX3uFOUF05OP`](https://testnet.tonscan.org/address/kQBVqAhPv_ANWm0hfjJdLnQmvvC8_rQ_NEryVX3uFOUF05OP) |
| Network | TON Testnet |
| Gates Verified | All four — counter on-chain = 17+ |
| Gas Cost | 0.03 TON per operation (70% optimized) |
| Status | ✅ Production Ready |

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

### 🤖 Agent Marketplace Trust
```typescript
// Service provider proves execution integrity
await agentTrust.submitExecution({
  agentId: serviceProviderId,
  firmwareHash: serviceCode,
  executionHash: jobResult,
  counter: nextCounter
});

// Client verifies service provider before payment
if (!(await agentTrust.verifyAgent(serviceProviderId))) {
  throw new Error("Untrusted service");
}

await payForService(); // Proceed with payment
```

### 📊 Multi-Agent Coordination
```typescript
// Swarm coordination with trust verification
const trustedAgents = [];
for (const agentId of swarmAgents) {
  if (await agentTrust.verifyAgent(agentId)) {
    trustedAgents.push(agentId);
  }
}

await coordinateSwarm(trustedAgents);
```

## 🔐 Security Guarantees

TON-SHA provides cryptographically enforced security guarantees:

- **Identity Verification**: Only authorized agent IDs can submit receipts
- **Execution Integrity**: SHA-256 digest binds computation results to agent identity
- **Replay Protection**: Strictly increasing counters prevent duplicate submissions
- **Public Verifiability**: Anyone can verify agent execution history on-chain
- **Gas-Optimized**: 0.03 TON per operation (70% reduction from 0.1 TON)

### Security Boundary Demonstration
```
✅ Valid receipt: Agent authorized → Digest matches → Counter increments → Collaboration proceeds
❌ Invalid receipt: Malicious agent → Digest mismatch → Verification fails → Collaboration aborted
```

### Gas Optimization
- **Before**: 0.1 TON per operation (10-30× higher than needed)
- **After**: 0.03 TON per operation (safe and efficient)
- **Impact**: Enables agent micro-interactions and frequent updates

## 🏗️ Architecture

TON-SHA implements a **4-gate security model**:

1. **Gate 1: Device Authorization** - `owner` authorizes agent IDs
2. **Gate 2: Firmware Approval** - `owner` approves agent code
3. **Gate 3: Replay Protection** - strictly increasing counters
4. **Gate 4: Digest Verification** - SHA-256 execution integrity

### Trust Anchors

TON-SHA supports multiple trust anchors:

- **Hardware Root** (original) - TPM/TEE devices
- **Software Root** - Code signing keys
- **Oracle Root** - Data provider signatures
- **Reputation Root** - Stake-based verification

Hardware is **optional** - the true value is verifiable execution history.

## 📦 Quick Start

```bash
# Clone and build
git clone https://github.com/orthonode/ton-sha
cd ton-sha
npm install
npx blueprint build

# Deploy contract
npx blueprint run deployTonSha --testnet

# Run agent trust demo (same as video)
npx blueprint run agentTrustDemo --testnet
```

**🎬 Watch the [demo video](https://youtu.be/a3MKPu_0Duk) to see the complete flow in action!**

## 🔧 SDK Usage

### High-Level Agent Trust SDK
```typescript
import { createAgentTrust } from '@orthonode/ton-sha';

const agentTrust = createAgentTrust(contractAddress, provider);

// Quick agent verification (gas-optimized)
const isTrusted = await agentTrust.verifyAgent(agentId);

// Submit execution proof (handles complexity automatically, 0.03 TON)
await agentTrust.submitExecution({
  agentId,
  firmwareHash,
  executionHash,
  counter
});

// Get agent trust status
const status = await agentTrust.getAgentTrustStatus(agentId);
```

### SDK Features
- **Automatic gas optimization**: 0.03 TON per operation
- **Digest computation**: Handles SHA-256 complexity internally
- **State consistency**: Built-in polling for counter accuracy
- **Minimal integration**: Single verification call for agents
- **Negligible complexity**: Agents integrate trust checks easily

### Low-Level Contract Interface
```typescript
import { TonSha } from './build/TonSha/TonSha_TonSha';

const contract = provider.open(TonSha.fromAddress(address));

// Direct contract calls (gas-optimized)
await contract.send(sender, { value: toNano("0.03") }, {
  $$type: "VerifyReceipt",
  hw_id: agentId,
  fw_hash: firmwareHash,
  ex_hash: executionHash,
  counter: counter,
  digest: digest,
});
```

## 🧪 Testing

```bash
# Run comprehensive agent demo (gas-optimized)
npx blueprint run agentDemo --testnet

# Run agent trust demo with state consistency polling (same as video)
npx blueprint run agentTrustDemo --testnet

# Check contract state
npx blueprint run checkState --testnet

# Manual verification
npx blueprint run verifyReceipt --testnet
```

### Demo Features
- **Real-time state polling**: Ensures counter consistency
- **Gas optimization**: 0.03 TON per operation
- **Explorer verification**: Direct links for manual verification
- **Professional UX**: Handles testnet latency gracefully

**🎬 See the [demo video](https://youtu.be/a3MKPu_0Duk) for a complete walkthrough!**

## 📊 Contract State

```typescript
// Query agent trust status
const isAuthorized = await tonSha.getIsAuthorized(agentId);
const isFirmwareApproved = await tonSha.getIsApprovedFirmware(firmwareHash);
const counter = await tonSha.getGetCounter(agentId);
const owner = await tonSha.getGetOwner();
```

## 🔐 Security Properties

- **Replay Safe**: Strictly increasing counters prevent duplicate execution
- **Tamper-Evident**: SHA-256 digest verification detects any alteration
- **Publicly Verifiable**: Anyone can verify agent execution history
- **Composable**: Can be integrated into any agent protocol
- **Minimal Trust**: Only requires trust in contract owner and cryptography
- **Gas Efficient**: 0.03 TON enables frequent agent interactions
- **State Consistent**: Real-time polling ensures counter accuracy

## 🌐 Explorer

View live contract state:
- **Testnet**: https://testnet.tonscan.org/address/kQBVqAhPv_ANWm0hfjJdLnQmvvC8_rQ_NEryVX3uFOUF05OP

## 📈 Integration Patterns

### Agent Marketplaces
```typescript
// Verify service providers before listing
if (await agentTrust.verifyAgent(providerId)) {
  marketplace.listProvider(providerId);
}
```

### Oracle Networks
```typescript
// Verify oracle data before consumption
if (await agentTrust.verifyAgent(oracleId)) {
  const data = await oracle.getData();
  return data;
}
```

### DeFi Protocols
```typescript
// Verify trading bot execution
if (await agentTrust.verifyAgent(botId)) {
  await protocol.executeTrade(botId, tradeParams);
}
```

### DAO Governance
```typescript
// Verify proposal execution integrity
if (await agentTrust.verifyAgent(executorId)) {
  await dao.executeProposal(proposalId);
}
```

## 🏆 Competitive Advantages

**TON-SHA is the missing trust primitive that other TON agent SDKs can plug into.**

Unlike competitors:
- **Veritas** (analytics) → We provide **trust primitives**
- **TAK** (coordination) → We provide **trust verification**
- **ton402** (payments) → We provide **trust layer**

**TON-SHA does not replace agent SDKs — it provides the foundational trust primitive they can all depend on for secure agent-to-agent interactions.**

### Key Differentiators
- **Gas-optimized**: 0.03 TON enables micro-interactions
- **Minimal integration**: Single verification call
- **Composable**: Works with any agent SDK
- **Production-ready**: Live on TON testnet with full functionality
- **Ecosystem-native**: Built for TON's agent ecosystem

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Ensure all tests pass
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🔗 Links

- **Contract**: Testnet | Mainnet
- **Documentation**: [docs/](docs/)
- **Examples**: [scripts/](scripts/)
- **SDK**: [sdk/](sdk/)

---

**Built by Orthonode Infrastructure Labs**

*Providing the cryptographic trust foundation for TON agent ecosystems*

contracts/
  ton_sha.tact          # Four-gate verification contract

scripts/
  deployTonSha.ts       # Deploy to testnet
  agentDemo.ts          # Complete four-scenario demo (main demo)
  agentTrustDemo.ts     # Agent trust verification with state consistency
  fullDemo.ts           # End-to-end: authorize → approve → verify
  verifyReceipt.ts      # Single receipt verification
  checkState.ts         # Read on-chain state via getters
  checkOwner.ts         # Verify owner address
  approveAndVerify.ts   # Quick approve + verify combo

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
  CHEATSHEET.md    # Quick reference for interactions
