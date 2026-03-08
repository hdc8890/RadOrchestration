# DESIGN.md — Template Schema

> User experience design document. Created by the UX Designer Agent from the PRD. Defines the visual and interaction design using the project's design system.

---

## Template

```markdown
---
project: "{PROJECT-NAME}"
status: "draft|review|approved"
author: "ux-designer-agent"
created: "{ISO-DATE}"
---

# {PROJECT-NAME} — Design

## Design Overview

{2-3 sentences. What is the user experience being designed? What's the interaction model?}

## User Flows

### {Flow Name}

```
{Step 1} → {Step 2} → {Step 3} → {Outcome}
```

{Brief description of the flow.}

## Layout & Components

### {View/Page Name}

**Breakpoints**: Desktop (≥1024px) | Tablet (≥768px) | Mobile (<768px)

| Region | Component | Design Token / Class | Notes |
|--------|-----------|---------------------|-------|
| Header | `AppHeader` | — | Existing component |
| Main | `LoginForm` | — | NEW — needs creation |
| Footer | `AppFooter` | — | Existing component |

### New Components

| Component | Props | Design Tokens | Description |
|-----------|-------|--------------|-------------|
| `LoginForm` | `onSubmit`, `onForgotPassword` | `$spacing-md`, `$color-primary` | Email/password form with validation |

## Design Tokens Used

| Token | Value | Usage |
|-------|-------|-------|
| `$color-primary` | `#0066CC` | Primary buttons, links |
| `$spacing-md` | `16px` | Form element spacing |
| `$font-size-body` | `14px` | Input text |
| `$color-error` | `#CC0000` | Validation error messages |

## States & Interactions

| Component | State | Visual Treatment |
|-----------|-------|-----------------|
| `LoginForm` | Default | Neutral borders, primary CTA |
| `LoginForm` | Validation Error | Red border on field, error message below |
| `LoginForm` | Loading | Disabled inputs, spinner on button |
| `LoginForm` | Success | Redirect (no visual state) |

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Keyboard navigation | Tab order: email → password → forgot link → submit |
| Screen reader | ARIA labels on all inputs, live region for errors |
| Color contrast | All text meets WCAG AA (4.5:1 minimum) |
| Focus indicators | Visible focus ring on all interactive elements |

## Responsive Behavior

| Breakpoint | Layout Change |
|-----------|--------------|
| Desktop (≥1024px) | Centered card, max-width 400px |
| Tablet (≥768px) | Same as desktop |
| Mobile (<768px) | Full-width, reduced padding |

## Design System Additions

{Only if new tokens or components need to be added to the design system. Otherwise omit.}

| Type | Name | Value | Rationale |
|------|------|-------|-----------|
| Token | `$form-error-bg` | `#FFF0F0` | Error state background not in current system |
```

---

## Section Rules

- **Design Tokens Used**: Must reference ACTUAL tokens from the design system. No inventing tokens without listing them in Design System Additions.
- **New Components**: Full props definition. This feeds directly into Architecture and Task Handoffs.
- **Accessibility**: WCAG AA minimum. Every interactive element addressed.
- **No code**: Component names and props only. Implementation lives in tasks.
