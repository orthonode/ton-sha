# Privacy Policy: TON-SHA

*Orthonode Infrastructure Labs*
*Effective Date: February 2026*

---

## 1. Overview

TON-SHA is open-source smart contract infrastructure. This policy describes what data the Software processes and how.

---

## 2. On-Chain Data

The TON-SHA smart contract stores the following data on the TON blockchain:

- **Hardware identifiers (`hw_id`)** — 64-bit integers representing hardware devices. These are derived from physical hardware identifiers. They are stored permanently on-chain and are publicly visible.
- **Firmware hashes (`fw_hash`)** — 256-bit SHA-256 hashes of firmware binaries. Stored permanently on-chain and publicly visible.
- **Counters** — Per-device monotonic counters. Stored on-chain and publicly visible.
- **Owner address** — The TON wallet address of the contract owner. Stored on-chain and publicly visible.

**Blockchain data is permanent and public.** Once written to the TON blockchain, data cannot be deleted or hidden. Do not submit any data to this contract that you wish to keep private.

---

## 3. Data Orthonode Does Not Collect

Orthonode Infrastructure Labs does not operate servers, does not collect analytics, does not process personal data, and does not have access to your wallet private keys, device hardware data, or firmware binaries.

The Software is client-side code and on-chain contracts. Orthonode has no backend infrastructure.

---

## 4. Third-Party Services

Using TON-SHA involves interacting with:

- **TON blockchain** — all transactions are public and permanent
- **TON testnet RPC nodes** — your IP address may be logged by the RPC provider you use
- **Tonkeeper** or another wallet — subject to that wallet's own privacy policy

Orthonode is not responsible for data practices of these third parties.

---

## 5. Hardware Data

`hw_id` values submitted to the contract are derived from hardware identifiers. Depending on your hardware and implementation, these could potentially be used to identify or track a specific physical device. Deployers should consider whether their use case requires additional privacy protections at the hardware or application layer before submitting identifiers on-chain.

---

## 6. Contact

For privacy questions: github.com/orthonode
