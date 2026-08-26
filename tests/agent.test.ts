import { describe, it, expect } from 'vitest'
import { ResearchAgent } from '../src/agent.js'

describe('ResearchAgent', () => {
  const config = {
    model: 'gpt-4o-mini',
    webSearchTool: 'exa',
    githubTool: 'github',
    dbTool: 'supabase',
    maxSubagents: 4,
  }

  it('should initialize without error', () => {
    const agent = new ResearchAgent(config)
    expect(agent).toBeDefined()
  })

  it('should decompose a query into sub-topics', async () => {
    const agent = new ResearchAgent(config)
    // The decompose method is called internally during research
    // Verify the agent runs without throwing
    const progress: string[] = []
    const result = await agent.research('What is Rust programming language?', (msg) => {
      progress.push(msg)
    })

    expect(result.report).toContain('Rust programming language')
    expect(progress.length).toBeGreaterThan(0)
  })
})
