# Contributing: TON-SHA

*Orthonode Infrastructure Labs*

---

## Welcome

TON-SHA is open-source infrastructure. Contributions are welcome — bug reports, documentation improvements, contract enhancements, and SDK additions.

---

## Getting Started

1. Fork the repository
2. Follow the [Setup Guide](docs/SETUP_GUIDE.md) to get your environment working
3. Run `npx blueprint run checkState --testnet` to verify you can connect to the testnet contract
4. Make your changes on a feature branch

---

## Types of Contributions

### Bug Reports
Open a GitHub issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Your Node.js version and OS

### Contract Changes
- All contract changes must include updated tests in `tests/`
- Run `npx blueprint build` and `npx blueprint test` before submitting
- For security-sensitive changes, open an issue for discussion before a PR

### SDK / Script Changes
- Scripts in `scripts/` should include comments explaining what each step does
- Keep scripts self-contained — minimize dependencies between scripts
- Test with the live testnet contract before submitting

### Documentation
- Follow the tone and style of existing docs (technical, direct, no marketing fluff)
- Update the docs index in README.md if you add a new doc

---

## Pull Request Process

1. Open a PR against the `main` branch
2. Describe what the PR does and why
3. Reference any related issues
4. Ensure `npx blueprint build` passes
5. A maintainer will review within 7 days

---

## Code Style

**Tact contracts:**
- Use descriptive variable names
- Comment each gate in `VerifyReceipt` with its purpose
- No unused imports

**TypeScript scripts:**
- Use `async/await` throughout
- Log clearly at each step — scripts are as much documentation as they are code
- Export `async function run(provider: NetworkProvider)` as the entry point

---

## What We're Not Looking For

- Gas optimizations at the expense of readability (this is infrastructure code)
- New features without discussion (open an issue first)
- Changes to the four-gate logic without a strong security justification

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
