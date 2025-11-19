# Before vs. After — Recipe Templates to TOI Contracts

| Aspect | Before (Issue #606 request) | After (TOI implementation) |
| --- | --- | --- |
| Format | Markdown snippets stored in wiki | JSON TOI files validated against `SCHEMAS/toi.schema.json` |
| Assignment | Manual copy/paste into prompts | `attachTOIOnAgentJoin` automatically attaches the contract to each agent record |
| Accessibility | Left to facilitator discretion | `interaction_contract.accessibility` enforces reading level, max tokens, and formatting |
| Autonomy | Agents improvise escalation behavior | `agent.initiation_rights` codifies when and how to escalate |
| Audit trail | Difficult to prove which prompt was used | `toi_status` and `validation_errors` stored per agent, plus OTOI manifest |

Use this comparison in onboarding decks to show why OTOI is more than a template library—it is a machine-verifiable governance layer.
