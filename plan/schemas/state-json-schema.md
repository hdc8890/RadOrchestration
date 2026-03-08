# state.json — Schema Definition

> This document defines the schema for `state.json`, the machine-parseable state file that the Orchestrator reads and the Tactical Planner writes.

---

## Purpose

Provides the Orchestrator with a structured, deterministic view of project state. This is the **primary decision-making input** for the Orchestrator — it reads state.json to determine what to do next.

Only the **Tactical Planner** writes to this file. All other agents produce documents (reports, reviews) that the Planner reads and uses to update state.

---

## Schema

```json
{
  "$schema": "orchestration-state-v1",
  "project": {
    "name": "PROJECT-NAME",
    "created": "2025-03-07T10:00:00Z",
    "updated": "2025-03-07T14:30:00Z"
  },
  "pipeline": {
    "current_tier": "planning|execution|review|complete|halted",
    "human_gate_mode": "ask|phase|task|autonomous"
  },
  "planning": {
    "status": "not_started|in_progress|complete",
    "steps": {
      "research":     { "status": "not_started|in_progress|complete|failed", "output": null },
      "prd":          { "status": "not_started|in_progress|complete|failed", "output": null },
      "design":       { "status": "not_started|in_progress|complete|failed|skipped", "output": null },
      "architecture": { "status": "not_started|in_progress|complete|failed", "output": null },
      "master_plan":  { "status": "not_started|in_progress|complete|failed", "output": null }
    },
    "human_approved": false
  },
  "execution": {
    "status": "not_started|in_progress|complete|halted",
    "current_phase": 0,
    "total_phases": 0,
    "phases": [
      {
        "phase_number": 1,
        "title": "Phase Title",
        "status": "not_started|in_progress|complete|failed|halted",
        "phase_doc": "phases/PROJECT-PHASE-01-TITLE.md",
        "current_task": 0,
        "total_tasks": 0,
        "tasks": [
          {
            "task_number": 1,
            "title": "Task Title",
            "status": "not_started|in_progress|complete|failed|halted",
            "handoff_doc": "tasks/PROJECT-TASK-P01-T01-TITLE.md",
            "report_doc": null,
            "retries": 0,
            "last_error": null,
            "severity": null
          }
        ],
        "phase_report": null,
        "human_approved": false
      }
    ]
  },
  "final_review": {
    "status": "not_started|in_progress|complete|failed",
    "report_doc": null,
    "human_approved": false
  },
  "errors": {
    "total_retries": 0,
    "total_halts": 0,
    "active_blockers": []
  },
  "limits": {
    "max_phases": 10,
    "max_tasks_per_phase": 8,
    "max_retries_per_task": 2
  }
}
```

---

## Field Reference

### `project`
Basic metadata. `updated` is refreshed every time Planner writes state.

### `pipeline.current_tier`
The Orchestrator's primary decision point:
- `planning` → spawn next planning agent
- `execution` → spawn Planner or Coder based on task/phase state
- `review` → spawn Reviewer for final review
- `complete` → pipeline done, no more actions
- `halted` → critical error, waiting for human

### `pipeline.human_gate_mode`
Set at execution start based on human's answer to the Orchestrator's question. Determines gate behavior throughout execution.

### `planning.steps.*`
Each planning step tracks:
- `status`: Current step state
- `output`: Relative path to the output document (null if not yet produced)

### `execution.phases[].tasks[]`
Each task tracks:
- `status`: Task lifecycle state
- `handoff_doc`: Path to the task handoff document
- `report_doc`: Path to the task report (null until completed)
- `retries`: Number of retry attempts so far
- `last_error`: Description of the most recent error (null if none)
- `severity`: `minor|critical|null` — classification of the most recent error

### `errors`
Aggregate error tracking:
- `total_retries`: Sum of all retries across all tasks
- `total_halts`: Number of times the pipeline halted
- `active_blockers`: List of strings describing current blocking issues

### `limits`
Copied from `orchestration.yml` at project init. Stored here so the Orchestrator doesn't need to read the config file separately.

---

## State Transitions

### Orchestrator Decision Logic (pseudocode)

```
read state.json

if pipeline.current_tier == "halted":
  → display STATUS.md to human, wait

if pipeline.current_tier == "planning":
  → find first planning step with status != "complete"
  → spawn corresponding agent
  → if all steps complete AND human_approved:
      → set current_tier = "execution"

if pipeline.current_tier == "execution":
  phase = phases[current_phase]
  
  if phase is null or all phases complete:
    → set current_tier = "review"
  
  if phase.status == "not_started":
    → spawn Tactical Planner to create phase doc
  
  if phase.current_task < phase.total_tasks:
    task = phase.tasks[current_task]
    
    if task.status == "not_started":
      → spawn Tactical Planner to create task handoff (if not exists)
      → spawn Coder to execute task
    
    if task.status == "failed" AND task.retries < max_retries AND severity == "minor":
      → spawn Tactical Planner to create corrective task
    
    if task.status == "failed" AND (retries >= max OR severity == "critical"):
      → set pipeline to "halted"
    
    if task.status == "complete":
      → spawn Reviewer
      → advance to next task
  
  if all tasks complete:
    → spawn Reviewer for phase review
    → if human_gate_mode == "phase": wait for human
    → advance to next phase

if pipeline.current_tier == "review":
  → spawn Reviewer for final review
  → set current_tier = "complete"
```

---

## Validation Rules

1. `current_phase` must be a valid index into `phases[]` (0-based) or 0 if no phases
2. Each phase's `current_task` must be valid index into that phase's `tasks[]`
3. `retries` must never exceed `limits.max_retries_per_task`
4. `phases.length` must never exceed `limits.max_phases`
5. Each phase's `tasks.length` must never exceed `limits.max_tasks_per_phase`
6. Only one task across the entire project should have `status: "in_progress"` at any time (sequential execution)
7. `planning.human_approved` must be `true` before `current_tier` can transition to `execution`
