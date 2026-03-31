# PR Corrections Guide

Workflow for reviewing inbound PR comments, deciding on fixes, implementing them, and responding.

## Step 1: Review

- Read all PR comments and form a repair plan.
- **Validate independently** — do not treat reviewer comments as ground truth.
- Read project docs to ground yourself in scope.
- Read the affected code and its surroundings to assess blast radius.

## Step 2: Implement

- Use your own judgment on the best solution — do not blindly adopt the reviewer's suggestion.
- Limit changes to what the PR comment addresses; avoid scope creep.

## Step 3: Respond & Commit

- Reply to **each** PR comment individually via the GitHub MCP tool with an acknowledgement and summary of what changed (or why no change was made).
- Commit and push to the branch — **only if `pipeline.auto_commit` is enabled in the project's `state.json`**. If not enabled, skip and notify the user.
