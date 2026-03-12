# TASK-HANDOFF.md — Template Schema

> The most critical document in the system. This is the **sole input** a Coding Agent reads. It must be completely self-contained — no references to PRD, Design, or Architecture docs. Everything the agent needs is compiled into this document by the Tactical Planner.

---

## Design Principles

1. **Self-contained**: Agent reads ONLY this document. Zero external doc references.
2. **High signal-to-noise**: Every line must be actionable. No background, no rationale, no history.
3. **Deterministic**: Two different agents reading the same handoff should produce similar output.
4. **Verifiable**: Acceptance criteria are binary pass/fail. No subjective judgments.

---

## Template

```markdown
---
project: "{PROJECT-NAME}"
phase: {PHASE_NUMBER}
task: {TASK_NUMBER}
title: "{TASK-TITLE}"
status: "pending"
skills_required: ["{skill-1}", "{skill-2}"]
skills_optional: ["{skill-3}"]
estimated_files: {NUMBER}
---

# {TASK-TITLE}

## Objective

{1-3 sentences. What this task accomplishes. Written as a completion statement: "Create...", "Implement...", "Configure..."}

## Context

{Minimal context the agent needs. NOT project history — just the immediate technical context.}
{Example: "The auth module uses JWT tokens stored in HttpOnly cookies. The token refresh endpoint exists at /api/auth/refresh."}

## File Targets

| Action | Path | Notes |
|--------|------|-------|
| CREATE | `src/components/LoginForm.tsx` | New file |
| MODIFY | `src/routes/index.ts` | Add route for /login |
| MODIFY | `src/styles/auth.scss` | Add login form styles |

## Implementation Steps

1. {Step 1 — specific, actionable}
2. {Step 2 — specific, actionable}
3. {Step 3 — specific, actionable}

## Contracts & Interfaces

{Pre-defined interfaces, function signatures, API contracts, or component props this task must conform to. These come from the Architecture doc but are inlined here.}

```typescript
// Example: interface this component must implement
interface LoginFormProps {
  onSubmit: (credentials: Credentials) => Promise<void>;
  onForgotPassword: () => void;
}
```

## Styles & Design Tokens

{Specific design tokens, SCSS variables, component names from design system. NOT "see design doc" — the actual values.}

- Primary button: `$btn-primary` / `var(--color-primary)`
- Form spacing: `$spacing-md` (16px)
- Error state: `$color-error` / `var(--color-error)`

## Test Requirements

- [ ] {Test 1 — specific, verifiable}
- [ ] {Test 2 — specific, verifiable}
- [ ] {Test 3 — specific, verifiable}

## Acceptance Criteria

- [ ] {Criterion 1 — binary pass/fail}
- [ ] {Criterion 2 — binary pass/fail}
- [ ] {Criterion 3 — binary pass/fail}
- [ ] All tests pass
- [ ] Build succeeds
- [ ] No lint errors

## Constraints

- {Constraint 1 — e.g., "Do NOT modify the auth middleware"}
- {Constraint 2 — e.g., "Use existing Button component from design system"}
- {Constraint 3 — e.g., "Max 200 lines per file"}
```

---

## Field Definitions

### Frontmatter

| Field | Required | Description |
|-------|----------|-------------|
| `project` | Yes | Project name, matches folder name |
| `phase` | Yes | Phase number (integer) |
| `task` | Yes | Task number within phase (integer) |
| `title` | Yes | Human-readable task title |
| `status` | Yes | `pending` when created; Planner updates to `assigned` when handed to agent |
| `skills_required` | Yes | Skills the agent MUST have loaded for this task |
| `skills_optional` | No | Skills that improve quality but aren't required |
| `estimated_files` | No | Approximate number of files to create/modify (helps scope expectations) |

### Sections

| Section | Required | Max Length | Purpose |
|---------|----------|-----------|---------|
| Objective | Yes | 3 sentences | What the task achieves |
| Context | Yes | 5 sentences | Immediate technical context needed |
| File Targets | Yes | — | Exact files to create/modify with action type |
| Implementation Steps | Yes | 10 steps | Ordered steps, actionable and specific |
| Contracts & Interfaces | Conditional | — | Required if task involves interfaces/APIs/contracts |
| Styles & Design Tokens | Conditional | — | Required if task involves UI work |
| Test Requirements | Yes | — | Specific tests to write |
| Acceptance Criteria | Yes | — | Binary pass/fail checklist |
| Constraints | No | — | Explicit boundaries (what NOT to do) |

---

## Anti-Patterns (What NOT to Include)

- ❌ "See the Architecture doc for details" — inline it
- ❌ "Follow the project's coding standards" — the agent has skills for that
- ❌ Background on why the feature exists — irrelevant to execution
- ❌ Alternative approaches considered — decision is made
- ❌ References to other tasks — each task is independent
- ❌ Subjective criteria ("make it look good") — must be verifiable

---

## Quality Checklist (for Tactical Planner)

Before producing a task handoff, verify:

- [ ] Can an agent complete this task reading ONLY this document?
- [ ] Are all file paths concrete (no placeholders like "appropriate directory")?
- [ ] Are all interfaces/contracts fully defined (not "TBD")?
- [ ] Is every acceptance criterion binary (yes/no, pass/fail)?
- [ ] Are there zero references to external planning documents?
- [ ] Are design tokens actual values, not "see design system"?
- [ ] Is the task scope achievable in a single agent session?
