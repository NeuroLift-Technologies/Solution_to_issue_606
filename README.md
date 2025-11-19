# Solution to Issue #606 — TOI–OTOI Reference Implementation

This repository translates the governance expectations described in Deliberate Lab's GitHub Issue #606 ("Add library of 'recipe' prompt templates") into executable code. Rather than supplying another ad-hoc prompt list, the project models governance as **Terms of Interaction (TOI)** files and coordinates multiple TOIs inside an **Orchestrated Terms of Interaction (OTOI)** network.

## Repository Layout

```
solution_to_issue_606/
├── TOI/                # Canonical role contracts expressed as JSON
├── SCHEMAS/            # JSON Schemas describing TOI and OTOI payloads
├── FUNCTIONS/          # TypeScript helpers for Firebase/agent orchestration
├── SAMPLES/            # Narrative walkthroughs and before/after comparisons
├── TESTS/              # TypeScript tests + fixtures used in CI
└── HANDOFFS/           # Documentation for multi-agent development
```

## How It Works

1. **TOI Contracts** define each agent's identity, capabilities, constraints, and accessibility expectations.
2. **OTOI Schema** shows how multiple TOIs relate to one another for a single session, giving researchers a portable governance manifest.
3. **Validation + Attachment**: When an agent joins a session, `attachTOIOnAgentJoin.ts` loads the correct TOI, runs structural validation (`validateTOI.ts`), and attaches the contract plus validation status to the agent record.
4. **Prompt Construction**: `buildSystemPromptFromTOI.ts` turns a validated TOI into a deterministic system prompt (or structured instructions) so experimenters can copy/paste it into the LLM runtime of their choice.

## Running the Tests

The project intentionally keeps a zero-dependency toolchain so it can run in restricted sandboxes. Ensure Node.js ≥ 18 with TypeScript available on your PATH, then run:

```bash
npm test
```

The test workflow compiles the TypeScript sources to `dist/` and executes the generated JavaScript with Node's built-in assertion library. Two suites run sequentially:

- `toi_validation.test.ts`: Confirms valid TOIs pass validation and malformed payloads surface detailed errors.
- `prompt_building.test.ts`: Ensures the system prompt includes all critical clauses derived from the TOI.

## Adapting to Firebase

`FUNCTIONS/attachTOIOnAgentJoin.ts` provides the orchestration logic without binding directly to Firebase. Implementers can wrap the exported function inside a Cloud Function trigger, injecting repositories/writers that read from Cloud Storage, Firestore, or another secret store. The included `FileSystemTOIRepository` is suitable for local development and unit tests.

## Extending the Governance Model

- Add new TOI files under `TOI/` and update the OTOI manifest to describe how roles relate.
- Capture richer schema expectations in `SCHEMAS/otoi.schema.json` as you add dependency rules or cross-agent workflows.
- Use `HANDOFFS/handoff_to_claude_code.md` to understand the refactoring + test-hardening wishlist for the next contributor.

## Credits

This repository was scaffolded by ChatGPT (Rapid Prototyping Lead) and handed to CODEX for engineering completion as part of the ElevAItor multi-agent workflow supporting Joshua Dorsey and the DeepMind Deliberate Lab team.
