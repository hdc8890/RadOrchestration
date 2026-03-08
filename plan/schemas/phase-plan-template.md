# PHASE-PLAN.md — Template Schema

> Created by the Tactical Planner at the start of each phase loop. Breaks a phase into concrete tasks with execution order, dependencies, and acceptance criteria. This is the Planner's operational document.

---

## Template

```markdown
---
project: "{PROJECT-NAME}"
phase: {PHASE_NUMBER}
title: "{PHASE-TITLE}"
status: "active|complete|halted"
total_tasks: {NUMBER}
author: "tactical-planner-agent"
created: "{ISO-DATE}"
---

# Phase {N}: {PHASE-TITLE}

## Phase Goal

{1-2 sentences. What this phase delivers when complete.}

## Inputs

| Source | Key Information Used |
|--------|---------------------|
| [Master Plan]({path}) | Phase {N} scope and exit criteria |
| [Architecture]({path}) | {Specific sections referenced} |
| [Design]({path}) | {Specific sections referenced, if applicable} |
| [Previous Phase Report]({path}) | {What carried forward, if applicable} |

## Task Outline

| # | Task | Dependencies | Skills Required | Est. Files | Handoff Doc |
|---|------|-------------|-----------------|-----------|-------------|
| T1 | {Title} | — | `{skill}` | {N} | [Link]({path}) |
| T2 | {Title} | T1 | `{skill}` | {N} | [Link]({path}) |
| T3 | {Title} | T1 | `{skill}` | {N} | [Link]({path}) |
| T4 | {Title} | T2, T3 | `{skill}` | {N} | [Link]({path}) |

## Execution Order

```
T1 (foundation)
 ├→ T2 (depends on T1)
 └→ T3 (depends on T1)  ← parallel-ready
T4 (depends on T2, T3)
```

**Sequential execution order**: T1 → T2 → T3 → T4

*Note: T2 and T3 are parallel-ready (no mutual dependency) but will execute sequentially in v1.*

## Phase Exit Criteria

- [ ] {Criterion 1 — from Master Plan}
- [ ] {Criterion 2}
- [ ] All tasks complete with status `complete`
- [ ] Phase review passed
- [ ] Build passes
- [ ] All tests pass

## Known Risks for This Phase

- {Risk 1}
```

---

## Section Rules

- **Inputs**: Explicit about which documents and sections the Planner consulted. Audit trail.
- **Task Outline**: High-level only. Task details live in TASK-HANDOFF documents.
- **Execution Order**: Shows dependency graph AND the actual sequential order. Marks parallel-ready pairs for future optimization.
- **Dependencies**: Task IDs only. If T3 depends on T1, it means T1's output (files, interfaces) are inputs to T3.
- **Handoff docs are created on a tight loop**: Not all at once. T1 handoff is created first. T2 handoff is created after T1 completes (can use T1's report).
