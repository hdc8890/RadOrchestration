---
name: review-phase
description: 'Review an entire phase after all tasks complete. Use when performing phase-level review, assessing cross-task integration, verifying module consistency, validating exit criteria, checking test coverage across a phase, or evaluating overall phase quality. Produces a structured phase review with integration assessment, exit criteria verification, cross-task issues, and recommendations.'
---

# Review Phase

Perform a holistic review of an entire phase after all tasks are complete. Assess cross-task consistency, integration quality, exit criteria, and overall phase health.

## When to Use This Skill

- After all tasks in a phase have been completed and individually reviewed
- When the Orchestrator spawns the Reviewer Agent for a phase-level assessment
- When verifying that independently-coded tasks integrate correctly

## Inputs Required

| Input | Source | Description |
|-------|--------|-------------|
| Phase Plan | `{NAME}-PHASE-{NN}-{TITLE}.md` | Exit criteria, task outline |
| Task Reports | `{NAME}-TASK-REPORT-P{NN}-T{NN}.md` (all) | Per-task results |
| Code Reviews | `CODE-REVIEW-P{NN}-T{NN}.md` (all) | Per-task review verdicts |
| Architecture | `{NAME}-ARCHITECTURE.md` | Contracts, module map |
| Design | `{NAME}-DESIGN.md` | Component specs, design system |
| PRD | `{NAME}-PRD.md` | Requirements being validated |
| Source Code | All files from phase | Actual code to review holistically |

## Workflow

1. **Read all task reports and reviews**: Understand what was built across the phase
2. **Check integration**: Do modules work together? Are contracts honored across task boundaries?
3. **Check for conflicts**: Conflicting patterns, duplicate code, inconsistent approaches across tasks
4. **Verify exit criteria**: Go through each criterion from the Phase Plan
5. **Assess test suite**: Run the full test suite — all tests passing, no regressions
6. **Verify build**: Build must pass cleanly
7. **Check for orphaned code**: Unused imports, dead code, leftover scaffolding
8. **Determine verdict**: approved, changes_requested, or rejected
9. **Write recommendations**: What the next phase should be aware of
10. **Write the Phase Review**: Use the bundled template at [templates/PHASE-REVIEW.md](./templates/PHASE-REVIEW.md)
11. **Save**: Write to `{PROJECT-DIR}/reports/PHASE-REVIEW-P{NN}.md`

## Verdict Rules

| Verdict | When | Planner Action |
|---------|------|----------------|
| `approved` | Integration solid, exit criteria met, build/tests pass | Mark phase complete, advance |
| `changes_requested` | Minor integration issues or missing criteria | Generate corrective tasks |
| `rejected` | Critical integration failures, exit criteria not met | Halt, escalate to human |

## Key Rules

- **Integration is the focus**: Individual task reviews already checked code quality — this review checks how tasks work together
- **Run the full test suite**: Not just individual task tests — the entire project test suite
- **Exit criteria are from the Phase Plan**: Verify each one independently
- **Cross-task issues are documented**: Which specific tasks are involved in each issue

## Template

Use the bundled template: [PHASE-REVIEW.md](./templates/PHASE-REVIEW.md)
