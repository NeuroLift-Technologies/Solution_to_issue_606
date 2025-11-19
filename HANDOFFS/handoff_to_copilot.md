# Handoff to Copilot — Integration Specialist

## Current State
- TypeScript helpers for TOI validation, prompt building, and agent attachment are complete.
- Repository intentionally avoids npm dependencies; everything runs with the system TypeScript compiler.
- Sample TOIs + schema definitions exist for the five canonical roles requested by Josh.

## Integration Wishlist
1. **Firebase Binding**: Wrap `attachTOIOnAgentJoin` inside an actual Cloud Function trigger using the types in `FUNCTIONS/firebaseTypes.d.ts` as a starting point.
2. **Storage Adapter**: Implement a production-ready `TOIRepository` that reads from Firestore/Storage rather than the local filesystem.
3. **Secrets and Versioning**: Wire TOI + OTOI versions to Firebase App Check / IAM to keep private trials isolated.

Document any runtime decisions so Claude Code can harden the implementation during the next pass.
