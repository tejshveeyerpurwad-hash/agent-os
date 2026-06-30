import { useLemmaStore } from '@/store/lemmaStore'
import { useAgentsStore } from '@/store/agentsStore'
import { useActivityStore } from '@/store/activityStore'
import { analyzeObjective } from '@/store/plannerEngine'
import type { Subtask } from '@/types/execution'

export async function executeWithLemma(
  objective: string,
  executionId: string,
  onPhase: (phase: string) => void,
  onLog: (entry: { phase: string; detail: string }) => void,
): Promise<string | null> {
  const lemmaStore = useLemmaStore.getState()
  const agentsStore = useAgentsStore.getState()
  const activityStore = useActivityStore.getState()

  if (!lemmaStore.client || !lemmaStore.initialized) {
    return null
  }

  onPhase('planning')
  onLog({ phase: 'planning', detail: 'Analyzing with Lemma planner...' })
  activityStore.addEvent({ type: 'execution', action: 'Lemma planning', detail: objective, executionId, severity: 'info' })

  const plan = analyzeObjective({ objective })
  const subtasks = plan.subtasks

  onLog({ phase: 'decomposing', detail: `${subtasks.length} subtasks across ${new Set(subtasks.map(s => s.agentId)).size} Lemma agents` })

  onPhase('assigning_agents')
  const allAgentIds = [...new Set(subtasks.map(s => s.agentId))]
  allAgentIds.forEach(id => agentsStore.setAgentStatus(id, 'running'))

  onPhase('executing')
  onLog({ phase: 'executing', detail: 'Executing with Lemma parallelism...' })

  const maxDepth = plan.depthLevels
  const results: Record<string, string> = {}

  for (let depth = 0; depth <= maxDepth; depth++) {
    const tasksAtDepth = subtasks.filter(s => s.depth === depth)
    if (tasksAtDepth.length === 0) continue

    onLog({ phase: 'executing', detail: `Depth ${depth + 1}/${maxDepth + 1}: ${tasksAtDepth.length} parallel Lemma tasks` })

    const depthResults = await Promise.allSettled(
      tasksAtDepth.map(async (subtask) => {
        subtask.startedAt = new Date().toISOString()

        let knowledgeContext = ''
        if (subtask.knowledgeQueries.length > 0) {
          onLog({ phase: 'querying_knowledge', detail: `Lemma knowledge query: ${subtask.knowledgeQueries.join(', ')}` })
          const query = subtask.knowledgeQueries.join(' ')
          const docs = await lemmaStore.searchDocuments(query)
          if (docs.length > 0) {
            knowledgeContext = docs.map(d => d.name).join(', ')
            await sleep(100)
          }
        }

        const lemmaAgentName = mapAgentIdToLemma(subtask.agentId)
        const agentMessage = buildAgentMessage(subtask, knowledgeContext, objective)

        const lemmaResult = await lemmaStore.runAgent(lemmaAgentName, agentMessage)
        const result = lemmaResult || await agentsStore.executeTask(subtask.agentId, subtask.description, executionId)

        subtask.status = 'completed'
        subtask.result = result
        subtask.completedAt = new Date().toISOString()

        agentsStore.addMemory(subtask.agentId, `${subtask.description} → Lemma: ${result.slice(0, 100)}`)

        return { id: subtask.id, result }
      })
    )

    depthResults.forEach((r) => {
      if (r.status === 'fulfilled') {
        results[r.value.id] = r.value.result
      }
    })
  }

  allAgentIds.forEach(id => agentsStore.setAgentStatus(id, 'idle'))

  const completed = subtasks.filter(s => s.status === 'completed')
  const summary = `Lemma execution complete: ${completed.length}/${subtasks.length} tasks completed via ${allAgentIds.length} Lemma agents`

  onPhase('completed')
  onLog({ phase: 'completed', detail: summary })

  activityStore.addEvent({ type: 'execution', action: 'Lemma execution completed', detail: summary, executionId, severity: 'success' })

  return summary
}

function mapAgentIdToLemma(agentId: string): string {
  const map: Record<string, string> = {
    'agent-ceo': 'ceo-agent',
    'agent-hr': 'hr-agent',
    'agent-finance': 'finance-agent',
    'agent-sales': 'sales-agent',
    'agent-marketing': 'marketing-agent',
    'agent-ops': 'operations-agent',
    'agent-legal': 'legal-agent',
    'agent-support': 'support-agent',
  }
  return map[agentId] || 'general-agent'
}

function buildAgentMessage(subtask: Subtask, knowledgeContext: string, objective: string): string {
  let message = `Task: ${subtask.description}\nContext: Business objective: ${objective}`
  if (knowledgeContext) {
    message += `\nRelevant knowledge: ${knowledgeContext}`
  }
  return message
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}
