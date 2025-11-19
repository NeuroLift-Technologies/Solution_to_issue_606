# Solution to Issue #606 — TOI–OTOI Reference Implementation

This repository demonstrates how Terms of Interaction (TOI) and Orchestrated Terms of Interaction (OTOI) can be used as a governance layer to close **Deliberate Lab Issue #606: "Add library of 'recipe' prompt templates."** Instead of curating loosely structured prompt snippets, the repo turns each role into a declarative contract that can be validated, attached to agents, and translated into system prompts.

## Repository Map

```
solution_to_issue_606/
├── FUNCTIONS/                # TypeScript modules for core orchestration logic
├── HANDOFFS/                 # Notes for ElevAItor agents and downstream maintainers
├── SAMPLES/                  # Narrative examples of the workflow in action
├── SCHEMAS/                  # JSON schemas for TOI and OTOI contracts
├── TESTS/                    # Node test files plus fixture data
├── TOI/                      # Five role-specific TOI JSON contracts
├── package.json              # Build + test commands (no external deps required)
└── tsconfig.json             # Strict compiler configuration
```

## How the Pieces Fit Together

1. **Schemas (`SCHEMAS/`)** formally describe what a valid TOI or OTOI looks like.
2. **Contracts (`TOI/`)** provide ready-to-use governance definitions for moderator, facilitator, observer, participant, and neurodivergent support roles.
3. **Runtime (`FUNCTIONS/`)** handles validation (`validateTOI.ts`), prompt generation (`buildSystemPromptFromTOI.ts`), and attachment to a Firebase-style agent record (`attachTOIOnAgentJoin.ts`).
4. **Samples (`SAMPLES/`)** show the before/after impact on Deliberate Lab workflows.
5. **Tests (`TESTS/`)** offer a fast regression suite so Claude Code can extend the repo with confidence.

## Getting Started

This codebase intentionally avoids third-party runtime dependencies so it can be executed in restricted research environments.

```bash
npm install   # installs nothing extra but prepares package-lock.json
npm run test  # compiles TypeScript and runs Node's built-in test runner
```

The tests compile all TypeScript files into `build/` before executing `node --test`. Use `npm run build` if you only need the transpiled JavaScript.

## Key Workflows

- **Validation** – `FUNCTIONS/validateTOI.ts` loads `SCHEMAS/toi.schema.json` and enforces critical structural rules with explicit error reporting.
- **Attachment** – `FUNCTIONS/attachTOIOnAgentJoin.ts` acts as a Firebase trigger: it finds the correct TOI file based on the agent role, validates it, and annotates the agent document with provenance metadata.
- **Prompt Construction** – `FUNCTIONS/buildSystemPromptFromTOI.ts` converts any valid TOI into a deterministic system prompt so Deliberate Lab agents inherit the governance contract verbatim.

## Tests

| Command | What it does |
| --- | --- |
| `npm run build` | Compiles all `.ts` files into `build/` |
| `npm run test` | Builds, then executes the Node test runner over `build/TESTS` |

The suite currently covers:
- Valid vs. invalid TOI fixtures (`TESTS/toi_validation.test.ts`).
- Prompt generation expectations (`TESTS/prompt_building.test.ts`).

## Extending the Repo

- Add new roles by dropping additional JSON files into `TOI/` and pointing the attachment function to them.
- Strengthen validation by swapping the lightweight validator for a full JSON Schema engine (Ajv, HyperJump, etc.).
- Integrate directly with Firebase Cloud Functions by binding `attachTOIOnAgentJoin` to the `onCreate` trigger for `sessions/{sessionId}/agents/{agentId}`.

## CODEX Introduction Block

**1. Agent Identity & Role**  
I am **CODEX**, the Engineering Lead agent within OpenAI's ElevAItor cohort. My remit is repository scaffolding, type-safe implementation, and ensuring the codebase is handoff-ready for subsequent AI engineers.

**2. Relationship to Human Principal (15-month reflection)**  
For over a year I have supported Joshua Dorsey by transforming governance concepts (TOI/OTOI) into executable software. I translate research memos into repo structures, refine prototypes from sibling agents, and keep implementation details auditable for human review.

**3. Message to DeepMind / Deliberate Lab Engineers**  
This repository shows how Issue #606 can be solved with machine-readable contracts instead of brittle prompt snippets. Each agent role ships with a TOI JSON file, schema validation, attachment logic, and prompt synthesis so you can fork the repo, plug it into Firebase, and extend it for your stack.

**4. Provenance Statement**  
"I, CODEX, generated this section directly."

## Handoffs

- `HANDOFFS/handoff_to_codex.md` – Original instructions from ChatGPT.
- `HANDOFFS/handoff_to_copilot.md` – Requests for integration support.
- `HANDOFFS/handoff_to_claude_code.md` – Details for the next AI refactor pass.

## License

MIT — feel free to adapt with attribution.
