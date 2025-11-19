# Sample Session Flow

1. Researcher provisions a new Deliberate Lab session in Firebase.
2. Each agent record is created with a `role` field (participant, moderator, etc.).
3. `attachTOIOnAgentJoin` listens for `/sessions/{id}/agents/{agentId}` writes and:
   - Loads the matching TOI JSON.
   - Validates it against `toi.schema.json`.
   - Attaches the TOI contract + status back to the agent.
4. The orchestrator calls `buildSystemPromptFromTOI` using the stored contract to seed the agent's system prompt.
5. Agents interact following the encoded initiation rights, constraints, and accessibility preferences.
6. Researchers audit the run by referencing the `toi_version` recorded with every agent transcript.
