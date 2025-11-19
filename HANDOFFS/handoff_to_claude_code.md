# Handoff to Claude Code — Refactor & Hardening Lead

## Current State Snapshot
- **Schemas**: `SCHEMAS/toi.schema.json` and `SCHEMAS/otoi.schema.json` cover the required surface area for DeepMind's request.
- **Functions**: Validation, prompt construction, and agent attachment live under `FUNCTIONS/` with extensive inline documentation.
- **Samples**: Narrative walkthroughs and before/after comparisons explain how TOI replaces informal prompt "recipes."
- **Tests**: Minimal suites cover validation success/failure paths and prompt construction integrity. They run via `npm test` without external dependencies.

## Areas for Claude Code to Extend
1. **Full JSON Schema Compliance**: Swap the lightweight validator for AJV or another standards-compliant runtime, then increase fixture coverage (edge cases, negative tests per field).
2. **OTOI Manifests**: Implement helper utilities that merge multiple TOIs into a single OTOI document with dependency validation.
3. **CI & Tooling**: Add GitHub Actions, linting, and typedoc generation so future agents can reason about changes faster.
4. **Firebase Bindings**: Provide sample Cloud Functions showing `attachTOIOnAgentJoin` in context, including Firestore security rules.

Please keep the zero-fabrication rule intact—log any assumptions you make while hardening the repo.
