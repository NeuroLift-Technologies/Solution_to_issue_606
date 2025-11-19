# Handoff to Claude Code

## Current State
- TypeScript source lives under `FUNCTIONS/` with strict compiler settings.
- Lightweight validator enforces the TOI schema without third-party dependencies.
- Tests run via `node --test` after compilation and cover validation + prompt building.
- Five TOI JSON files plus OTOI schema and narrative samples are in place.

## Requested Next Steps
1. **Schema Engine Swap** – Replace the handcrafted validator with Ajv or HyperJump so schema drift is impossible.
2. **Edge Cases** – Expand tests to include malformed initiation rights, boundary token limits, and localization requirements.
3. **Cloud Bindings** – Provide Firebase trigger wiring plus mocks so integration tests can run without hitting Firestore.
4. **OTOI Authoring Tools** – Add helpers for composing multi-agent governance plans and verifying cross-agent compatibility.

## Known Gaps
- No CI pipeline yet; GitHub Actions should lint, build, and test.
- Attachment function assumes TOI files are on the local filesystem.
- OTOI schema has no runtime validator yet.

Thanks! This should be a solid base for your hardening and refactor pass.
