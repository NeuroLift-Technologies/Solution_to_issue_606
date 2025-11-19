# Sample Session Flow (TOI → OTOI)

1. **Facilitator initializes session**
   - Creates an OTOI document referencing `facilitator`, `debate_moderator`, `participant`, `observer`, and `neurodivergent_support` TOIs.
   - Stores the OTOI contract alongside session metadata in Firebase.

2. **Agents join**
   - Each agent record includes `role` and `status: "pending"`.
   - `attachTOIOnAgentJoin` triggers, loads the matching TOI JSON, validates it, and annotates the agent document with `toi` and `toiStatus`.

3. **Prompt generation**
   - Clients call `buildSystemPromptFromTOI` to assemble a system prompt for the agent. Accessibility and memory policies are embedded into the prompt string.

4. **Live deliberation**
   - Moderator enforces turn-taking and applies initiation rights.
   - Neurodivergent support agent checks `interactionContract.accessibility` to proactively offer grounding.

5. **Handoff & audit**
   - Observer publishes an anonymized record that references the OTOI session and the TOI versions applied.
   - Facilitator files a compliance note detailing any deviations captured by `toiStatus !== 'validated'`.
