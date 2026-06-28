import { create } from 'zustand'
import type { Execution, ExecutionPhase, Approval } from '@/types/execution'
import { analyzeObjective } from './plannerEngine'
import { useAgentsStore } from './agentsStore'
import { useActivityStore } from './activityStore'
import { useKnowledgeStore } from './knowledgeStore'

interface ExecutionState {
  executions: Execution[]
  currentExecution: Execution | null
  approvals: Approval[]
  isProcessing: boolean
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

  submitObjective: async (objective: string) => {
    if (!objective.trim() || get().isProcessing) return

    execCounter++
    const activityStore = useActivityStore.getState()
    const agentsStore = useAgentsStore.getState()
    const knowledgeStore = useKnowledgeStore.getState()

    const execution: Execution = {
      id: `exec-${Date.now()}-${execCounter}`,
      objective,
      phase: 'planning',
      plan: null,
      currentTaskId: null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      result: null,
      error: null,
      history: [],
    }

    set({ isProcessing: true, currentExecution: execution })

    const appendHistory = (phase: ExecutionPhase, detail: string) => {
      set(state => {
        const updated = state.currentExecution
        if (!updated) return state
        return {
          currentExecution: {
            ...updated,
            phase,
            history: [...updated.history, { phase, timestamp: new Date().toISOString(), detail }],
          },
        }
      })
    }

    appendHistory('planning', 'Analyzing business objective...')
    activityStore.addEvent({ type: 'execution', action: 'Objective submitted', detail: objective, executionId: execution.id, severity: 'info' })

    await new Promise(r => setTimeout(r, 600))

    appendHistory('decomposing', 'Decomposing into subtasks...')
    activityStore.addEvent({ type: 'execution', action: 'Planning objective', detail: 'Decomposing business objective into executable tasks', executionId: execution.id, severity: 'info' })

    const plan = analyzeObjective({ objective })
    await new Promise(r => setTimeout(r, 400))

    set(state => ({
      currentExecution: state.currentExecution ? { ...state.currentExecution, plan } : null,
    }))

    appendHistory('assigning_agents', `Assigning ${plan.subtasks.length} subtasks to agents...`)
    activityStore.addEvent({ type: 'execution', action: 'Plan created', detail: `${plan.subtasks.length} subtasks created across ${[...new Set(plan.subtasks.map(s => s.agentId))].length} agents`, executionId: execution.id, severity: 'success' })

    await new Promise(r => setTimeout(r, 500))

    appendHistory('assigning_agents', `Agents assigned: ${[...new Set(plan.subtasks.map(s => s.agentId))].join(', ')}`)
    set(state => ({
      currentExecution: state.currentExecution ? { ...state.currentExecution, phase: 'executing' } : null,
    }))

    appendHistory('executing', 'Agents beginning execution...')

    for (const agentId of [...new Set(plan.subtasks.map(s => s.agentId))]) {
      agentsStore.setAgentStatus(agentId, 'running')
    }

    for (let i = 0; i < plan.subtasks.length; i++) {
      const subtask = plan.subtasks[i]
      const isSequential = i === 0 || plan.subtasks[i].dependsOn.length > 0
      const delay = isSequential ? 1200 : 400

      set(state => {
        if (!state.currentExecution) return state
        return {
          currentExecution: {
            ...state.currentExecution,
            currentTaskId: subtask.id,
            phase: 'executing',
          },
        }
      })

      appendHistory('executing', `Executing: ${subtask.description}`)

      if (subtask.knowledgeQueries.length > 0) {
        appendHistory('querying_knowledge', `Querying knowledge base: ${subtask.knowledgeQueries.join(', ')}`)
        subtask.knowledgeQueries.forEach(q => {
          knowledgeStore.search(q)
        })
        await new Promise(r => setTimeout(r, 300))
      }

      const alreadyApproved = get().approvals.find(a => a.subtaskId === subtask.id && a.status === 'approved')
      const needsApproval = !alreadyApproved && (
        subtask.description.toLowerCase().includes('approv') ||
        subtask.description.toLowerCase().includes('offer') ||
        subtask.description.toLowerCase().includes('budget') ||
        subtask.description.toLowerCase().includes('legal sign')
      )

      if (needsApproval) {
        const approval: Approval = {
          id: `approval-${Date.now()}-${i}`,
          executionId: execution.id,
          subtaskId: subtask.id,
          title: `Approve: ${subtask.description.slice(0, 60)}`,
          description: subtask.description,
          urgency: i < 2 ? 'high' : 'medium',
          status: 'pending',
          createdAt: new Date().toISOString(),
          resolvedAt: null,
        }
        set(state => ({ approvals: [...state.approvals, approval] }))
        set(state => ({
          currentExecution: state.currentExecution ? { ...state.currentExecution, phase: 'awaiting_approval' } : null,
        }))
        appendHistory('awaiting_approval', `Waiting for approval: ${subtask.description}`)
        activityStore.addEvent({ type: 'approval', action: 'Approval required', detail: subtask.description, executionId: execution.id, agentId: subtask.agentId, severity: 'warning' })

        await new Promise(r => setTimeout(r, 2000))

        const updatedApproval = get().approvals.find(a => a.id === approval.id)
        if (updatedApproval?.status === 'pending') {
          const result = await agentsStore.executeTask(subtask.agentId, subtask.description)
          subtask.status = 'completed'
          subtask.result = result
          subtask.completedAt = new Date().toISOString()
          set(state => ({
            currentExecution: state.currentExecution ? { ...state.currentExecution, phase: 'executing' } : null,
          }))
        }
      } else {
        const result = await agentsStore.executeTask(subtask.agentId, subtask.description)
        subtask.status = 'completed'
        subtask.result = result
        subtask.completedAt = new Date().toISOString()
      }

      await new Promise(r => setTimeout(r, delay))
    }

    const allCompleted = plan.subtasks.every(s => s.status === 'completed')
    const agentIds = [...new Set(plan.subtasks.map(s => s.agentId))]
    agentIds.forEach(id => agentsStore.setAgentStatus(id, 'idle'))

    if (allCompleted) {
      appendHistory('completed', 'All tasks completed successfully.')
      set(state => ({
        currentExecution: state.currentExecution ? {
          ...state.currentExecution,
          phase: 'completed',
          result: `Business objective completed: ${objective}`,
          completedAt: new Date().toISOString(),
        } : null,
      }))
      activityStore.addEvent({ type: 'execution', action: 'Objective completed', detail: `All ${plan.subtasks.length} subtasks completed successfully`, executionId: execution.id, severity: 'success' })
    }

    const finalExecution = get().currentExecution
    if (finalExecution) {
      set(state => ({
        executions: [finalExecution, ...state.executions].slice(0, 50),
      }))
    }

    set({ isProcessing: false })
  },

  approveTask: async (approvalId: string) => {
    const approval = get().approvals.find(a => a.id === approvalId)
    if (!approval) return

    set(state => ({
      approvals: state.approvals.map(a =>
        a.id === approvalId ? { ...a, status: 'approved', resolvedAt: new Date().toISOString() } : a
      ),
    }))

    useActivityStore.getState().addEvent({
      type: 'approval', action: 'Approval granted', detail: approval.title, executionId: approval.executionId, severity: 'success',
    })
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
      type: 'approval', action: 'Approval rejected', detail: approval.title, executionId: approval.executionId, severity: 'error',
    })
  },

  cancelExecution: () => {
    const current = get().currentExecution
    if (current) {
      useActivityStore.getState().addEvent({
        type: 'execution', action: 'Execution cancelled', detail: current.objective, executionId: current.id, severity: 'warning',
      })
    }
    set({ currentExecution: null, isProcessing: false })
  },

  getExecution: (id) => get().executions.find(e => e.id === id),

  clearCompleted: () => set({ executions: [], approvals: [] }),
}))
