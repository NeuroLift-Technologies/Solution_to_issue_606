# Before vs After: Recipe Templates

| Workflow Step | Before (Prompt Library) | After (TOI–OTOI Contracts) |
| --- | --- | --- |
| Role assignment | Engineer copies a Markdown template and edits it manually. | `attachTOIOnAgentJoin` automatically injects the validated TOI JSON. |
| Safety controls | Reliant on memory; no machine-readable guardrails. | Constraints and escalation paths travel with the TOI and appear in the prompt. |
| Accessibility | Optional notes, frequently skipped. | `interaction_contract.accessibility` enforces token budgets and accommodations. |
| Multi-agent cohesion | Each agent improvises; no shared governance layer. | OTOI files describe how roles relate across the session. |
| Auditing | Difficult to prove what prompt was used. | Agent documents store `toi_version`, `toi_source`, and provenance metadata. |
