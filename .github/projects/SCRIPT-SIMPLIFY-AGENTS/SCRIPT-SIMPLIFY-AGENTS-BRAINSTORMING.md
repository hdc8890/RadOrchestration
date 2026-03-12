---
project: "SCRIPT-SIMPLIFY-AGENTS"
author: "brainstormer-agent"
created: "2026-03-10T00:00:00Z"
---

# SCRIPT-SIMPLIFY-AGENTS — Brainstorming

## Problem Space

The orchestration system's Tactical Planner agent violates the single responsibility principle. It currently owns both **planning work** (decomposing phases into tasks, writing handoffs, generating reports) and **state management** (mutating `state.json`, running triage, enforcing transitions). The state-management half is mechanical — an LLM re-deriving which JSON fields to change based on prose instructions — and produces incorrect mutations (premature completions, skipped steps, wrong field values). Meanwhile, the Orchestrator is too passive: it delegates all state control to the Tactical Planner, then tries to verify the result by re-reading state and re-running the resolver. This indirection causes skipped steps and inconsistent pipeline progression.

## Validated Ideas

### Idea 1: Unified Event-Driven Pipeline Script

**Description**: Replace the multi-script Orchestrator loop (`next-action.js` → spawn agent → spawn Tactical Planner for state update → `next-action.js` again) with a single `pipeline.js` script. The Orchestrator signals a completion event (e.g., `task_completed`, `code_review_completed`) with context (e.g., report path), and the script handles the entire mechanical chain internally: apply the state mutation, validate the transition, run triage if triggered, resolve the next action, and return a single JSON result telling the Orchestrator what to do next.

**Rationale**: Collapses multiple script calls and agent spawns into one deterministic call per cycle. The Orchestrator never needs to know about mutations, triage, or state transitions — it just signals events and follows instructions. This eliminates the class of bugs where the LLM-based Tactical Planner mutates state incorrectly, and removes intermediate actions (`update_state_from_task`, `triage_task`, `advance_task`, etc.) that the Orchestrator currently has to coordinate.

**Key considerations**:
- The script must be internally well-structured to avoid becoming a monolithic mess — pipeline engine, mutations module, state I/O module, all composed cleanly
- Existing modules (resolver, triage engine, state validator, constants) are reused as-is — they're already pure functions
- The `start` event (cold start, no prior event) replaces the standalone `next-action.js` for initial resolution
- Init (project scaffolding) can fold into the script as a special case when no `state.json` exists

### Idea 2: Strip State Management from the Tactical Planner

**Description**: Remove all state mutation responsibilities (Mode 2: Update State) and triage invocation from the Tactical Planner agent. The Planner becomes a pure planning agent with three focused modes: create phase plans (from Master Plan + Architecture + Design + prior reports/reviews), create task handoffs (from Phase Plan + Architecture + Design + prior reports/reviews), and generate phase reports (from task reports + code reviews). It reads `state.json` for context (current phase/task, triage outcomes already written) but never writes it.

**Rationale**: The Tactical Planner's judgment work — reading planning documents and synthesizing them into actionable plans — is exactly what an LLM excels at. The state mutation work — setting JSON fields to specific values in specific orders — is exactly what an LLM fails at. Separating these restores single responsibility: the Planner plans, the script manages state. The Planner also no longer needs to run triage before planning; it reads the triage outcome from state (already written by the pipeline script) and plans accordingly.

**Key considerations**:
- The Planner still reads `review_action` / `phase_review_action` from `state.json` to know whether to produce a normal handoff, corrective handoff, or halt — but it doesn't derive these values itself
- Mode 1 (project initialization) also moves to a script since it's purely mechanical (create directories, scaffold JSON template)
- The Planner's agent definition simplifies significantly — the `execute` tool may no longer be needed since it doesn't call scripts anymore

### Idea 3: Orchestrator as Thin Event-Driven Controller

**Description**: Rewrite the Orchestrator agent to follow a minimal loop: (1) call `pipeline.js` with an event and context, (2) parse the JSON result, (3) if the action requires an agent spawn → spawn it → signal completion event → go to 1, (4) if the action is a human gate → ask human → signal gate event → go to 1, (5) if terminal → done. The Orchestrator's action table shrinks from ~35 actions to ~18 (only actions requiring external work: agent spawns, human gates, display).

**Rationale**: The Orchestrator's current definition has a massive action→agent mapping table with many entries that are purely mechanical state operations. With the pipeline script handling those internally, the Orchestrator only sees actions that require it to interact with the outside world (agents and humans). This makes the agent definition shorter, less error-prone, and more resilient to context compaction — since routing is state-driven via the script, the Orchestrator can "recover" from compaction by just calling the script again.

**Key considerations**:
- The Orchestrator's tool access should be constrained to `read`, `search`, `agent`, and `execute` (for running orchestration scripts only — no arbitrary terminal commands)
- The `triage_attempts` runtime counter should move into the pipeline script as persisted state
- The Orchestrator remains "read-only" in the sense that it never writes files directly — it triggers state writes through the pipeline script via terminal execution

### Idea 4: Modular Script Architecture

**Description**: Structure the pipeline script as a composition of focused modules rather than a monolithic file. The entry point (`pipeline.js`) is trivial (~20 lines). The pipeline engine (`pipeline-engine.js`) is a linear recipe: load state → apply mutation → validate → write → triage if needed → resolve → return. Mutations live in a lookup table (`mutations.js`) with one small named function per event type. State I/O is isolated (`state-io.js`). Existing modules (resolver, triage engine, validator, constants) are unchanged and composed by the pipeline engine.

**Rationale**: The unified script concept risks becoming a complex monolith. This structure keeps each module focused and independently testable while the pipeline engine reads like plain English. A developer can find what `task_completed` does by looking up one 5-10 line function in `mutations.js`. Testing is clean: unit-test each mutation function, integration-test the pipeline engine with mocked I/O.

**Key considerations**:
- The `needsTriage(event, state)` helper determines whether triage runs after a mutation — keeps triage logic declarative rather than scattered through the pipeline
- `state-io.js` isolates all filesystem operations, making the pipeline engine testable with stubs
- The existing test suites for resolver, triage engine, and state validator continue to pass unchanged

### Idea 5: Project Initialization as Script

**Description**: Replace the Tactical Planner's Mode 1 (Initialize Project) with an `init-project.js` script (or fold it into `pipeline.js` as the `start` event handler when no `state.json` exists). The script creates the project directory, subdirectories (`phases/`, `tasks/`, `reports/`), scaffolds `state.json` from a template populated with `orchestration.yml` limits, and creates `STATUS.md`.

**Rationale**: Project initialization is entirely mechanical — no judgment required. The current approach has an LLM creating JSON from scratch, which risks malformed initial state. A script guarantees the initial `state.json` always matches the schema exactly.

**Key considerations**:
- The Brainstormer should NOT call this script — it operates outside the pipeline and only creates the project folder + `BRAINSTORMING.md`. The init script runs when `@Orchestrator` starts the pipeline, leaving any existing `BRAINSTORMING.md` untouched.
- The script should read `orchestration.yml` for limits, gate defaults, and other configuration to populate the initial state

### Idea 6: Comprehensive Documentation Update

**Description**: Once the architectural changes are implemented, the README and all supporting documentation (`docs/`) will need comprehensive updates — possibly full rewrites — to reflect the new system. This includes the agent definitions, pipeline description, script interfaces, and any diagrams or workflow descriptions that reference the old Tactical Planner / Orchestrator split.

**Rationale**: The current documentation describes a system that will no longer exist after this project. Leaving it stale creates confusion for anyone trying to understand or extend the orchestration system — including the agents themselves, which read the docs. The planning agents should assess the documentation state at the time of planning and determine the appropriate scope and depth of updates needed.

**Key considerations**:
- The scope and content of updates should be determined at planning time based on the actual state of the docs — no need to prescribe specifics now
- Documentation updates should be a dedicated phase or task set, not an afterthought appended to implementation tasks
- Both the user-facing docs (`docs/`, `README.md`) and the system-facing docs (agent definitions, instruction files, skill files) are in scope

## Scope Boundaries

### In Scope
- Unified event-driven pipeline script (`pipeline.js`) with modular internal architecture
- Removing state mutation and triage from the Tactical Planner agent
- Rewriting the Orchestrator agent to use the event-driven loop
- Project initialization as a script
- `STATUS.md` generation as a deterministic script (no longer agent-written)
- Pipeline script reads task report frontmatter directly (status, deviations, severity) — the Orchestrator just signals `task_completed` with the report path
- Adding `triage_attempts` as a persisted field in `state.json` (survives context compaction)
- Fully replacing standalone scripts (`next-action.js`, `triage.js`, `validate-state.js`) — no thin wrappers, no backward compatibility
- Updating the Tactical Planner agent definition to be a pure planning agent
- Reducing the Orchestrator's action vocabulary to external-only actions (~18)
- Preserving all existing pure logic modules (resolver, triage engine, state validator, constants)
- Comprehensive test suite for the new pipeline engine and mutations module
- Updating `state-management.instructions.md` to reflect new ownership model
- Comprehensive updates (or rewrites) of `README.md` and all supporting `docs/` documentation to reflect the new architecture
- Updates to system-facing docs: agent definitions, instruction files, and skill files affected by the changes

### Out of Scope
- Changes to the Coder, Reviewer, Research, Product Manager, UX Designer, Architect, or Brainstormer agents
- Changes to planning document formats (PRD, Design, Architecture, Master Plan templates)
- Changes to report/review document formats (task reports, code reviews, phase reports, phase reviews)
- Changes to the `state.json` schema beyond the `triage_attempts` addition — existing fields remain the same, only who writes them changes
- CI/CD integration or GitHub Actions
- npm dependencies — continue using Node.js built-ins only
- Git automation
- Dashboard/UI changes

## Key Constraints

- Zero external npm dependencies — Node.js built-ins only, consistent with existing codebase
- Existing test suites for resolver, triage engine, and state validator must continue to pass
- The `state.json` schema is unchanged except for one addition (`triage_attempts`) — this is a refactor of who writes it and how, not what it contains
- Scripts must run on Node.js 18+ (existing requirement)
- The Orchestrator must remain "read-only" in the sense of never directly writing files — state writes happen through the pipeline script via terminal execution
- The Tactical Planner must retain the `edit` tool for writing planning documents (phase plans, task handoffs, phase reports) but should lose all state mutation prose
- The pipeline script must be deterministic — same event + same state always produces the same result

## Resolved Questions

- **`triage_attempts` → persisted in `state.json`**. Move from a runtime-local counter in the Orchestrator to a field in `state.json` managed by the pipeline script. This survives context compaction and makes triage retry logic fully deterministic within the script.
- **`STATUS.md` → generated by script**. Move `STATUS.md` generation into a script. It's a deterministic derivation of `state.json` — no LLM judgment needed. Still useful as a human-readable summary for people who don't use the AI or want to share project status.
- **Task report reading → script handles it**. The pipeline script reads the task report frontmatter directly (status, deviations, severity) when handling `task_completed`. The Orchestrator just passes the report path as event context. This keeps the Orchestrator thin and avoids duplicating parsing logic.
- **Standalone scripts → fully replaced**. No thin wrappers, no backward compatibility. `next-action.js`, `triage.js`, and `validate-state.js` are replaced by the unified pipeline script. This is a new system — keeping dead entry points adds confusion, not value.

## Summary

This project refactors the orchestration system's control flow by introducing a unified event-driven pipeline script that handles all state mutations, triage, validation, next-action resolution, `STATUS.md` generation, and task report parsing in a single deterministic call. The Tactical Planner is stripped down to a pure planning agent (phase plans, task handoffs, phase reports) and the Orchestrator becomes a thin controller that signals events and spawns agents. Standalone scripts (`next-action.js`, `triage.js`, `validate-state.js`) are fully replaced — no wrappers. `triage_attempts` is persisted in `state.json` for compaction resilience. The result is a clear separation: scripts own mechanical state transitions, agents own judgment-requiring work. The project concludes with a comprehensive documentation overhaul — updating the README, docs, agent definitions, and instruction files to accurately describe the new system.
