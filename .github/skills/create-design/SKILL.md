---
name: create-design
description: 'Create a UX Design document from a Product Requirements Document (PRD). Use when designing user interfaces, user flows, component layouts, interaction states, accessibility requirements, responsive behavior, or specifying design tokens and design system usage. Produces a structured design doc with user flows, layout specifications, component definitions, states, and accessibility requirements.'
---

# Create Design

Generate a UX Design document from the PRD. The Design defines the visual and interaction design — component structure, user flows, states, design tokens, and accessibility.

## When to Use This Skill

- After the PRD is complete and you need to define the user experience
- When the Orchestrator spawns the UX Designer Agent to create a Design document
- When specifying component layouts, interaction states, and responsive behavior

## Inputs Required

| Input | Source | Description |
|-------|--------|-------------|
| PRD | `{NAME}-PRD.md` | Product requirements, user stories, functional requirements |
| Research Findings | `RESEARCH-FINDINGS.md` | Existing patterns, technology stack, codebase analysis |

## Workflow

1. **Read inputs**: Load the PRD and Research Findings
2. **Design overview**: Summarize the user experience being designed (2-3 sentences)
3. **Map user flows**: Create step-by-step flows for each key user story
4. **Define layouts**: Specify view/page layouts with regions, components, and breakpoints
5. **Define new components**: Full props, design tokens, and descriptions for any new components
6. **Document design tokens**: Reference actual tokens from the design system
7. **Specify states & interactions**: Every component state with visual treatment
8. **Define accessibility**: Keyboard navigation, screen reader support, color contrast, focus indicators
9. **Specify responsive behavior**: Layout changes per breakpoint
10. **Write the Design doc**: Use the bundled template at [templates/DESIGN.md](./templates/DESIGN.md)
11. **Save**: Write to `{PROJECT-DIR}/{NAME}-DESIGN.md`

## Key Rules

- **Design tokens must be real**: Reference actual tokens from the design system; list new ones in Design System Additions
- **New components need full props**: Component name, props, design tokens, description — feeds into Architecture
- **Accessibility is mandatory**: WCAG AA minimum; every interactive element must be addressed
- **No code**: Component names and props only — implementation lives in tasks

## Template

Use the bundled template: [DESIGN.md](./templates/DESIGN.md)
