# Agent Frontmatter Quick Reference

All available frontmatter fields for `.agent.md` files, per the [VS Code Custom Agents Documentation](https://code.visualstudio.com/docs/copilot/customization/custom-agents).

## Frontmatter Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | string | No | filename | Display name in agents dropdown |
| `description` | string | No | — | Placeholder text in chat input (keyword-rich for discovery) |
| `argument-hint` | string | No | — | Hint text guiding user interaction |
| `model` | string \| string[] | No | current picker | AI model or prioritized fallback array |
| `tools` | string[] | No | all | Tool/toolset/MCP-tool names available to this agent |
| `agents` | string[] | No | all | Subagent access: `['*']` = all, `[]` = none, or list names |
| `user-invocable` | boolean | No | `true` | Show in agents dropdown |
| `disable-model-invocation` | boolean | No | `false` | Prevent AI from auto-invoking as subagent |
| `target` | string | No | `vscode` | `vscode` or `github-copilot` |
| `handoffs` | object[] | No | — | Transition buttons to other agents |
| `handoffs[].label` | string | Yes* | — | Button display text |
| `handoffs[].agent` | string | Yes* | — | Target agent identifier |
| `handoffs[].prompt` | string | No | — | Pre-filled prompt for target agent |
| `handoffs[].send` | boolean | No | `false` | Auto-submit the prompt |
| `handoffs[].model` | string | No | — | Override model for handoff execution |

## Tool Sets

Toolsets grant broad access to all tools in a category. Use these for simplicity.

| Toolset | Purpose | Includes |
|---------|---------|----------|
| `read` | Read-only file access | `read/readFile`, `read/problems`, `read/getTaskOutput`, `read/terminalLastCommand`, `read/terminalSelection`, `read/getNotebookSummary`, `read/readNotebookCellOutput` |
| `search` | Code search & discovery | `search/codebase`, `search/usages`, `search/fileSearch`, `search/textSearch`, `search/listDirectory`, `search/changes`, `search/searchResults` |
| `edit` | File modification | `edit/editFiles`, `edit/createFile`, `edit/createDirectory`, `edit/editNotebook`, `edit/createJupyterNotebook` |
| `execute` | Execution & terminal | `execute/runInTerminal`, `execute/getTerminalOutput`, `execute/runTests`, `execute/testFailure`, `execute/runTask`, `execute/createAndRunTask`, `execute/runNotebookCell` |
| `web` | Web access | `web/fetch`, `web/githubRepo` |
| `vscode` | VS Code integration | `vscode/extensions`, `vscode/installExtension`, `vscode/runCommand`, `vscode/vscodeAPI`, `vscode/openSimpleBrowser`, `vscode/newWorkspace`, `vscode/getProjectSetupInfo` |

## Individual Tools (Namespaced)

Use individual tools when you need precise control within a category.

### Read Tools (`read/`)
| Tool | Description |
|------|-------------|
| `read/readFile` | Read file contents |
| `read/problems` | Workspace errors and warnings |
| `read/getTaskOutput` | Get task output |
| `read/terminalLastCommand` | Get last terminal command and output |
| `read/terminalSelection` | Get current terminal selection |

### Search Tools (`search/`)
| Tool | Description |
|------|-------------|
| `search/codebase` | Semantic code search across workspace |
| `search/usages` | Find references, implementations, definitions |
| `search/fileSearch` | Search for files by glob pattern |
| `search/textSearch` | Search text in files |
| `search/listDirectory` | List directory contents |
| `search/changes` | Source control changes |

### Edit Tools (`edit/`)
| Tool | Description |
|------|-------------|
| `edit/editFiles` | Apply edits to workspace files |
| `edit/createFile` | Create new files |
| `edit/createDirectory` | Create new directories |

### Execute Tools (`execute/`)
| Tool | Description |
|------|-------------|
| `execute/runInTerminal` | Execute terminal commands |
| `execute/getTerminalOutput` | Get terminal command output |
| `execute/runTests` | Run unit tests |
| `execute/testFailure` | Get test failure information |
| `execute/runTask` | Run a workspace task |

### Other Tools (no namespace)
| Tool | Description |
|------|-------------|
| `agent` | Call other agents as subagents — **required** when `agents` array is set |
| `todo` | Track progress with todo lists |

### MCP Server Tools
Use `<server-name>/<tool-name>` for a specific tool, or `<server-name>/*` for all tools from that server.

## Critical Rules

### Rule 1: Agent Tool Requirement

When the `agents` array is non-empty, you **MUST** include `agent` in `tools`:

```yaml
# ✅ Correct
tools: ['search', 'read', 'agent']
agents: ['*']

# ❌ Incorrect — missing agent tool
tools: ['search', 'read']
agents: ['*']  # ERROR: agent tool must be included!

# ✅ No agent tool needed when agents is empty
tools: ['search', 'read']
agents: []
```

### Rule 2: Tool Namespacing

Always use namespaced format for individual tools:

```yaml
# ✅ Correct — namespaced
tools: ['search/codebase', 'read/readFile', 'edit/editFiles']

# ✅ Correct — toolsets
tools: ['search', 'read', 'edit']

# ❌ Incorrect — deprecated names
tools: ['codebase', 'readFile', 'editFiles']
```

### Rule 3: Deprecated Tool Names (DO NOT USE)

| Deprecated Name | Replacement |
|-----------------|-------------|
| `readFile` | `read/readFile` or `read` toolset |
| `editFile` | `edit/editFiles` or `edit` toolset |
| `createFile` | `edit/createFile` or `edit` toolset |
| `findFiles` | `search/fileSearch` or `search` toolset |
| `runInTerminal` | `execute/runInTerminal` or `execute` toolset |
| `fetchWebpage` | `web/fetch` or `web` toolset |

## Available Models (March 2026)

| Model | Vendor | Multiplier |
|-------|--------|------------|
| `Claude Haiku 4.5 (copilot)` | Anthropic | 0.33x |
| `Claude Sonnet 4 (copilot)` | Anthropic | 1x |
| `Claude Sonnet 4.5 (copilot)` | Anthropic | 1x |
| `Claude Sonnet 4.6 (copilot)` | Anthropic | 1x |
| `Claude Opus 4.5 (copilot)` | Anthropic | 3x |
| `Claude Opus 4.6 (copilot)` | Anthropic | 3x |
| `GPT-4.1 (copilot)` | OpenAI | 0x (free) |
| `GPT-5 mini (copilot)` | OpenAI | 0x (free) |
| `GPT-5.1 (copilot)` | OpenAI | 1x |
| `GPT-5.1-Codex-Max (copilot)` | OpenAI | 1x |
| `GPT-5.2 (copilot)` | OpenAI | 1x |
| `GPT-5.2-Codex (copilot)` | OpenAI | 1x |
| `GPT-5.3-Codex (copilot)` | OpenAI | 1x |
| `Gemini 2.5 Pro (copilot)` | Google | 1x |
| `Gemini 3 Flash (copilot)` | Google | 0.33x |
| `Gemini 3 Pro (copilot)` | Google | 1x |
| `Gemini 3.1 Pro (copilot)` | Google | 1x |
| `Grok Code Fast 1 (copilot)` | Google | 0.25x |
