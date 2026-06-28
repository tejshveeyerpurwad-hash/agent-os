import { create } from 'zustand'
import type { Execution, ExecutionPhase, Approval, Subtask } from '@/types/execution'
import { analyzeObjective } from './plannerEngine'
import { useAgentsStore } from './agentsStore'
import { useActivityStore } from './activityStore'
import { useKnowledgeStore } from './knowledgeStore'

interface ExecutionState {
  executions: Execution[]
  currentExecution: Execution | null
  approvals: Approval[]
  isProcessing: boolean
  agentLogs: Record<string, { timestamp: string; action: string; detail: string; severity: string }[]>
}

interface ExecutionActions {
  submitObjective: (objective: string) => Promise<void>
  approveTask: (approvalId: string) => Promise<void>
  rejectTask: (approvalId: string) => void
  cancelExecution: () => void
  getExecution: (id: string) => Execution | undefined
  clearCompleted: () => void
}

let execCounter = 0

export const useExecutionEngine = create<ExecutionState & ExecutionActions>((set, get) => ({
  executions: [],
  currentExecution: null,
  approvals: [],
  isProcessing: false,
  agentLogs: {},

  submitObjective: async (objective: string) => {
    if (!objective.trim() || get().isProcessing) return

    execCounter++
    const activityStore = useActivityStore.getState()
    const agentsStore = useAgentsStore.getState()
    const knowledgeStore = useKnowledgeStore.getState()

    const execution: Execution = {
      id: `exec-${Date.now()}-${execCounter}`,
      objective,
      phase: 'analyzing',
      plan: null,
      currentTaskId: null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      result: null,
      error: null,
      history: [],
      taskResults: {},
      completedCount: 0,
      totalCount: 0,
    }

    set({
      isProcessing: true,
      currentExecution: execution,
      approvals: [],
      agentLogs: {},
    })

    const appendHistory = (phase: ExecutionPhase, detail: string) => {
      set(state => {
        const c = state.currentExecution
        if (!c) return state
        return {
          currentExecution: {
            ...c,
            phase,
            history: [...c.history, { phase, timestamp: new Date().toISOString(), detail }],
          },
        }
      })
    }

    const addAgentLog = (agentId: string, entry: { timestamp: string; action: string; detail: string; severity: string }) => {
      set(state => ({
        agentLogs: {
          ...state.agentLogs,
          [agentId]: [...(state.agentLogs[agentId] || []), entry],
        },
      }))
    }

    appendHistory('analyzing', 'Analyzing business objective...')
    activityStore.addEvent({ type: 'execution', action: 'Objective submitted', detail: objective, executionId: execution.id, severity: 'info' })
    await sleep(500)

    appendHistory('planning', 'Decomposing into subtasks...')
    activityStore.addEvent({ type: 'execution', action: 'Planning objective', detail: 'Running planner engine to decompose into subtasks', executionId: execution.id, severity: 'info' })
    await sleep(400)

    const plan = analyzeObjective({ objective })
    set(state => ({
      currentExecution: state.currentExecution
        ? { ...state.currentExecution, plan, totalCount: plan.subtasks.length }
        : null,
    }))

    appendHistory('decomposing', `${plan.subtasks.length} subtasks created across ${new Set(plan.subtasks.map(s => s.agentId)).size} agents`)
    activityStore.addEvent({ type: 'execution', action: 'Plan created', detail: `${plan.subtasks.length} subtasks in ${plan.depthLevels + 1} parallel groups`, executionId: execution.id, severity: 'success' })
    await sleep(300)

    appendHistory('assigning_agents', `Assigning agents: ${[...new Set(plan.subtasks.map(s => s.agentId))].join(', ')}`)

    const allAgentIds = [...new Set(plan.subtasks.map(s => s.agentId))]
    allAgentIds.forEach(id => agentsStore.setAgentStatus(id, 'running'))

    activityStore.addEvent({ type: 'execution', action: 'Agents assigned', detail: `${allAgentIds.length} agents activated for parallel execution`, executionId: execution.id, severity: 'success' })
    await sleep(400)

    appendHistory('executing', 'Beginning parallel execution...')
    set(state => ({
      currentExecution: state.currentExecution ? { ...state.currentExecution, phase: 'executing' } : null,
    }))

    const subtasks = [...plan.subtasks]
    const maxDepth = plan.depthLevels

    for (let depth = 0; depth <= maxDepth; depth++) {
      const tasksAtDepth = subtasks.filter(s => s.depth === depth)

      if (tasksAtDepth.length === 0) continue

      appendHistory('executing', `Executing group ${depth + 1}/${maxDepth + 1}: ${tasksAtDepth.length} task${tasksAtDepth.length > 1 ? 's' : ''} in parallel`)

      const results = await Promise.allSettled(
        tasksAtDepth.map(async (subtask) => {
          subtask.startedAt = new Date().toISOString()
          subtask.status = 'running'

          set(state => ({
            currentExecution: state.currentExecution
              ? { ...state.currentExecution, currentTaskId: subtask.id }
              : null,
          }))

          activityStore.addEvent({
            type: 'agent',
            action: `${agentsStore.getAgent(subtask.agentId)?.name || subtask.agentId} executing`,
            detail: subtask.description,
            agentId: subtask.agentId,
            executionId: execution.id,
            severity: 'info',
          })

          addAgentLog(subtask.agentId, {
            timestamp: new Date().toISOString(),
            action: 'Task started',
            detail: subtask.description,
            severity: 'info',
          })

          if (subtask.knowledgeQueries.length > 0) {
            appendHistory('querying_knowledge', `Querying knowledge: ${subtask.knowledgeQueries.join(', ')}`)
            subtask.knowledgeQueries.forEach(q => knowledgeStore.search(q))
            await sleep(200)
          }

          const needsApproval = subtask.priority === 'high' && (
            subtask.description.toLowerCase().includes('approv') ||
            subtask.description.toLowerCase().includes('sign-off') ||
            subtask.description.toLowerCase().includes('offer') ||
            subtask.description.toLowerCase().includes('budget') ||
            subtask.description.toLowerCase().includes('salary') ||
            subtask.description.toLowerCase().includes('headcount')
          )

          if (needsApproval) {
            subtask.status = 'awaiting_approval'

            const approval: Approval = {
              id: `approval-${Date.now()}-${subtask.id}`,
              executionId: execution.id,
              subtaskId: subtask.id,
              title: `Approve: ${subtask.description.slice(0, 60)}`,
              description: subtask.description,
              urgency: subtask.priority === 'high' ? 'high' : 'medium',
              status: 'pending',
              createdAt: new Date().toISOString(),
              resolvedAt: null,
            }

            set(state => ({ approvals: [...state.approvals, approval] }))

            appendHistory('awaiting_approval', `Awaiting approval: ${subtask.description.slice(0, 50)}...`)
            activityStore.addEvent({
              type: 'approval',
              action: 'Approval required',
              detail: subtask.description,
              agentId: subtask.agentId,
              executionId: execution.id,
              severity: 'warning',
            })

            addAgentLog(subtask.agentId, {
              timestamp: new Date().toISOString(),
              action: 'Awaiting approval',
              detail: subtask.description,
              severity: 'warning',
            })

            set(state => ({
              currentExecution: state.currentExecution ? { ...state.currentExecution, phase: 'awaiting_approval' } : null,
            }))

            await sleep(1500)

            const updatedApproval = get().approvals.find(a => a.id === approval.id)
            if (!updatedApproval || updatedApproval.status === 'pending') {
              get().approveTask(approval.id)
            }

            if (updatedApproval?.status === 'rejected') {
              subtask.status = 'failed'
              subtask.completedAt = new Date().toISOString()
              activityStore.addEvent({
                type: 'agent',
                action: 'Task rejected',
                detail: subtask.description,
                agentId: subtask.agentId,
                executionId: execution.id,
                severity: 'error',
              })
              return { id: subtask.id, result: 'Task rejected by user' }
            }

            set(state => ({
              currentExecution: state.currentExecution ? { ...state.currentExecution, phase: 'executing' } : null,
            }))
          }

          const result = await agentsStore.executeTask(subtask.agentId, subtask.description, execution.id)
          subtask.status = 'completed'
          subtask.result = result
          subtask.completedAt = new Date().toISOString()

          addAgentLog(subtask.agentId, {
            timestamp: new Date().toISOString(),
            action: 'Task completed',
            detail: result.slice(0, 100),
            severity: 'success',
          })

          return { id: subtask.id, result }
        })
      )

      results.forEach((r, i) => {
        if (r.status === 'fulfilled') {
          const task = tasksAtDepth[i]
          const taskResult = r.value
          set(state => ({
            currentExecution: state.currentExecution
              ? {
                  ...state.currentExecution,
                  taskResults: { ...state.currentExecution.taskResults, [taskResult.id]: taskResult.result },
                  completedCount: state.currentExecution.completedCount + 1,
                }
              : null,
          }))
        }
      })

      if (depth < maxDepth) {
        await sleep(300)
      }
    }

    const allCompleted = subtasks.every(s => s.status === 'completed' || s.status === 'failed')
    const completedCount = subtasks.filter(s => s.status === 'completed').length

    allAgentIds.forEach(id => agentsStore.setAgentStatus(id, 'idle'))

    if (allCompleted && completedCount > 0) {
      const finalSummary = generateFinalSummary(objective, subtasks)
      appendHistory('completed', finalSummary)

      set(state => ({
        currentExecution: state.currentExecution
          ? {
              ...state.currentExecution,
              phase: 'completed',
              result: finalSummary,
              completedAt: new Date().toISOString(),
            }
          : null,
      }))

      activityStore.addEvent({
        type: 'execution',
        action: 'Objective completed successfully',
        detail: `${completedCount}/${subtasks.length} tasks completed across ${allAgentIds.length} agents`,
        executionId: execution.id,
        severity: 'success',
      })
    }

    const finalExec = get().currentExecution
    if (finalExec) {
      set(state => ({
        executions: [finalExec, ...state.executions].slice(0, 50),
      }))
    }

    set({ isProcessing: false })
  },

  approveTask: (approvalId: string) => {
    const approval = get().approvals.find(a => a.id === approvalId)
    if (!approval) return

    set(state => ({
      approvals: state.approvals.map(a =>
        a.id === approvalId ? { ...a, status: 'approved', resolvedAt: new Date().toISOString() } : a
      ),
    }))

    useActivityStore.getState().addEvent({
      type: 'approval',
      action: 'Approval granted',
      detail: approval.title,
      executionId: approval.executionId,
      severity: 'success',
    })

    const execution = get().currentExecution
    if (execution && execution.plan) {
      const subtask = execution.plan.subtasks.find(s => s.id === approval.subtaskId)
      if (subtask && subtask.status === 'awaiting_approval') {
        subtask.status = 'pending'
        set(state => ({
          currentExecution: state.currentExecution
            ? { ...state.currentExecution, phase: 'executing' }
            : null,
        }))
      }
    }
  },

  rejectTask: (approvalId: string) => {
    const approval = get().approvals.find(a => a.id === approvalId)
    if (!approval) return

    set(state => ({
      approvals: state.approvals.map(a =>
        a.id === approvalId ? { ...a, status: 'rejected', resolvedAt: new Date().toISOString() } : a
      ),
    }))

    useActivityStore.getState().addEvent({
      type: 'approval',
      action: 'Approval rejected',
      detail: approval.title,
      executionId: approval.executionId,
      severity: 'error',
    })
  },

  cancelExecution: () => {
    const current = get().currentExecution
    if (current) {
      useActivityStore.getState().addEvent({
        type: 'execution',
        action: 'Execution cancelled',
        detail: current.objective,
        executionId: current.id,
        severity: 'warning',
      })
    }
    set({ currentExecution: null, isProcessing: false, approvals: [] })
  },

  getExecution: (id) => get().executions.find(e => e.id === id),

  clearCompleted: () => set({ executions: [], approvals: [], agentLogs: {} }),
}))

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

function generateFinalSummary(objective: string, subtasks: Subtask[]): string {
  const completed = subtasks.filter(s => s.status === 'completed')
  const failed = subtasks.filter(s => s.status === 'failed')
  const agents = [...new Set(subtasks.map(s => s.agentId))]

  const lines = [
    `Business objective completed: "${objective}"`,
    `Total subtasks: ${subtasks.length} (${completed.length} completed, ${failed.length} failed)`,
    `Agents involved: ${agents.length}`,
    `Time: ${new Date().toLocaleTimeString()}`,
  ]

  if (completed.length > 0) {
    lines.push('')
    lines.push('Key results:')
    completed.slice(0, 5).forEach(s => {
      if (s.result) lines.push(`  • ${s.agentId.replace('agent-', '')}: ${s.result.slice(0, 120)}`)
    })
  }

  return lines.join('\n')
}

export { sleep }
