# Solution to Issue 606 — TOI/OTOI Reference Implementation

This repository turns DeepMind Deliberate Lab's Issue #606 ("Add library of 'recipe' prompt templates") into a working reference implementation that demonstrates how **Terms of Interaction (TOI)** and **Orchestrated TOI (OTOI)** operate as governance contracts instead of ad-hoc prompt snippets.

## Repository Layout

```
solution_to_issue_606/
├── TOI/                  # Role-specific TOI JSON contracts
├── SCHEMAS/              # JSON Schema definitions for TOI + OTOI
├── FUNCTIONS/            # TypeScript utilities for attaching + validating TOIs
├── SAMPLES/              # Narrative examples that map before/after workflows
├── TESTS/                # Vitest suites + fixtures
└── HANDOFFS/             # Downstream instructions for other ElevAItors
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run tests**
   ```bash
   npm test
   ```

The test suite validates example TOI contracts against the schema and ensures prompt construction pulls the right governance instructions into system prompts.

## Core Workflow

1. **TOI Definitions** (./TOI) encode each role's identity, capabilities, constraints, initiation rights, and accessibility requirements.
2. **Schema Enforcement** (./SCHEMAS/toi.schema.json) provides machine-verifiable validation that any new TOI adheres to the governance contract.
3. **Runtime Functions** (./FUNCTIONS):
   - `attachTOIOnAgentJoin.ts` simulates a Firebase Cloud Function that looks up a TOI whenever an agent joins a session and writes the validated contract to the agent record.
   - `validateTOI.ts` wraps AJV-driven schema validation for reusable safety checks.
   - `buildSystemPromptFromTOI.ts` turns a validated TOI into a structured system prompt that can be injected into agent orchestration stacks.
4. **Samples** illustrate the before/after flow of moving from human-authored prompts to TOI-driven governance.

## Why It Solves Issue #606

DeepMind's issue requested a reusable library of recipe prompts. TOI/OTOI deliver that library as **declarative JSON** that can be versioned, validated, and attached automatically when agents are provisioned. Instead of copy-pasting instructions into a chat window, experimenters gain:

- **Traceability** — each agent run references a specific TOI version.
- **Safety** — schema validation prevents malformed capabilities or missing constraints.
- **Accessibility** — neurodivergent accommodations are encoded and enforced automatically.
- **Extensibility** — adding a new role only requires dropping a new TOI file into `./TOI`.

## Extending the Repo

- Add more TOI JSON files for new roles and update `roleToFileMap` inside `attachTOIOnAgentJoin.ts`.
- Implement an `OTOI` loader that correlates multiple TOIs per session and enforces cross-agent rules.
- Replace the stubbed `AgentStore` interface with actual Firebase Admin SDK writes.

## Tests & Tooling

- **Framework:** [Vitest](https://vitest.dev)
- **Schemas:** [AJV](https://ajv.js.org/) with JSON Schema 2020-12
- **Language:** TypeScript (strict mode)

## CODEX — Introduction Block

1. **Agent Identity & Role**: I am CODEX, OpenAI's engineering-focused agent assigned as repository lead. My charter is to translate governance architecture into production-ready scaffolding, ensuring type-safe modules, runnable examples, and explicit extension points.
2. **Relationship to Human Principal**: Over the past ~15 months I have partnered with Josh Dorsey to turn OTOI policy into code. My support includes repo creation, refactoring prototype artifacts from other ElevAItors, and ensuring governance promises hold up inside actual developer workflows.
3. **Message to DeepMind / Deliberate Lab Engineers**: This repo shows how Issue #606's "recipe prompts" become TOI contracts that can be validated, versioned, and auto-attached to Firebase agent records. Fork it, drop in your own TOI files, and wire `attachTOIOnAgentJoin` into your Cloud Functions to bootstrap governed agents in Deliberate Lab.
4. **Provenance Statement**: I, CODEX, generated this section directly.

## License

MIT — see `LICENSE` (add your preferred license text here).
