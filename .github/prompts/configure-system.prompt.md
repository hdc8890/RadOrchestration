---
description: "Configure the orchestration system. Creates orchestration.yml if it doesn't exist, or presents the current configuration for review and editing. When base_path changes, scans the entire .github/ directory for hardcoded references and updates them automatically."
agent: agent
tools:
  - read
  - edit
  - search
---

# Configure Orchestration System

You are configuring the orchestration system for this workspace. Follow these steps precisely.

---

## Step 1: Check for existing configuration

Look for `.github/orchestration.yml` in the workspace root.

**If it does NOT exist:**
- Inform the user no configuration file was found
- Create `.github/orchestration.yml` with the default content below
- Skip to Step 4 (scan for stale references using the default base_path `.github/projects`)

**Default `orchestration.yml` content to create:**

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
    critical:
      - "build_failure"
      - "security_vulnerability"
      - "architectural_violation"
      - "data_loss_risk"
    minor:
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
  branch_prefix: "orch/"
  commit_prefix: "[orch]"
  auto_commit: true

# ─── Human Gate Defaults ───────────────────────────────────────────
human_gates:
  after_planning: true
  execution_mode: "ask"                  # ask | phase | task | autonomous
  after_final_review: true

# ─── Notes ─────────────────────────────────────────────────────────
# Model selection is configured per-agent in .github/agents/*.agent.md
```

---

## Step 2: Read and display the current configuration

Read `.github/orchestration.yml` and display the current values in a clean table:

| Setting | Current Value |
|---------|---------------|
| `projects.base_path` | _(value)_ |
| `projects.naming` | _(value)_ |
| `limits.max_phases` | _(value)_ |
| `limits.max_tasks_per_phase` | _(value)_ |
| `limits.max_retries_per_task` | _(value)_ |
| `limits.max_consecutive_review_rejections` | _(value)_ |
| `errors.on_critical` | _(value)_ |
| `errors.on_minor` | _(value)_ |
| `git.strategy` | _(value)_ |
| `git.branch_prefix` | _(value)_ |
| `git.commit_prefix` | _(value)_ |
| `git.auto_commit` | _(value)_ |
| `human_gates.after_planning` | _(value)_ |
| `human_gates.execution_mode` | _(value)_ |
| `human_gates.after_final_review` | _(value)_ |

Note the **current `projects.base_path`** — you'll need it in Step 4 to find stale references.

---

## Step 3: Ask the user what to change

Ask the user:

> "Which settings would you like to change? You can specify one or more. Press Enter with no changes to keep the current configuration."

Wait for the user's response. If they specify changes:
- Validate allowed values for each field:
  - `projects.naming`: `SCREAMING_CASE` | `lowercase` | `numbered`
  - `errors.on_critical`: `halt` | `report_and_continue`
  - `errors.on_minor`: `retry` | `halt` | `skip`
  - `git.strategy`: `single_branch` | `branch_per_phase` | `branch_per_task`
  - `human_gates.execution_mode`: `ask` | `phase` | `task` | `autonomous`
  - `human_gates.after_planning` and `after_final_review`: always `true` (these are hard-coded safety gates — warn the user if they try to set these to `false`)
- Apply the changes to `.github/orchestration.yml`

If the user makes no changes, skip to Step 5.

---

## Step 4: Propagate `projects.base_path` changes (if it changed)

If the user changed `projects.base_path` (or this is a fresh setup where you need to confirm the current value is reflected), do the following:

**Old path** = the previous value of `projects.base_path` (before the change, or the default `.github/projects` if freshly created)
**New path** = the new value of `projects.base_path`

### 4a. Scan the entire `.github/` directory

Search every file under `.github/` for occurrences of the old path string. This includes:
- `.github/instructions/` — look for `applyTo` patterns containing the old path
- `.github/copilot-instructions.md` — look for any hardcoded path references
- `.github/agents/*.agent.md` — look for any hardcoded paths (there should be none; agents use `{base_path}`)
- `.github/skills/**/*.md` — look for any hardcoded paths
- `.github/prompts/**/*.md` — look for any hardcoded paths
- Any other files under `.github/`

Report every file that contains the old path string.

### 4b. Update all occurrences

For each file found in 4a, replace the old path with the new path. Key replacements:

**In `.github/instructions/project-docs.instructions.md`:**
```
applyTo: '<old_path>/**'
→
applyTo: '<new_path>/**'
```

**In `.github/copilot-instructions.md`** (if it contains the old path):
Update any hardcoded references to reflect the new path or ensure they reference `orchestration.yml` as the authority.

**In any other files**: Replace the old path string with the new path string.

---

## Step 5: Verify and report

After all updates are complete, report:

1. **Configuration saved**: Show the final `orchestration.yml` values that changed
2. **Files updated**: List every file that was modified and what changed (old → new)
3. **Files scanned with no changes needed**: List files that were checked but had no hardcoded references
4. **Action items**: Anything the user needs to do manually (e.g., if any existing project folders need to be moved to the new `base_path`)

If `projects.base_path` changed and existing project folders exist at the old path:
> ⚠️ **Manual step required**: Existing project folders at `<old_path>/` will not be moved automatically. Move them to `<new_path>/` to continue using existing projects.
