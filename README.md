# ag-livo — AI Research Agent

An AI-powered research agent built on TrueForge that gathers information from multiple sources, delegates parallel investigation to subagents, and compiles structured reports with citations.

## What It Does

Give the agent a research question and it will:

1. **Deconstruct** the question into sub-topics
2. **Dispatch subagents** to search the web, query GitHub, and read from a database in parallel
3. **Merge findings** into a structured report with sources and citations
4. **Persist** the research session so you can return and continue later

## Architecture

```
User Query
    │
    ▼
Main Agent (TrueForge)
    │
    ├── Subagent A → Web Search (Exa/Tavily MCP)
    ├── Subagent B → GitHub MCP (repos, issues, PRs)
    └── Subagent C → Database MCP (Supabase/Postgres)
    │
    ▼
Synthesis Engine → Structured Report
```

## Getting Started

### Prerequisites

- Node.js 22+
- TrueForge installed locally
- API keys for your chosen providers (OpenAI/Anthropic/Gemini, Exa or Tavily, GitHub)

### Step 1 — Run TrueForge

```bash
npx @truefoundry/trueforge
```

Open `http://localhost:8790` in your browser.

### Step 2 — Connect a Model

Go to **Settings → Models** and add your preferred provider:

- OpenAI (`gpt-4o` or `gpt-4o-mini`)
- Anthropic (`claude-sonnet-4-20250514`)
- Gemini (`gemini-2.0-flash`)
- Any OpenAI-compatible endpoint

### Step 3 — Configure MCP Servers

Go to **Settings → Connectors** and add:

| MCP Server | Purpose |
|------------|---------|
| `exa` or `tavily` | Web search |
| `github` | GitHub repos, issues, PRs |
| Custom DB MCP | Supabase / PostgreSQL queries |

Example MCP config (`mcp-servers.json`):

```json
{
  "servers": [
    {
      "name": "exa",
      "command": "npx",
      "args": ["-y", "exa-mcp-server"],
      "env": { "EXA_API_KEY": "<your-key>" }
    },
    {
      "name": "github",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "<your-token>" }
    }
  ]
}
```

### Step 4 — Set Up a Sandbox

Go to **Settings → Sandbox providers** and add Daytona:

1. Create a Daytona API key at [daytona.io](https://daytona.io)
2. Paste the key in TrueForge settings
3. Save

### Step 5 — Compose Your Agent

In the TrueForge chat, open **Tools** and enable:

- Connectors: Exa, GitHub, DB
- Skills: `research-workflow` (import from GitHub)
- Sandbox: enabled
- Subagents: enabled

Save as a reusable agent called **Research Agent**.

## Agent Configuration

### System Prompt

```
You are a research agent. Your job is to investigate questions thoroughly
and produce well-structured reports with citations.

Rules:
- Break complex questions into sub-topics
- Dispatch subagents for parallel research
- Always cite sources
- Ask before taking any irreversible action
- Store results in the database for later retrieval
```

### Skill: `research-workflow/SKILL.md`

```markdown
# Research Workflow Skill

Use this skill whenever the user asks a research question.

Steps:
1. Decompose the question into 2-4 sub-topics
2. Launch a subagent per sub-topic with the relevant MCP tools
3. Collect results and deduplicate findings
4. Write a structured report (Executive Summary, Findings, Sources)
5. Save the report to the database
6. Present the report to the user
```

## Project Structure

```
ag-livo/
├── README.md
├── agent.json              # Saved agent config
├── mcp-servers.json        # MCP server definitions
├── skills/
│   └── research-workflow/
│       └── SKILL.md        # Research skill instructions
├── src/
│   ├── agent.ts            # Agent orchestration logic
│   ├── subagent.ts         # Subagent launcher
│   ├── synthesizer.ts      # Report generation
│   └── db.ts               # Database persistence layer
└── tests/
    └── research.test.ts    # Unit tests
```

## Qodo Code Review Evidence

> Every pull request in this repo is reviewed by Qodo before merge.

**Representative PR:** [Replace with your PR link after first merge]

**What Qodo found and what we changed:**
- [Add your summary here after your first Qodo review — e.g., "Qodo flagged an unhandled promise rejection in subagent.ts; we added error boundaries and a timeout fallback."]

**PR History:**
- [Link to PR 1] — Qodo review: X findings, Y resolved, Z dismissed
- [Link to PR 2] — Follow-up review: clean

To add a finding: comment `/agentic_review` on any pull request.

## Demo

Record a 3-minute video showing:

1. The agent receiving a research question
2. Subagents launching in parallel (show the TrueForge session log)
3. The agent requesting human approval before saving/sending results
4. The final structured report with citations

## Running Tests

```bash
npm test
```

## Tech Stack

| Component | Tool |
|-----------|------|
| Agent harness | [TrueForge](https://github.com/truefoundry/trueforge) |
| Model | OpenAI / Anthropic / Gemini |
| Web search | Exa or Tavily (MCP) |
| Code search | GitHub (MCP) |
| Data storage | Supabase / PostgreSQL |
| Sandbox | Daytona |
| Code review | [Qodo](https://qodo.ai) |

## Hackathon Tracks

This project targets:

- **Double-O Track** (Best Use of TrueForge) — subagents, MCP tools, sandbox, approval gate, persistent sessions
- **Q Branch Track** (Best Code Quality) — Qodo-reviewed PRs, clean architecture
- **Savile Row Track** (Best UI) — clear session log, approval UI, structured report view

## License

MIT
