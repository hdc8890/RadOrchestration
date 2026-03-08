---
name: create-phase-plan
description: 'Create a Phase Plan that breaks a project phase into concrete tasks with execution order, dependencies, and acceptance criteria. Use when planning phase execution, defining task breakdown, establishing task dependencies, or creating a phase-level execution plan. Produces a structured phase plan with task outlines, dependency graphs, execution order, and exit criteria.'
---

# Create Phase Plan

Generate a Phase Plan that breaks a phase from the Master Plan into concrete tasks with execution order, dependencies, and acceptance criteria. This is the Tactical Planner's operational document.

## When to Use This Skill

- At the start of each phase execution loop
- When the Orchestrator spawns the Tactical Planner to plan a phase
- When breaking a high-level phase outline into concrete, sequenced tasks

## Inputs Required

| Input | Source | Description |
|-------|--------|-------------|
| Master Plan | `{NAME}-MASTER-PLAN.md` | Phase scope, exit criteria, execution constraints |
| Architecture | `{NAME}-ARCHITECTURE.md` | Module map, contracts, file structure |
| Design | `{NAME}-DESIGN.md` | Components, design tokens (if applicable) |
| State | `state.json` | Current project state, limits |
| Previous Phase Report | `{NAME}-PHASE-REPORT-P{N-1}.md` | Carry-forward items (if not first phase) |

## Workflow

1. **Read inputs**: Load Master Plan (phase section), Architecture, Design, state.json
2. **Check limits**: Verify task count won't exceed `limits.max_tasks_per_phase` from state.json
3. **Define phase goal**: 1-2 sentences — what this phase delivers when complete
4. **Document inputs**: Record which documents and sections were consulted (audit trail)
5. **Break into tasks**: Each task should be achievable in a single agent session
6. **Map dependencies**: T1 → T2 means T1's output files/interfaces are inputs to T2
7. **Define execution order**: Show dependency graph AND sequential order; mark parallel-ready pairs
8. **Set exit criteria**: Mirror from Master Plan plus standard criteria (all tasks complete, build passes, tests pass)
9. **Note risks**: Phase-specific risks
10. **Write the Phase Plan**: Use the bundled template at [templates/PHASE-PLAN.md](./templates/PHASE-PLAN.md)
11. **Save**: Write to `{PROJECT-DIR}/phases/{NAME}-PHASE-{NN}-{TITLE}.md`

## Key Rules

- **Task details live in TASK-HANDOFF docs**: The Phase Plan has high-level task outlines only
- **Dependencies use task IDs**: T3 depends on T1 means T1's output files are inputs to T3
- **Handoff docs are created on a tight loop**: Not all at once — T1 handoff first, T2 handoff after T1 completes (can use T1's report)
- **Parallel-ready pairs are marked**: For future optimization, even though v1 executes sequentially

## Template

Use the bundled template: [PHASE-PLAN.md](./templates/PHASE-PLAN.md)
