# orchestration.yml — Schema Definition

> This document defines the schema for `.github/orchestration.yml`, the central configuration file for the orchestration system.

---

## Purpose

Single configuration file that controls:
- Project document storage paths
- Pipeline scope guards (hard limits)
- Error handling thresholds
- Git strategy
- Human gate defaults
- Agent-to-skill mappings (optional overrides)

---

## Schema

```yaml
# .github/orchestration.yml
# Orchestration System Configuration
# -----------------------------------

version: "1.0"

# ─── Project Storage ───────────────────────────────────────────────
projects:
  base_path: ".github/projects"          # Where project folders are created
  naming: "SCREAMING_CASE"               # SCREAMING_CASE | lowercase | numbered

# ─── Pipeline Limits (Scope Guards) ───────────────────────────────
limits:
  max_phases: 10                         # Maximum phases per project
  max_tasks_per_phase: 8                 # Maximum tasks per phase
  max_retries_per_task: 2                # Auto-retries before escalation
  max_consecutive_review_rejections: 3   # Reviewer rejects before human escalation

# ─── Error Handling ────────────────────────────────────────────────
errors:
  severity:
    critical:                            # Fail-fast → stop pipeline → human
      - "build_failure"
      - "security_vulnerability"
      - "architectural_violation"
      - "data_loss_risk"
    minor:                               # Auto-retry via corrective task
      - "test_failure"
      - "lint_error"
      - "review_suggestion"
      - "missing_test_coverage"
      - "style_violation"
  on_critical: "halt"                    # halt | report_and_continue
  on_minor: "retry"                      # retry | halt | skip

# ─── Git Strategy ──────────────────────────────────────────────────
git:
  strategy: "single_branch"             # single_branch | branch_per_phase | branch_per_task
  branch_prefix: "orch/"                # Prefix for orchestration branches
  commit_prefix: "[orch]"               # Prefix for commit messages
  auto_commit: true                     # Agents commit after task completion

# ─── Human Gate Defaults ───────────────────────────────────────────
human_gates:
  after_planning: true                   # Always gate after master plan (hard default)
  execution_mode: "ask"                  # ask | phase | task | autonomous
  # ask = orchestrator asks human at start
  # phase = gate after each phase
  # task = gate after each task
  # autonomous = no gates during execution
  after_final_review: true               # Always gate after final review (hard default)

# ─── Agent Configuration (optional overrides) ──────────────────────
agents:
  orchestrator:
    model: null                          # null = use default model
  research:
    model: null
  product_manager:
    model: null
  ux_designer:
    model: null
  architect:
    model: null
  tactical_planner:
    model: null
  coder:
    model: null
  reviewer:
    model: null
```

---

## Field Reference

### `version`
Schema version. Used for future migration support.

### `projects.base_path`
Relative path from workspace root where project folders are created. Each project gets a subfolder: `{base_path}/{PROJECT-NAME}/`.

### `projects.naming`
How project file names are formatted:
- `SCREAMING_CASE`: `MYAPP-PRD.md` (default, matches draft)
- `lowercase`: `myapp-prd.md`
- `numbered`: `01-prd.md`

### `limits.*`
Hard enforcement. When a limit is hit, the pipeline halts and writes an escalation to STATUS.md.

### `errors.severity`
Classification lists. The Tactical Planner and Reviewer use these to categorize failures. Lists are extensible — agents match error descriptions against these categories.

### `errors.on_critical` / `errors.on_minor`
Action to take for each severity level. `halt` stops the pipeline. `retry` generates a corrective task. `skip` logs and continues.

### `git.*`
Controls how agents interact with version control. `auto_commit: true` means agents commit after task completion with standardized messages.

### `human_gates.*`
Controls where the pipeline pauses for human approval. `after_planning` and `after_final_review` are hard-coded `true` — these cannot be overridden (safety). `execution_mode: "ask"` means the orchestrator will prompt the human at execution start.

### `agents.*.model`
Optional per-agent model override. `null` uses whatever model is selected in the Copilot model picker. Useful for routing cheaper models to research tasks or more capable models to architecture.

---

## Validation Rules

1. `version` must be `"1.0"`
2. All `limits.*` values must be positive integers
3. `errors.severity.critical` and `errors.severity.minor` must not overlap
4. `errors.on_critical` must be one of: `halt`, `report_and_continue`
5. `errors.on_minor` must be one of: `retry`, `halt`, `skip`
6. `git.strategy` must be one of: `single_branch`, `branch_per_phase`, `branch_per_task`
7. `human_gates.execution_mode` must be one of: `ask`, `phase`, `task`, `autonomous`
8. `projects.base_path` must be a valid relative path
