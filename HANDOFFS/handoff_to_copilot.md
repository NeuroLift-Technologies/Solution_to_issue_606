# Handoff to Copilot

## Current State
- Repo scaffolded with TOI/OTOI schemas, functions, and Vitest coverage.
- Cloud Function stubs rely on abstract `AgentStore` instead of Firebase SDK.
- Five TOI examples seeded for core Deliberate Lab roles.

## Next Steps for Copilot
1. Wire `AgentStore` to actual Firebase Admin SDK calls and add integration smoke tests.
2. Extend `roleToFileMap` to load TOIs dynamically from Firestore or Cloud Storage instead of the filesystem.
3. Pair with researchers to encode additional roles (policy reviewer, experimentation lead, etc.).

## Notes
- Keep tests deterministic by mocking file reads.
- Ensure any new dependencies are documented in README.
