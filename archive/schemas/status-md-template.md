# STATUS.md — Template Schema

> Human-readable project state. Written solely by the Tactical Planner. Designed for at-a-glance understanding of where the project stands.

---

## Template

```markdown
# {PROJECT-NAME} — Status

> **Pipeline**: {planning|execution|review|complete|halted}  
> **Phase**: {N}/{Total} — {Phase Title}  
> **Task**: {N}/{Total} — {Task Title}  
> **Updated**: {ISO timestamp}

---

## Current Activity

{1-2 sentences describing what is happening RIGHT NOW or what is waiting.}

## Planning

| Step | Status | Output |
|------|--------|--------|
| Research | ✅ Complete | [Research Findings]({path}) |
| PRD | ✅ Complete | [PRD]({path}) |
| Design | ✅ Complete | [Design]({path}) |
| Architecture | ✅ Complete | [Architecture]({path}) |
| Master Plan | ✅ Complete | [Master Plan]({path}) |
| Human Approval | ✅ Approved | — |

## Execution Progress

### Phase {N}: {Title}

| Task | Status | Report |
|------|--------|--------|
| T1: {Title} | ✅ Complete | [Report]({path}) |
| T2: {Title} | 🔄 In Progress | — |
| T3: {Title} | ⬜ Pending | — |

### Phase Summary

| Phase | Status | Tasks | Report |
|-------|--------|-------|--------|
| P1: {Title} | ✅ Complete | 4/4 | [Report]({path}) |
| P2: {Title} | 🔄 In Progress | 1/3 | — |

## Blockers

{Only present if there are active blockers. Otherwise omit.}

- ❌ **{Blocker title}**: {Description}. Severity: `critical`. Waiting for: human intervention.

## Error Log

| Time | Phase | Task | Severity | Description | Resolution |
|------|-------|------|----------|-------------|------------|
| {timestamp} | P1 | T2 | minor | Test failure in auth module | Auto-retried, resolved in T2-retry |

## Gate History

| Gate | Decision | Time |
|------|----------|------|
| Post-Planning | ✅ Approved | {timestamp} |
| Post-Phase-1 | ✅ Approved | {timestamp} |
```

---

## Design Notes

- Status icons are intentional: ✅ ⬜ 🔄 ❌ ⚠️ — scannable at a glance
- The "Current Activity" section answers "what's happening?" in 2 seconds
- Error Log is append-only — never remove entries
- Gate History provides audit trail of human decisions
- Links to actual documents for drill-down
