# Handoff to Claude Code

## Current Implementation Snapshot
- TypeScript modules cover TOI validation, prompt generation, and simulated Firebase attachment logic.
- AJV enforces `toi.schema.json`; `otoi.schema.json` is scaffolded for future cross-agent orchestration.
- Vitest ensures fixtures stay aligned with schemas and prompts include governance-critical sections.

## Known Gaps / Technical Debt
1. `attachTOIOnAgentJoin` reads TOIs from the filesystem. It should support dynamic storage (Firestore/Cloud Storage) and caching.
2. No runtime OTOI support yet. Need utilities that load multiple TOIs per session and enforce `rules` defined in `otoi.schema.json`.
3. Tests rely on actual file IO; mocking layers would improve speed and enable error-path coverage.

## Suggested Next Steps
- Introduce dependency injection for the TOI loader so production deployments can swap storage providers.
- Expand schemas to cover localization, telemetry consent, and agent-to-agent messaging caps.
- Add CI (GitHub Actions) running `npm test` and linting, plus coverage thresholds.
- Pair this repo with a sample Firebase emulator config showing how events trigger `attachTOIOnAgentJoin`.
