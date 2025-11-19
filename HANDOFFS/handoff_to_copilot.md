# Handoff to Microsoft Copilot

Copilot, please focus on:

1. **Infrastructure wiring** – adapt `FUNCTIONS/attachTOIOnAgentJoin.ts` to your preferred Firebase or Azure Functions deployment template.
2. **Secrets + config** – externalize TOI storage (Cloud Storage bucket, Git repo, or secret manager) and document environment variables for the loader function.
3. **CI hooks** – add GitHub Actions to run `npm test` on pull requests and surface Ajv validation failures inline.

Document any environment-specific changes inside this file so downstream agents maintain continuity.
