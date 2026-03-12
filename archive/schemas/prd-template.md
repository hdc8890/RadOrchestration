# PRD.md — Template Schema

> Product Requirements Document. Created by the Product Manager Agent from Research findings. Defines WHAT needs to be built and WHY, not HOW.

---

## Template

```markdown
---
project: "{PROJECT-NAME}"
status: "draft|review|approved"
author: "product-manager-agent"
created: "{ISO-DATE}"
---

# {PROJECT-NAME} — Product Requirements

## Problem Statement

{2-4 sentences. What problem exists? Who is affected? Why does it matter?}

## Goals

- {Goal 1 — measurable outcome}
- {Goal 2 — measurable outcome}

## Non-Goals

- {Explicitly out of scope item 1}
- {Explicitly out of scope item 2}

## User Stories

| # | As a... | I want to... | So that... | Priority |
|---|---------|-------------|-----------|----------|
| 1 | {role} | {action} | {benefit} | P0/P1/P2 |

## Functional Requirements

| # | Requirement | Priority | Notes |
|---|------------|----------|-------|
| FR-1 | {Requirement} | P0 | — |

## Non-Functional Requirements

| # | Category | Requirement |
|---|----------|------------|
| NFR-1 | Performance | {Requirement} |
| NFR-2 | Accessibility | {Requirement} |
| NFR-3 | Security | {Requirement} |

## Assumptions

- {Assumption 1}

## Risks

| # | Risk | Impact | Mitigation |
|---|------|--------|-----------|
| 1 | {Risk} | High/Med/Low | {Mitigation} |

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| {Metric} | {Target} | {How measured} |
```

---

## Section Rules

- **Problem Statement**: Max 4 sentences. If you can't state the problem concisely, it's not well understood.
- **Goals / Non-Goals**: Non-goals are as important as goals. They prevent scope creep.
- **User Stories**: Standard format. Priority is P0 (must have), P1 (should have), P2 (nice to have).
- **Functional Requirements**: Numbered for cross-referencing from Architecture and Task Handoffs.
- **Non-Functional Requirements**: Cover performance, accessibility, security, reliability at minimum.
- **No implementation details**: Zero code, zero file paths, zero technology choices. That's Architecture's job.
