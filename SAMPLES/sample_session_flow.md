# Sample Session Flow

1. **Facilitator uploads TOIs** for moderator, participants, observer, and neurodivergent advocate into the Firebase storage bucket.
2. **Session creation** triggers the facilitator script which registers `/sessions/{id}` with metadata including experiment hypothesis and roster.
3. **Agent joins** Firestore path `/sessions/{id}/agents/{agentId}`. The Cloud Function passes the new record into `attachTOIOnAgentJoin`.
4. **TOI lookup** uses `FileSystemTOIRepository` (or your preferred storage) to locate the JSON that matches the agent's role.
5. **Validation + attachment**: `validateTOI` ensures the contract matches the schema and writes `toi_status="validated"` with inline errors if anything fails.
6. **Prompt bootstrapping**: The orchestrator feeds the stored TOI to `buildSystemPromptFromTOI`, generating a deterministic system prompt for the model runtime.
7. **OTOI monitoring**: The combined state is added to the OTOI manifest so researchers can audit which contracts were active during the session.
