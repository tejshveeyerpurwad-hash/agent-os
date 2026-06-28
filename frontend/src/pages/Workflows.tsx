import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Workflow as WorkflowIcon, Play, Pause, CheckCircle2, Loader2, XCircle, Clock, Bot, Plus, Search, ArrowRight, Terminal, Sparkles, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useExecutionEngine } from '@/store/executionEngine'
import { useAgentsStore } from '@/store/agentsStore'
import { useActivityStore } from '@/store/activityStore'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import type { WorkflowDefinition } from '@/types/execution'

const workflowDefs: WorkflowDefinition[] = [
  { id: 'wf-1', name: 'Customer Onboarding', description: 'Automated customer onboarding with account setup, training scheduling, and welcome package.', triggers: ['onboard', 'onboarding', 'welcome', 'new customer'], steps: [
    { id: 'wf1-s1', name: 'Create Account', agentId: 'agent-ops', inputTemplate: 'Create customer account and configure workspace', requiresApproval: false, dependsOn: [], order: 1 },
    { id: 'wf1-s2', name: 'Schedule Training', agentId: 'agent-hr', inputTemplate: 'Schedule onboarding training session with customer team', requiresApproval: false, dependsOn: ['wf1-s1'], order: 2 },
    { id: 'wf1-s3', name: 'Send Welcome Package', agentId: 'agent-marketing', inputTemplate: 'Prepare and send welcome package with brand materials', requiresApproval: true, dependsOn: ['wf1-s2'], order: 3 },
    { id: 'wf1-s4', name: 'Activate Support', agentId: 'agent-support', inputTemplate: 'Set up support channels and knowledge base access', requiresApproval: false, dependsOn: ['wf1-s1'], order: 4 },
  ], createdAt: '2025-01-01', updatedAt: '2026-06-01', runCount: 145, lastRunAt: '2026-06-28' },
  { id: 'wf-2', name: 'Hiring Pipeline', description: 'End-to-end hiring process from job posting to offer acceptance.', triggers: ['hire', 'recruit', 'hiring', 'position', 'job'], steps: [
    { id: 'wf2-s1', name: 'Create Job Description', agentId: 'agent-hr', inputTemplate: 'Draft job description and requirements', requiresApproval: false, dependsOn: [], order: 1 },
    { id: 'wf2-s2', name: 'Post to Job Boards', agentId: 'agent-hr', inputTemplate: 'Post position to 5 job boards and screen incoming applications', requiresApproval: false, dependsOn: ['wf2-s1'], order: 2 },
    { id: 'wf2-s3', name: 'Screen Candidates', agentId: 'agent-hr', inputTemplate: 'Screen resumes and shortlist qualified candidates', requiresApproval: false, dependsOn: ['wf2-s2'], order: 3 },
    { id: 'wf2-s4', name: 'Coordinate Interviews', agentId: 'agent-hr', inputTemplate: 'Schedule technical interviews with engineering team', requiresApproval: false, dependsOn: ['wf2-s3'], order: 4 },
    { id: 'wf2-s5', name: 'Prepare Offer', agentId: 'agent-ceo', inputTemplate: 'Evaluate candidates and prepare offer letter for approval', requiresApproval: true, dependsOn: ['wf2-s4'], order: 5 },
  ], createdAt: '2025-01-01', updatedAt: '2026-06-15', runCount: 23, lastRunAt: '2026-06-20' },
  { id: 'wf-3', name: 'Quarterly Budget Review', description: 'Department budget collection, variance analysis, and board-level reporting.', triggers: ['budget', 'financial review', 'quarterly review', 'budget review'], steps: [
    { id: 'wf3-s1', name: 'Collect Budget Data', agentId: 'agent-finance', inputTemplate: 'Collect Q3 budget proposals from all departments', requiresApproval: false, dependsOn: [], order: 1 },
    { id: 'wf3-s2', name: 'Variance Analysis', agentId: 'agent-finance', inputTemplate: 'Compare proposed budgets against actuals and flag variances', requiresApproval: false, dependsOn: ['wf3-s1'], order: 2 },
    { id: 'wf3-s3', name: 'Generate Report', agentId: 'agent-ceo', inputTemplate: 'Generate comprehensive budget report with recommendations', requiresApproval: false, dependsOn: ['wf3-s2'], order: 3 },
    { id: 'wf3-s4', name: 'Board Approval', agentId: 'agent-ceo', inputTemplate: 'Present budget report for board approval', requiresApproval: true, dependsOn: ['wf3-s3'], order: 4 },
  ], createdAt: '2025-03-01', updatedAt: '2026-06-10', runCount: 8, lastRunAt: '2026-06-01' },
  { id: 'wf-4', name: 'Campaign Launch', description: 'Multi-channel marketing campaign from strategy to publication.', triggers: ['campaign', 'launch', 'marketing campaign', 'content'], steps: [
    { id: 'wf4-s1', name: 'Market Research', agentId: 'agent-marketing', inputTemplate: 'Research target market and competitive positioning', requiresApproval: false, dependsOn: [], order: 1 },
    { id: 'wf4-s2', name: 'Create Campaign Assets', agentId: 'agent-marketing', inputTemplate: 'Develop campaign creative and copy for 4 channels', requiresApproval: false, dependsOn: ['wf4-s1'], order: 2 },
    { id: 'wf4-s3', name: 'Legal Review', agentId: 'agent-legal', inputTemplate: 'Review campaign assets for compliance and IP issues', requiresApproval: false, dependsOn: ['wf4-s2'], order: 3 },
    { id: 'wf4-s4', name: 'CEO Approval', agentId: 'agent-ceo', inputTemplate: 'Final campaign approval before launch', requiresApproval: true, dependsOn: ['wf4-s3'], order: 4 },
    { id: 'wf4-s5', name: 'Publish & Monitor', agentId: 'agent-marketing', inputTemplate: 'Launch campaign across all channels and monitor initial performance', requiresApproval: false, dependsOn: ['wf4-s4'], order: 5 },
  ], createdAt: '2025-06-01', updatedAt: '2026-06-20', runCount: 34, lastRunAt: '2026-06-25' },
  { id: 'wf-5', name: 'Contract Review', description: 'Supplier and partner contract review with compliance checks and risk assessment.', triggers: ['contract', 'agreement', 'review contract', 'legal review'], steps: [
    { id: 'wf5-s1', name: 'Document Analysis', agentId: 'agent-legal', inputTemplate: 'Analyze contract terms and identify key clauses', requiresApproval: false, dependsOn: [], order: 1 },
    { id: 'wf5-s2', name: 'Compliance Check', agentId: 'agent-legal', inputTemplate: 'Verify contract compliance with policies and regulations', requiresApproval: false, dependsOn: ['wf5-s1'], order: 2 },
    { id: 'wf5-s3', name: 'Risk Assessment', agentId: 'agent-legal', inputTemplate: 'Assess legal and financial risks in contract terms', requiresApproval: false, dependsOn: ['wf5-s2'], order: 3 },
    { id: 'wf5-s4', name: 'CEO Sign-off', agentId: 'agent-ceo', inputTemplate: 'Final contract review and sign-off', requiresApproval: true, dependsOn: ['wf5-s3'], order: 4 },
  ], createdAt: '2025-02-01', updatedAt: '2026-06-01', runCount: 67, lastRunAt: '2026-06-27' },
  { id: 'wf-6', name: 'Monthly Reporting', description: 'Automated monthly business report generation across all departments.', triggers: ['report', 'monthly report', 'summary', 'kpi report'], steps: [
    { id: 'wf6-s1', name: 'Collect Data', agentId: 'agent-finance', inputTemplate: 'Collect financial and operational data for the month', requiresApproval: false, dependsOn: [], order: 1 },
    { id: 'wf6-s2', name: 'Analyze KPIs', agentId: 'agent-ceo', inputTemplate: 'Analyze key metrics and identify trends and insights', requiresApproval: false, dependsOn: ['wf6-s1'], order: 2 },
    { id: 'wf6-s3', name: 'Generate Report', agentId: 'agent-ceo', inputTemplate: 'Generate monthly executive report with visualizations', requiresApproval: false, dependsOn: ['wf6-s2'], order: 3 },
    { id: 'wf6-s4', name: 'Distribute', agentId: 'agent-ops', inputTemplate: 'Distribute report to all stakeholders and archive', requiresApproval: false, dependsOn: ['wf6-s3'], order: 4 },
  ], createdAt: '2025-01-01', updatedAt: '2026-06-20', runCount: 18, lastRunAt: '2026-06-01' },
]

export function Workflows() {
  const { submitObjective, isProcessing } = useExecutionEngine()
  const agents = useAgentsStore(s => s.agents)
  const activityStore = useActivityStore()
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null)
  const [expandedSteps, setExpandedSteps] = useState<string[]>([])
  const [showRunModal, setShowRunModal] = useState(false)
  const [runInput, setRunInput] = useState('')
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDefinition | null>(null)

  const filtered = workflowDefs.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.description.toLowerCase().includes(search.toLowerCase())
  )

  function toggleSteps(id: string) {
    setExpandedSteps(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function runWorkflow(wf: WorkflowDefinition) {
    setRunningWorkflowId(wf.id)
    setSelectedWorkflow(wf)
    activityStore.addEvent({ type: 'workflow', action: `Workflow started: ${wf.name}`, detail: wf.description, severity: 'info' })

    for (const step of wf.steps) {
      const agent = agents.find(a => a.id === step.agentId)
      if (!agent) continue

      activityStore.addEvent({ type: 'workflow', action: `Executing: ${step.name}`, detail: `Assigned to ${agent.name}`, agentId: step.agentId, severity: 'info' })

      if (step.requiresApproval) {
        activityStore.addEvent({ type: 'approval', action: `Approval needed: ${step.name}`, detail: step.inputTemplate, agentId: step.agentId, severity: 'warning' })
        await new Promise(r => setTimeout(r, 1500))
      }

      await new Promise(r => setTimeout(r, 1000 + Math.random() * 500))
      activityStore.addEvent({ type: 'workflow', action: `Completed: ${step.name}`, detail: `${agent.name} completed step`, agentId: step.agentId, severity: 'success' })
    }

    activityStore.addEvent({ type: 'workflow', action: `Workflow completed: ${wf.name}`, detail: `All ${wf.steps.length} steps executed successfully`, severity: 'success' })
    setRunningWorkflowId(null)
    setSelectedWorkflow(null)
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-dark-100 tracking-tight">Workflows</h1>
          <p className="text-sm text-dark-400 mt-0.5">Pre-built business processes with interactive execution</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Create Workflow</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search workflows..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-dark-800/50 border border-dark-700 text-sm text-dark-200 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {filtered.map((wf, i) => {
          const isRunning = runningWorkflowId === wf.id
          const isExpanded = expandedSteps.includes(wf.id)
          return (
            <motion.div
              key={wf.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                'rounded-xl border bg-dark-900/50 overflow-hidden transition-all duration-200',
                isRunning ? 'border-primary-500/30' : 'border-dark-800 hover:border-dark-700',
              )}
            >
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn(
                    'p-2.5 rounded-lg',
                    isRunning ? 'bg-primary-500/10 text-primary-400' : 'bg-accent-500/10 text-accent-400',
                  )}>
                    {isRunning ? <Loader2 className="h-5 w-5 animate-spin" /> : <WorkflowIcon className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-dark-100">{wf.name}</p>
                      <Badge variant={isRunning ? 'primary' : 'default'} size="sm">
                        {isRunning ? 'Running' : `${wf.runCount} runs`}
                      </Badge>
                    </div>
                    <p className="text-xs text-dark-400 mt-0.5">{wf.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mb-3">
                  {wf.steps.slice(0, 4).map((step, si) => (
                    <React.Fragment key={step.id}>
                      <div className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-medium',
                        isRunning && selectedWorkflow?.id === wf.id && si === 0 ? 'bg-primary-500/10 text-primary-400' :
                        'bg-dark-800 text-dark-500',
                      )}>{step.name.slice(0, 12)}</div>
                      {si < wf.steps.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-dark-600 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-dark-500">
                    <Bot className="h-3.5 w-3.5" />
                    <span>{[...new Set(wf.steps.map(s => s.agentId))].length} agents</span>
                    <Clock className="h-3.5 w-3.5 ml-1" />
                    <span>{wf.steps.length} steps</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => runWorkflow(wf)}
                      disabled={isRunning}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all',
                        isRunning ? 'bg-dark-800 text-dark-500 cursor-not-allowed' :
                        'bg-primary-500 text-white hover:bg-primary-600',
                      )}
                    >
                      {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                      {isRunning ? 'Running...' : 'Run'}
                    </button>
                    <button onClick={() => toggleSteps(wf.id)}
                      className="p-1.5 rounded-lg text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-colors">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden border-t border-dark-800"
                  >
                    <div className="p-4 space-y-2">
                      <p className="text-[10px] font-semibold text-dark-500 uppercase tracking-wider mb-2">Steps</p>
                      {wf.steps.map((step, si) => {
                        const agent = agents.find(a => a.id === step.agentId)
                        return (
                          <div key={step.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-dark-800/30">
                            <div className={cn(
                              'w-5 h-5 rounded flex items-center justify-center text-[9px] font-medium shrink-0',
                              'bg-dark-800 text-dark-500',
                            )}>{si + 1}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-dark-300">{step.name}</p>
                              <div className="flex items-center gap-2">
                                {agent && <span className="text-[10px] text-dark-500">{agent.name}</span>}
                                {step.requiresApproval && (
                                  <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                                    <AlertCircle className="h-3 w-3" /> Approval
                                  </span>
                                )}
                              </div>
                            </div>
                            {step.dependsOn.length > 0 && (
                              <span className="text-[10px] text-dark-600">after step {wf.steps.findIndex(s => s.id === step.dependsOn[0]) + 1}</span>
                            )}
                          </div>
                        )
                      })}
                      <div className="flex items-center gap-1.5 pt-2 text-[10px] text-dark-500">
                        {wf.triggers.map(t => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-dark-800">trigger: {t}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
