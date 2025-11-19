# Before vs After — Issue #606

| Scenario | Before (Recipe Prompt) | After (TOI Contract) |
| --- | --- | --- |
| Moderator onboarding | Human copies a prompt blob into chat. No versioning or validation. | Moderator role references `TOI/debate_moderator.v1.json`. Validation guarantees required constraints and escalation paths exist. |
| Accessibility | Each facilitator remembers to mention accommodations manually. | `interaction_contract.accessibility` encodes token limits, reading level, formatting, and neurodivergent support in JSON and surfaces in the generated prompt. |
| Governance handoff | Experiment log only stores free-form chat history. | Agent record now stores `{ toi_version, toi_status }`, enabling audits and reproducibility. |
| Adding new roles | Requires writing another long prompt by hand. | Drop a new TOI file + update `roleToFileMap`, then reuse the same attach + validation pipeline. |
