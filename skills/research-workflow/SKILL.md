# Research Workflow Skill

Use this skill whenever the user asks a research question or requests investigation into a topic.

## Steps

1. **Decompose** the question into 2–4 sub-topics
2. **Dispatch subagents** — one per sub-topic, each with relevant MCP tools
3. **Collect** results from all subagents
4. **Synthesize** — deduplicate, cross-reference, and resolve conflicts
5. **Generate report** — structured with Executive Summary, Findings, and Sources
6. **Persist** — save the report to the database
7. **Present** — return the report to the user

## Report Format

```markdown
# Research Report: <title>

## Executive Summary
<Brief 2-3 sentence overview>

## Findings
### <Sub-topic 1>
- <Key point with citation>

### <Sub-topic 2>
- <Key point with citation>

## Sources
1. <Source title> — <URL>
2. ...
```

## Constraints

- Always cite sources with URLs
- Flag uncertain or conflicting information
- Ask for human approval before sending reports externally
- Never modify databases without approval
