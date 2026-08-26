export interface SubagentTask {
  id: string
  subTopic: string
  prompt: string
  tools: string[]
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: string
  error?: string
}

export interface ResearchResult {
  query: string
  subagents: SubagentTask[]
  synthesizedReport: string
  sources: string[]
  reportId?: string
}

export class SubagentDispatcher {
  private tasks: SubagentTask[] = []

  dispatch(tasks: Array<{ subTopic: string; prompt: string; tools: string[] }>): void {
    this.tasks = tasks.map((t, i) => ({
      id: `sa-${Date.now()}-${i}`,
      subTopic: t.subTopic,
      prompt: t.prompt,
      tools: t.tools,
      status: 'pending',
    }))
  }

  async executeAll(
    executeTask: (task: SubagentTask) => Promise<string>
  ): Promise<SubagentTask[]> {
    const results = await Promise.allSettled(
      this.tasks.map(async (task) => {
        task.status = 'running'
        try {
          const result = await executeTask(task)
          task.status = 'completed'
          task.result = result
        } catch (err) {
          task.status = 'failed'
          task.error = err instanceof Error ? err.message : String(err)
        }
        return task
      })
    )

    return this.tasks
  }

  getTasks(): SubagentTask[] {
    return this.tasks
  }
}
