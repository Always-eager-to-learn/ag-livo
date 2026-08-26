import { SubagentDispatcher, SubagentTask } from './subagent.js'
import { saveReport, listReports } from './db.js'

export interface ResearchConfig {
  model: string
  webSearchTool: string
  githubTool: string
  dbTool: string
  maxSubagents: number
}

export class ResearchAgent {
  private dispatcher: SubagentDispatcher

  constructor(private config: ResearchConfig) {
    this.dispatcher = new SubagentDispatcher()
  }

  async research(query: string, onProgress: (msg: string) => void): Promise<{
    report: string
    sources: string[]
    reportId?: string
  }> {
    onProgress(`Decomposing query: "${query}"`)

    const subTopics = await this.decompose(query, onProgress)
    onProgress(`Dispatching ${subTopics.length} subagents`)

    this.dispatcher.dispatch(
      subTopics.map((topic) => ({
        subTopic: topic,
        prompt: `Research the following aspect of "${query}": ${topic}. Use web search and GitHub MCP tools. Return a concise summary with sources.`,
        tools: [this.config.webSearchTool, this.config.githubTool],
      }))
    )

    const results = await this.dispatcher.executeAll(async (task) => {
      onProgress(`Subagent "${task.id}" running: ${task.subTopic}`)
      // In production, this calls TrueForge subagent API
      return `[Placeholder: result from subagent ${task.id}]`
    })

    const failed = results.filter((r) => r.status === 'failed')
    if (failed.length > 0) {
      onProgress(`⚠ ${failed.length} subagent(s) failed`)
    }

    onProgress('Synthesizing report')
    const synthesized = await this.synthesize(query, results, onProgress)
    const sources = this.extractSources(results)

    onProgress('Saving report to database')
    const { id } = await saveReport(query, synthesized, sources)

    return { report: synthesized, sources, reportId: id }
  }

  async listHistory(limit = 20) {
    return listReports(limit)
  }

  private async decompose(query: string, onProgress: (msg: string) => void): Promise<string[]> {
    onProgress('Decomposing into sub-topics...')
    // In production, call the LLM to decompose the query
    // For now return a placeholder
    return [
      'General overview and background',
      'Recent developments and news',
      'Technical details and implementation',
      'Community and open-source ecosystem',
    ]
  }

  private async synthesize(
    query: string,
    results: SubagentTask[],
    onProgress: (msg: string) => void
  ): Promise<string> {
    onProgress('Generating structured report...')
    // In production, call the LLM to synthesize findings
    const findings = results
      .filter((r) => r.status === 'completed')
      .map((r) => `### ${r.subTopic}\n${r.result ?? 'No results'}`)
      .join('\n\n')

    return `# Research Report: ${query}\n\n## Executive Summary\nThis report investigates "${query}" across multiple dimensions.\n\n## Findings\n${findings}\n\n## Sources\n*Compiled from subagent research results.*`
  }

  private extractSources(results: SubagentTask[]): string[] {
    // In production, parse URLs from subagent results
    return results.flatMap((r) => (r.result ? this.parseUrls(r.result) : []))
  }

  private parseUrls(text: string): string[] {
    const urlRegex = /https?:\/\/[^\s]+/g
    return [...new Set(text.match(urlRegex) ?? [])]
  }
}
