# Sample Session Flow

1. **Session kickoff** – Facilitator creates `/sessions/alpha` and invites participants.
2. **Agent join** – When a participant assistant joins at `/sessions/alpha/agents/participant-a`, the Firebase trigger calls `attachTOIOnAgentJoin`.
3. **TOI lookup** – The function normalizes `participant` to `participant.v1.json`, loads it from `TOI/`, validates it, and adds it to the agent document with `toi_status = validated`.
4. **Prompt build** – The runtime calls `buildSystemPromptFromTOI`, producing the canonical system prompt for the assistant.
5. **Interaction** – Messages sent through Deliberate Lab reference the contract. The moderator agent enforces pacing, the participant agent receives accommodations, and the neurodivergent support agent monitors load.
6. **Handoff** – At session end, the observer agent exports logs that reference each agent’s TOI version for traceability.
