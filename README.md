# solution_to_issue_606

> Reference implementation that shows how TOI–OTOI governance contracts solve DeepMind Deliberate Lab Issue #606 ("Add library of recipe prompt templates").

## Why this repo exists

Deliberate Lab researchers asked for a reusable prompt template library. Instead of more copy/pasted Markdown, this repo demonstrates how **Terms of Interaction (TOI)** and **Orchestrated TOI (OTOI)** documents provide machine-readable contracts that:

- describe each agent's role, capabilities, and constraints,
- encode accessibility and neurodivergent support requirements,
- formalize initiation rights and escalation paths, and
- attach those guarantees directly to Firebase session records.

## Repository layout

```
solution_to_issue_606/
├── TOI/                    # Concrete TOI contracts for each Deliberate Lab role
├── SCHEMAS/                # JSON Schemas for TOI and OTOI documents
├── FUNCTIONS/              # TypeScript utilities + Cloud Function entry point
├── SAMPLES/                # Human-readable walkthroughs and comparisons
├── TESTS/                  # Lightweight TypeScript tests + fixtures
└── HANDOFFS/               # Notes for the next ElevAItor agents (Copilot, Claude Code, etc.)
```

## Getting started

```bash
npm install  # optional, no additional dependencies required
npm test
```

`npm test` compiles the TypeScript sources with `tsc` and executes the scripts in `TESTS/` to validate the schema and prompt builder against curated fixtures. Use `npm run build` to compile the utilities into `dist/` for deployment.

## Key workflows

1. **Agent joins a session.** `attachTOIOnAgentJoin` reads the agent's role, loads the matching TOI JSON, validates it with `SCHEMAS/toi.schema.json`, and stores both the TOI object and `toiStatus` flag on the Firebase document.
2. **Prompt materialization.** Client services call `buildSystemPromptFromTOI` to turn the TOI JSON into a deterministic system prompt that includes accessibility and memory requirements.
3. **Governance overview.** `SCHEMAS/otoi.schema.json` illustrates how to coordinate multiple TOIs in the same deliberation session, modeling upstream/downstream handoffs.

See `SAMPLES/sample_session_flow.md` and `SAMPLES/before_after_comparison.md` for human-readable walkthroughs.

## Implementation notes

- `FUNCTIONS/validateTOI.ts` wraps a purpose-built JSON Schema validator (`FUNCTIONS/simpleJsonValidator.ts`) that supports the subset of Draft-07 features used in the TOI schema. Swap it with Ajv or another validator if you need the full spec.
- `FUNCTIONS/attachTOIOnAgentJoin.ts` accepts dependency-injected Firestore + loader objects so you can plug in Cloud Storage, Git submodules, or REST sources.
- `FUNCTIONS/buildSystemPromptFromTOI.ts` produces a deterministic prompt string that inlines accessibility, initiation rights, and metadata.

## Extending the implementation

- Add new TOIs by following `SCHEMAS/toi.schema.json` and placing the files in `TOI/`.
- Update `loadTOI` logic inside your Cloud Function deployment to read TOIs from Cloud Storage, Firestore, or this repository.
- Expand the tests under `TESTS/` with more fixtures to cover regression scenarios.

## Handoffs

Detailed notes for Copilot, Claude Code, and other ElevAItors live in `HANDOFFS/`. Start with `handoff_to_codex.md` (project intro) and `handoff_to_claude_code.md` (next engineering phase).
