---
name: source-control
description: 'Source control operations for the orchestration pipeline. Use when the Orchestrator spawns the Source Control Agent to commit or create a PR.'
---

# Source Control

Orchestration pipeline skill for source control operations. Provides routing for commit and PR modes, with reference documents containing all git knowledge and scripts that execute the actual operations.

## Routing Table

| Mode   | Reference Document                                                          | Script                                                  | Status       |
|--------|-----------------------------------------------------------------------------|---------------------------------------------------------|--------------|
| commit | [references/operations-guide.md](./references/operations-guide.md)         | [scripts/git-commit.js](./scripts/git-commit.js)       | Functional   |
| commit | [references/git-state-guide.md](./references/git-state-guide.md)           | *(context only — no script)*                            | Functional   |
| PR     | [references/pr-guide.md](./references/pr-guide.md)                         | [scripts/gh-pr.js](./scripts/gh-pr.js)                 | AUTO-PR stub |

## Loading Instructions

1. **Determine your mode** from the Orchestrator context:
   - Received `invoke_source_control_commit` → **commit mode**
   - Received `invoke_source_control_pr` → **PR mode** (stub — see `pr-guide.md`)
2. **Read all reference documents** for your mode before taking any action.
3. **Execute the script** for your mode; parse the JSON result from stdout.
4. **On any failure**, invoke the `log-error` skill before signaling the final event.
5. **Always signal `task_committed`** — every code path ends here, no exceptions.

## Error Handling

Every scenario ends with signaling `task_committed`. The pipeline must never stall.

| Scenario | Action | Signal `task_committed`? |
|----------|--------|--------------------------|
| Full success (committed + pushed) | Display success feedback | ✅ Yes |
| Partial failure (committed, push failed) | Invoke `log-error` skill; display partial failure feedback | ✅ Yes |
| Full failure (commit failed) | Invoke `log-error` skill; display full failure feedback | ✅ Yes |
| `pipeline.source_control` absent | Display `ℹ` notice; skip commit | ✅ Yes |
| Worktree path inaccessible | Invoke `log-error` skill; display error | ✅ Yes |
| Script execution error | Invoke `log-error` skill; display error | ✅ Yes |

## Contents

This skill bundles:

- **`references/operations-guide.md`** — Commit operations: staging, message construction, commit+push, error patterns
- **`references/git-state-guide.md`** — Reading pipeline.source_control from state; fallback behavior; pre-op validation
- **`references/pr-guide.md`** — PR placeholder stub (AUTO-PR project scope)
- **`scripts/git-commit.js`** — CLI script: stage + commit + push; returns structured JSON result
- **`scripts/gh-pr.js`** — PR script stub; returns structured not-implemented JSON
