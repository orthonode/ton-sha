# Security Policy: TON-SHA

*Orthonode Infrastructure Labs*

---

## Current Status

TON-SHA is a **research prototype** deployed on TON testnet. It has not undergone a professional third-party security audit. Do not use it in production or with real funds.

---

## Supported Versions

| Version | Network | Status |
|---------|---------|--------|
| 0.1.0 | TON Testnet | Active — research prototype |
| Mainnet | — | Not yet deployed |

---

## Reporting a Vulnerability

If you discover a security vulnerability in the TON-SHA contract, SDK, or documentation, please report it responsibly.

**Contact:** Open a private security advisory at github.com/orthonode/ton-sha/security/advisories

**Please include:**
- A description of the vulnerability
- Steps to reproduce
- The potential impact
- Any suggested mitigations

**Response timeline:**
- Acknowledgement within 48 hours
- Initial assessment within 7 days
- Fix or mitigation plan within 30 days for critical issues

---

## Known Limitations

The following are known limitations of the current prototype, not bugs:

1. **No ownership transfer** — the contract owner is set at deploy time and cannot be changed. Production deployments should use a multisig from day one.

2. **No device expiry** — authorized devices remain authorized indefinitely. A TTL mechanism is planned for Phase 1.

3. **Single-point admin** — all authorization operations go through one owner address. Multisig support is on the roadmap.

4. **No audit** — this contract has not been professionally audited. It is testnet-only for this reason.

---

## Scope

In scope for vulnerability reports:
- The Tact smart contract (`contracts/ton_sha.tact`)
- The TypeScript SDK scripts
- Receipt format and digest computation

Out of scope:
- TON blockchain itself
- Tonkeeper or other wallets
- Hardware device security

---

## Acknowledgements

Responsible disclosures will be acknowledged in release notes with the reporter's permission.
