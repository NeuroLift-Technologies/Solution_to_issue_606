# Before vs. After: Recipe Templates → TOI Contracts

| Scenario | Before (ad-hoc prompt) | After (TOI + OTOI) |
| --- | --- | --- |
| Role definition | "Be a fair moderator" | `TOI/debate_moderator.v1.json` encodes capabilities, constraints, and metadata |
| Initiation rules | Moderator improvises | `agent.initiationRights` ensures transparent triggers and escalation |
| Accessibility | Optional appendix | `interactionContract.accessibility` enforces token limits, formatting, and neurodivergent cues |
| Compliance | Manual note-taking | `toiStatus` persisted in Firebase enables audits |
| Collaboration | Unclear handoffs | `otoi.schema.json` models upstream/downstream responsibilities |

## Narrative Example

**Before:** Engineers copy a Markdown prompt, lightly edit it, and hope each research assistant interprets it the same way. Accessibility commitments are buried in an email thread.

**After:** Agents load a validated TOI. Prompts are built programmatically from the same JSON contract the compliance team reviewed. Session-level OTOI files show how those contracts connect, so DeepMind researchers can fork the repo and add their own TOIs without rewriting business logic.
