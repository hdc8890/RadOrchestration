# RESEARCH-FINDINGS.md — Template Schema

> Created by the Research Agent. Captures codebase analysis, relevant documentation, and technical context that feeds into PRD and Architecture.

---

## Template

```markdown
---
project: "{PROJECT-NAME}"
author: "research-agent"
created: "{ISO-DATE}"
---

# {PROJECT-NAME} — Research Findings

## Research Scope

{1-2 sentences. What was investigated and why.}

## Codebase Analysis

### Relevant Existing Code

| File/Module | Path | Relevance |
|-------------|------|-----------|
| {Module} | `{path}` | {Why it matters to this project} |

### Existing Patterns

{Patterns, conventions, and approaches already used in the codebase that this project should follow.}

- **{Pattern}**: {Description and where it's used}

### Technology Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| {Layer} | {Tech} | {Version} | {Relevant notes} |

## External Research

{Relevant findings from documentation, APIs, or other sources. Only if applicable.}

| Source | Key Finding |
|--------|-------------|
| {Source} | {Finding} |

## Constraints Discovered

- {Constraint 1 — e.g., "Auth module uses a custom token format, not standard JWT"}
- {Constraint 2}

## Recommendations

- {Recommendation 1}
```

---

## Section Rules

- **Concrete file paths**: Always point to actual files, not vague "the auth module."
- **Patterns over opinions**: Report what IS, not what should be. PM and Architect decide.
- **Concise**: This feeds into other agents. No narrative. Tables and bullets.
