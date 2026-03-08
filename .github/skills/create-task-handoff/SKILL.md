---
name: create-task-handoff
description: 'Create a self-contained Task Handoff document for a Coding Agent. Use when creating task handoffs, preparing coding tasks, defining implementation steps, specifying file targets, or generating task assignments with contracts, interfaces, test requirements, and acceptance criteria. The handoff is the SOLE input the Coder reads — it must be completely self-contained with no external document references.'
---

# Create Task Handoff

Generate a self-contained Task Handoff document that is the sole input a Coding Agent reads. Everything the coder needs — objective, context, file targets, implementation steps, contracts, design tokens, tests, acceptance criteria — must be compiled into this single document.

## When to Use This Skill

- After a Phase Plan defines the task outline and you need to create individual task handoffs
- When the Orchestrator spawns the Tactical Planner to prepare a task for the Coder
- When creating a corrective task after a review finds issues

## Inputs Required

| Input | Source | Description |
|-------|--------|-------------|
| Phase Plan | `{NAME}-PHASE-{NN}-{TITLE}.md` | Task outline, dependencies, execution order |
| Architecture | `{NAME}-ARCHITECTURE.md` | Contracts, interfaces, file structure |
| Design | `{NAME}-DESIGN.md` | Design tokens, component specs (if UI task) |
| Previous Task Report | `{NAME}-TASK-REPORT-P{NN}-T{NN}.md` | Output from prior task (if dependency exists) |

## Workflow

1. **Read inputs**: Load Phase Plan, Architecture, Design (if relevant), and any prior task reports
2. **Write objective**: 1-3 sentences as a completion statement ("Create...", "Implement...", "Configure...")
3. **Write context**: Minimal immediate technical context (max 5 sentences) — NOT project history
4. **Define file targets**: Exact file paths with CREATE/MODIFY action types
5. **Write implementation steps**: Specific, actionable, ordered steps (max 10)
6. **Inline contracts**: Copy the exact interfaces/contracts from Architecture — do NOT reference the Architecture doc
7. **Inline design tokens**: Copy the actual token values from Design — do NOT say "see design doc"
8. **Define test requirements**: Specific, verifiable test cases
9. **Define acceptance criteria**: Binary pass/fail checklist
10. **Add constraints**: Explicit boundaries (what NOT to do)
11. **Write the Task Handoff**: Use the bundled template at [templates/TASK-HANDOFF.md](./templates/TASK-HANDOFF.md)
12. **Save**: Write to `{PROJECT-DIR}/tasks/{NAME}-TASK-P{NN}-T{NN}-{TITLE}.md`

## Key Rules

- **Self-contained**: The Coder reads ONLY this document — zero external doc references
- **High signal-to-noise**: Every line must be actionable — no background, no rationale, no history
- **Deterministic**: Two different agents reading the same handoff should produce similar output
- **Verifiable**: All acceptance criteria are binary pass/fail — no subjective judgments
- **Inline everything**: Contracts, design tokens, and styles are copied in — never "see Architecture doc"

## Quality Checklist

Before producing a task handoff, verify:

- [ ] Can an agent complete this task reading ONLY this document?
- [ ] Are all file paths concrete (no placeholders like "appropriate directory")?
- [ ] Are all interfaces/contracts fully defined (not "TBD")?
- [ ] Is every acceptance criterion binary (yes/no, pass/fail)?
- [ ] Are there zero references to external planning documents?
- [ ] Are design tokens actual values, not "see design system"?
- [ ] Is the task scope achievable in a single agent session?

## Template

Use the bundled template: [TASK-HANDOFF.md](./templates/TASK-HANDOFF.md)
