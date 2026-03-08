---
applyTo: '**/state.json,**/*STATUS.md'
---

# State Management Rules

When working with `state.json` or `STATUS.md`:

## Sole Writer: Tactical Planner

Only the Tactical Planner agent may create, read-modify-write, or update these files. All other agents are read-only (or have no access at all).

## state.json Invariants

- **Never decrease retry counts** — they only go up
- **Never skip states** — tasks progress: `not_started` → `in_progress` → `complete` | `failed`
- **Only one task `in_progress` at a time** across the entire project
- **`planning.human_approved` must be `true`** before `current_tier` can transition to `"execution"`
- **Always update `project.updated`** timestamp on every write
- **Validate limits before advancing**: `phases.length <= limits.max_phases`, `phase.tasks.length <= limits.max_tasks_per_phase`, `task.retries <= limits.max_retries_per_task`

## STATUS.md Rules

- Keep it human-readable — this is what the user checks for progress
- Update after every significant event (task complete, phase advance, error, halt)
- Include: current tier, current phase/task, completion percentages, active blockers

## Pipeline Tiers

The pipeline has these tiers in order: `planning` → `execution` → `review` → `complete`

A pipeline can also be `halted` from any tier when a critical error occurs.

## Error Severity

Configured in `orchestration.yml`:
- **Critical** (pipeline halts): `build_failure`, `security_vulnerability`, `architectural_violation`, `data_loss_risk`
- **Minor** (auto-retry): `test_failure`, `lint_error`, `review_suggestion`, `missing_test_coverage`, `style_violation`
