---
description: "Continue a project through the orchestration pipeline. Ensures the Orchestrator runs as the primary agent — not as a subagent — so it retains full control of agent sequencing. Use for local, background, or cloud-based execution."
agent: Orchestrator
---

# Execute Plan

Continue the project by following your Decision Logic (Steps 0–2) exactly as defined in your agent instructions.

1. **Locate the project** — read `orchestration.yml` for `base_path`, find `state.json`
2. **Read state** — determine `current_tier` and route accordingly
3. **Run the pipeline to completion** — spawn agents per your routing rules, re-read state after each, and loop until the current tier is finished or a human gate is reached

You are the primary agent in this session. Do not yield control between agent spawns — after each subagent returns, you decide and execute the next step immediately.
