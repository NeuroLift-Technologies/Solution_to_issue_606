# Governance File Index — NeuroLift Technologies `Solution_to_issue_606`

**Last updated:** 2026-04-06  
**Maintained by:** `.nltotoi/` namespace tooling  
**Scope:** `NeuroLift-Technologies/Solution_to_issue_606`

---

## Core Governance Files

| File | Type | Purpose | Required |
|---|---|---|---|
| `NLT-DEV-OTOI.md` | Contract | Org-level coding agent contract (ORG-DEV-OTOI-1.0.2) | ✅ |
| `AGENTS.md` | Gateway | Internal agent coordination gateway | ✅ |
| `nltotoi.json` | Manifest | Machine-readable discovery manifest | ✅ |
| `README.md` | Overview | Repository overview and purpose | ✅ |
| `file-structure.md` | ADR | Architecture decision record for this repo structure | ✅ |
| `CLAUDE.md` | Instructions | Agent session instructions and plan | ✅ |

---

## .nltotoi Namespace

| File | Purpose | Required |
|---|---|---|
| `.nltotoi/README.md` | Namespace overview | ✅ |
| `.nltotoi/index/governance-files.md` | This file — governance registry | ✅ |
| `.nltotoi/contracts/README.md` | Contract namespace and versioning | ✅ |
| `.nltotoi/scripts/validate-governance.sh` | Automated compliance validation | ✅ |
| `.nltotoi/proposals/validation-roadmap.md` | Planned validation improvements | ✅ |

---

## Templates

| File | Purpose | Source |
|---|---|---|
| `templates/agent-registration.json` | Agent self-registration format | OTOI Section 3 |
| `templates/handoff-record.json` | Session handoff format | OTOI Section 5 |
| `templates/escalation.md` | Escalation record format | OTOI Section 4.3 |
| `templates/intent-log.md` | Intent logging before action | OTOI Section 7 |
| `templates/commit-message.md` | Commit message format reference | OTOI Section 4.2, SOP-NLT-001 Step 7 |

---

## GitHub Templates

| File | Purpose |
|---|---|
| `ISSUE_TEMPLATE/agent-escalation.md` | GitHub issue form for agent escalations |
| `ISSUE_TEMPLATE/governance-proposal.md` | GitHub issue form for OTOI amendment proposals |
| `PULL_REQUEST_TEMPLATE/agent-contribution.md` | Agent PR checklist with governance requirements |

---

## CI Workflows

| File | Purpose | Trigger | SOP |
|---|---|---|---|
| `.github/workflows/validate-governance.yml` | Governance validation (runs validate-governance.sh) | push, pull_request | SOP-NLT-002 |
| `.github/workflows/repo-governance-check.yml` | _(planned)_ Reusable governance check for NLT repos | workflow_call | SOP-NLT-002 |
| `.github/workflows/agent-commit-format.yml` | _(planned)_ Validates agent commit message format on PRs | pull_request | SOP-NLT-001 |
| `.github/workflows/agent-session-check.yml` | _(planned)_ Verifies handoff records exist before PR merge | pull_request | SOP-NLT-001 |
| `.github/workflows/incident-detection.yml` | _(planned)_ Scans commits for credential exposure; opens incident issue | push | SOP-NLT-003 |
| `.github/workflows/secret-scan-pr.yml` | _(planned)_ Scans PR commits for credential exposure; fails check to block merge | pull_request | SOP-NLT-003 |
| `.github/workflows/org-repo-compliance.yml` | _(planned)_ Scans all org repos for mandatory governance files | schedule, workflow_dispatch | SOP-NLT-002 |
| `.github/workflows/agent-profile-validation.yml` | _(planned)_ Validates agents/*.md NLT frontmatter fields | push, pull_request | SOP-NLT-002 |
| `.github/workflows/nltotoi-check.yml` | _(planned)_ Reusable workflow_call to validate nltotoi.json in any NLT repo | workflow_call | SOP-NLT-002 |

---

## Composite Actions

| Path | Purpose |
|---|---|
| `.github/actions/cloudflare-workers-ai/action.yml` | _(planned)_ Call Cloudflare Workers AI REST API (text gen, embeddings, classification) |

---

## Agent Profiles — GitHub Copilot Custom Agents (`agents/`)

| File | Purpose | Required |
|---|---|---|
| `agents/README.md` | NLT standards and instructions for creating/using custom agents | ✅ |
| `agents/example-agent.md` | Commented-out starter template for new agent profiles | ✅ |
| `agents/registry.json` | Machine-readable agent routing registry consumed by issue-assignment workflows | ✅ |
| `agents/nlt-governance-steward.md` | Governance steward agent — enforces ORG-DEV-OTOI-1.0.2 | ✅ |
| `agents/nlt-code-reviewer.md` | Code review agent — NLT security and governance standards | ✅ |
| `agents/nlt-onboarding-assistant.md` | Onboarding agent — walks agents through SOP-NLT-001 | ✅ |

---

## Agent Profiles — VS Code / GitHub Copilot Chat (`.github/agents/`)

| File | Purpose | Required |
|---|---|---|
| `.github/agents/nlt-governance-steward.agent.md` | VS Code variant of governance steward with tool declarations and handoffs | ✅ |
| `.github/agents/nlt-code-reviewer.agent.md` | VS Code variant of code reviewer with handoff to governance steward | ✅ |
| `.github/agents/nlt-onboarding-assistant.agent.md` | VS Code variant of onboarding assistant with handoffs | ✅ |

---

## SOPs (Standard Operating Procedures)

| File | Purpose |
|---|---|
| `SOPs/new-agent-onboarding.md` | How to onboard a new coding agent |
| `SOPs/repo-governance-setup.md` | How to add governance stubs to a new NLT repo |
| `SOPs/incident-response.md` | What to do when an agent goes off-rails |

---

## File Count Summary

| Category | Count |
|---|---|
| Core governance | 6 |
| .nltotoi namespace | 5 |
| Templates | 5 |
| GitHub templates | 3 |
| CI workflows | 10 |
| SOPs | 3 |
| Agent profiles (Copilot) | 5 |
| Agent profiles (VS Code) | 3 |
| **Total** | **40** |

---

*Generated from `.nltotoi/index/governance-files.md` | NeuroLift Technologies | ORG-DEV-OTOI-1.0.2*
