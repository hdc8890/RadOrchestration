# ARCHITECTURE.md — Template Schema

> Technical architecture document. Created by the Architect Agent from PRD + Design. Defines HOW the system will be built — modules, contracts, dependencies, file structure. High-level enough to guide multiple agents working in parallel, specific enough to define contracts.

---

## Template

```markdown
---
project: "{PROJECT-NAME}"
status: "draft|review|approved"
author: "architect-agent"
created: "{ISO-DATE}"
---

# {PROJECT-NAME} — Architecture

## Technical Overview

{2-4 sentences. High-level approach. Technology choices and why.}

## System Layers

```
┌─────────────────────────┐
│     Presentation        │  Components, pages, routing
├─────────────────────────┤
│     Application         │  Services, state management, hooks
├─────────────────────────┤
│     Domain              │  Models, types, validation, business logic
├─────────────────────────┤
│     Infrastructure      │  API clients, storage, auth, external services
└─────────────────────────┘
```

## Module Map

| Module | Layer | Path | Responsibility |
|--------|-------|------|---------------|
| `auth` | Domain | `src/domain/auth/` | Auth types, validation, token logic |
| `auth-ui` | Presentation | `src/components/auth/` | Login, register, forgot password |
| `auth-api` | Infrastructure | `src/api/auth/` | Auth API client |
| `auth-service` | Application | `src/services/auth/` | Auth orchestration, state |

## Contracts & Interfaces

### {Module Name} Interfaces

```typescript
// src/domain/auth/types.ts
interface Credentials {
  email: string;
  password: string;
}

interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface AuthService {
  login(credentials: Credentials): Promise<AuthToken>;
  logout(): Promise<void>;
  refresh(): Promise<AuthToken>;
  isAuthenticated(): boolean;
}
```

## API Endpoints

| Method | Path | Request | Response | Auth |
|--------|------|---------|----------|------|
| POST | `/api/auth/login` | `Credentials` | `AuthToken` | None |
| POST | `/api/auth/logout` | — | `void` | Required |
| POST | `/api/auth/refresh` | `{ refreshToken }` | `AuthToken` | None |

## Dependencies

### External Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | `^18` | UI framework |
| `react-router` | `^6` | Routing |

### Internal Dependencies (module → module)

```
auth-ui → auth-service → auth-api
                       → auth (domain)
```

## File Structure

```
src/
├── domain/auth/
│   ├── types.ts              # Credentials, AuthToken, AuthService interface
│   └── validation.ts         # Email/password validation rules
├── api/auth/
│   └── auth-client.ts        # HTTP client for auth endpoints
├── services/auth/
│   ├── auth-service.ts       # AuthService implementation
│   └── auth-store.ts         # Auth state management
├── components/auth/
│   ├── LoginForm.tsx          # Login form component
│   ├── LoginForm.test.tsx     # Login form tests
│   └── index.ts               # Public exports
└── routes/
    └── auth-routes.ts         # /login, /register, /forgot-password
```

## Cross-Cutting Concerns

| Concern | Strategy |
|---------|----------|
| Error handling | {Approach} |
| Logging | {Approach} |
| Authentication | {Approach} |
| State management | {Approach} |

## Phasing Recommendations

{High-level suggestion for how this should be phased. The Tactical Planner will make final phasing decisions.}

1. **Phase 1**: {Foundation — domain types, API client}
2. **Phase 2**: {Core — service layer, state management}
3. **Phase 3**: {UI — components, routing, styling}
4. **Phase 4**: {Polish — error handling, edge cases, tests}
```

---

## Section Rules

- **Contracts & Interfaces**: The most critical section. These are the EXACT interfaces that parallel agents must conform to. TypeScript/language-specific syntax required.
- **Module Map**: Every module with its layer, path, and responsibility. No orphan code.
- **File Structure**: Concrete paths. Not "somewhere in src/" — exact locations.
- **Phasing Recommendations**: Advisory only. The Tactical Planner makes final decisions.
- **No implementation logic**: Interfaces yes, method bodies no. `login(): Promise<AuthToken>` yes, the actual HTTP call no.
