# TASK-REPORT.md — Template Schema

> The output contract of every Coding Agent task. Read by the Tactical Planner (to update state and plan next tasks) and the Reviewer (to validate against acceptance criteria). Must be factual, structured, and machine-parseable where possible.

---

## Design Principles

1. **Factual**: Report what happened, not what was intended. No aspirational language.
2. **Structured**: Planner and Reviewer parse this programmatically. Consistent sections.
3. **Diff-aware**: Clearly state what files were created/modified/deleted.
4. **Error-transparent**: If something failed or was skipped, say so explicitly with reasons.

---

## Template

```markdown
---
project: "{PROJECT-NAME}"
phase: {PHASE_NUMBER}
task: {TASK_NUMBER}
title: "{TASK-TITLE}"
status: "complete|partial|failed"
files_changed: {NUMBER}
tests_written: {NUMBER}
tests_passing: {NUMBER}
build_status: "pass|fail"
---

# Task Report: {TASK-TITLE}

## Summary

{2-3 sentences. What was accomplished. Factual, past tense.}

## Files Changed

| Action | Path | Lines | Notes |
|--------|------|-------|-------|
| CREATED | `src/components/LoginForm.tsx` | 87 | New component |
| MODIFIED | `src/routes/index.ts` | +5 | Added /login route |
| MODIFIED | `src/styles/auth.scss` | +42 | Login form styles |

## Implementation Notes

{Brief notes on implementation decisions. Only include if the agent deviated from the handoff or made a non-obvious choice. Otherwise omit this section.}

## Tests

| Test | File | Status |
|------|------|--------|
| LoginForm renders without errors | `tests/LoginForm.test.tsx` | ✅ Pass |
| Submit calls onSubmit with credentials | `tests/LoginForm.test.tsx` | ✅ Pass |
| Shows validation error on empty email | `tests/LoginForm.test.tsx` | ❌ Fail |

**Test summary**: {X}/{Y} passing

## Acceptance Criteria Results

| # | Criterion | Result |
|---|-----------|--------|
| 1 | LoginForm component exists at specified path | ✅ Met |
| 2 | Form submits credentials via onSubmit prop | ✅ Met |
| 3 | Validation errors display inline | ⚠️ Partial |
| 4 | All tests pass | ❌ Not Met |
| 5 | Build succeeds | ✅ Met |
| 6 | No lint errors | ✅ Met |

## Build & Lint

- **Build**: ✅ Pass | ❌ Fail
- **Lint**: ✅ Pass | ❌ Fail — {error count if fail}
- **Type check**: ✅ Pass | ❌ Fail — {error count if fail}

## Issues Encountered

{Only if issues occurred. Otherwise omit entire section.}

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | Test assertion failure in validation test | minor | Expected error message format differs from component output |

## Deviations from Handoff

{Only if the agent deviated from the handoff instructions. Otherwise omit.}

| # | Handoff Said | Agent Did | Reason |
|---|-------------|-----------|--------|
| 1 | Use `FormInput` component | Used native `<input>` | `FormInput` not found in design system |

## Recommendations for Next Task

{Optional. Only if the agent identified something the Planner should know for subsequent task planning.}

- {Recommendation 1}
```

---

## Field Definitions

### Frontmatter

| Field | Required | Description |
|-------|----------|-------------|
| `project` | Yes | Project name |
| `phase` | Yes | Phase number |
| `task` | Yes | Task number |
| `title` | Yes | Task title (matches handoff) |
| `status` | Yes | `complete` (all criteria met), `partial` (some met), `failed` (blocking issues) |
| `files_changed` | Yes | Total files created + modified |
| `tests_written` | Yes | Number of test cases written |
| `tests_passing` | Yes | Number of tests currently passing |
| `build_status` | Yes | `pass` or `fail` |

### Sections

| Section | Required | Purpose |
|---------|----------|---------|
| Summary | Yes | Quick overview for Planner |
| Files Changed | Yes | Exact diff inventory |
| Implementation Notes | Conditional | Only if deviations or non-obvious decisions |
| Tests | Yes | Per-test results table |
| Acceptance Criteria Results | Yes | Mirror of handoff criteria with results |
| Build & Lint | Yes | Build toolchain results |
| Issues Encountered | Conditional | Only if issues |
| Deviations from Handoff | Conditional | Only if deviations |
| Recommendations | Optional | Forward-looking info for Planner |

---

## Status Classification

The `status` frontmatter field is the Planner's primary input for state updates:

| Status | Meaning | Planner Action |
|--------|---------|----------------|
| `complete` | All acceptance criteria met, tests pass, build passes | Mark task complete, advance |
| `partial` | Some criteria met, minor issues remain | Check severity → auto-retry or escalate |
| `failed` | Blocking issues, build broken, critical errors | Check severity → halt or corrective task |

---

## Severity Mapping (for Issues)

The Planner reads the Issues table and maps to orchestration.yml severity:

| Report Severity | Maps To | Planner Response |
|-----------------|---------|------------------|
| `minor` | `errors.severity.minor` | Generate corrective task (up to max retries) |
| `critical` | `errors.severity.critical` | Halt pipeline, update STATUS.md |

---

## Quality Checklist (for Coding Agent)

Before producing a task report, verify:

- [ ] Every file in the handoff's File Targets is accounted for in Files Changed
- [ ] Every acceptance criterion from the handoff has a result row
- [ ] Test results are actual (ran the tests), not assumed
- [ ] Build status is actual (ran the build), not assumed
- [ ] If status is not `complete`, Issues Encountered section exists with details
- [ ] No subjective language — only facts and measurements
