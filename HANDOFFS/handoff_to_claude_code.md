# Handoff to Claude Code

## Current State
- Repository scaffolded with TOI/OTOI schemas, sample contracts, and Firebase-ready helpers.
- Ajv-based validator + prompt builder covered by lightweight TypeScript tests.
- Sample documentation illustrates how contracts replace ad-hoc prompt libraries.

## Next Steps for Claude Code
1. **Refactor for runtime contexts** – extract an interface for TOI storage backends (filesystem, Firestore, GCS) and add dependency injection tests.
2. **Strengthen typing** – generate TypeScript types automatically from the JSON schema (e.g., `ts-json-schema-generator`) to avoid drift.
3. **Expand tests** – cover edge cases: metadata omissions, initiation rights at zero, and localization of formatting preferences.
4. **CI/CD polish** – add linting, formatting, and GitHub Actions to publish npm-ready packages.

## Known Gaps / Technical Debt
- No persistence layer is wired up; loader is expected to be provided by the deployment environment.
- Tests run via `ts-node` for portability; future iterations should adopt Vitest or Jest with watch mode and coverage reports.
- Accessibility taxonomy is a curated list; coordinate with research partners before expanding enumerations.

Thanks for taking it from here!
