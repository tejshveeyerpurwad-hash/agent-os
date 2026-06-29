import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Sparkles, Loader2, Columns3 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useExecutionEngine } from '@/store/executionEngine'
import { useAgentsStore } from '@/store/agentsStore'
import { CommandCenter } from '@/components/workspace/CommandCenter'
import { AgentOrchestrator } from '@/components/workspace/AgentOrchestrator'
import { WorkflowExecution } from '@/components/workspace/WorkflowExecution'
import { ExecutionTimeline } from '@/components/workspace/ExecutionTimeline'
import { AgentCommunication } from '@/components/workspace/AgentCommunication'
import { BusinessReport, generateReport } from '@/components/workspace/BusinessReport'
import { AnalyticsDashboard, generateAnalytics } from '@/components/workspace/AnalyticsDashboard'
import { NotificationCenter } from '@/components/workspace/NotificationCenter'
import { ApprovalPanel } from '@/components/execution/ApprovalPanel'

const demos = [
  'Hire two senior frontend engineers',
  'Launch Q3 marketing campaign for AI platform',
  'Prepare investor update for Q2 results',
  'Review monthly expenses across all departments',
  'Negotiate supplier agreement with TechCorp',
  'Plan product launch for platform v3',
]

export function Workspace() {
  const {
    currentExecution, isProcessing, executions,
    agentLogs, agentMessages, notifications,
    dismissNotification, markAllNotificationsRead,
    executionCount, successCount,
  } = useExecutionEngine()
  const agents = useAgentsStore(s => s.agents)
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [recentPrompts, setRecentPrompts] = useState<{ text: string; time: string }[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  const handleSubmit = useCallback((prompt: string) => {
    useExecutionEngine.getState().submitObjective(prompt)
    setRecentPrompts(prev => [
      { text: prompt, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...prev.slice(0, 9),
    ])
  }, [])

  const handleSuggestion = useCallback((prompt: string) => {
    handleSubmit(prompt)
  }, [handleSubmit])

  const reportData = useMemo(() => {
    if (currentExecution?.phase === 'completed' && currentExecution.plan) {
      const agentIds = [...new Set(currentExecution.plan.subtasks.map(s => s.agentId))]
      return generateReport(
        currentExecution.objective,
        currentExecution.completedCount,
        currentExecution.totalCount,
        agentIds.length,
      )
    }
    return null
  }, [currentExecution?.phase, currentExecution?.completedCount])

  const analyticsData = useMemo(() => {
    if (executionCount > 0) {
      return generateAnalytics(executionCount, successCount)
    }
    return null
  }, [executionCount, successCount])

  const timelineHistory = currentExecution?.history || []

  useEffect(() => {
    if (isProcessing && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [currentExecution?.phase, isProcessing])

  return (
    <div className="flex flex-col h-full overflow-hidden bg-surface">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Agent Orchestrator */}
        <AnimatePresence mode="wait">
          {leftPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="shrink-0 border-r border-border-light bg-surface-alt/50 overflow-hidden"
            >
              <AgentOrchestrator agents={agents} agentLogs={agentLogs} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center: Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Panel Toggle Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-border-light bg-surface-alt/30">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                className={cn(
                  'p-1 rounded-lg transition-all',
                  leftPanelOpen ? 'text-primary-400 bg-primary-500/10' : 'text-dark-500 hover:text-dark-300 hover:bg-dark-800/50',
                )}
                title={leftPanelOpen ? 'Hide agents' : 'Show agents'}
              >
                <Columns3 className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] text-dark-500 ml-1">
                {currentExecution
                  ? currentExecution.objective.slice(0, 50) + (currentExecution.objective.length > 50 ? '...' : '')
                  : 'AI Workspace'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isProcessing && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex items-center gap-1.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[9px] text-emerald-400">Processing</span>
                </motion.div>
              )}
              <button
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
                className={cn(
                  'p-1 rounded-lg transition-all',
                  rightPanelOpen ? 'text-primary-400 bg-primary-500/10' : 'text-dark-500 hover:text-dark-300 hover:bg-dark-800/50',
                )}
                title={rightPanelOpen ? 'Hide notifications' : 'Show notifications'}
              >
                <Columns3 className="h-3.5 w-3.5 rotate-180" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4">
              {/* Command Center */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CommandCenter
                  onSubmit={handleSubmit}
                  isProcessing={isProcessing}
                  recentPrompts={recentPrompts}
                  onSuggestion={handleSuggestion}
                />
              </motion.div>

              {/* Empty State */}
              {!currentExecution && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500/20 to-primary-600/5 border border-primary-500/10 flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <Terminal className="h-10 w-10 text-primary-400" />
                  </div>
                  <h2 className="text-xl font-bold text-dark-100 mb-2">AI Command Center</h2>
                  <p className="text-sm text-dark-500 max-w-xl mx-auto leading-relaxed mb-8">
                    Enter a business objective in natural language. The orchestrator will plan, decompose, assign agents, execute in parallel, and generate an executive report — all in real time.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                    {demos.map((ex, i) => (
                      <motion.button
                        key={ex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => handleSubmit(ex)}
                        className="px-3.5 py-2 rounded-xl bg-dark-800/50 border border-border-light text-xs text-dark-400 hover:text-dark-200 hover:border-primary-500/30 hover:bg-primary-500/[0.02] transition-all"
                      >
                        {ex}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Active Execution Content */}
              {currentExecution && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {/* Workflow Execution Pipeline */}
                  <WorkflowExecution
                    phase={currentExecution.phase}
                    completedCount={currentExecution.completedCount}
                    totalCount={currentExecution.totalCount}
                    objective={currentExecution.objective}
                  />

                  {/* Execution Timeline */}
                  <ExecutionTimeline
                    history={timelineHistory}
                    isActive={isProcessing}
                  />

                  {/* Agent Communication */}
                  <AgentCommunication
                    messages={agentMessages}
                    isActive={isProcessing}
                  />

                  {/* Business Report */}
                  {currentExecution.phase === 'completed' && (
                    <BusinessReport
                      data={reportData}
                      isGenerating={false}
                      objective={currentExecution.objective}
                    />
                  )}

                  {/* Result */}
                  {currentExecution.phase === 'completed' && currentExecution.result && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.03] to-transparent p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/20">
                          <Sparkles className="h-4 w-4 text-emerald-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-emerald-400">Execution Result</h3>
                      </div>
                      <pre className="text-xs text-dark-300 whitespace-pre-wrap font-sans leading-relaxed break-words">
                        {currentExecution.result}
                      </pre>
                    </motion.div>
                  )}

                  {/* Processing State */}
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-xs text-dark-500 justify-center py-4"
                    >
                      <Loader2 className="h-4 w-4 animate-spin text-primary-400" />
                      Processing objective...
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Recent Executions */}
              {executions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border-light bg-surface-elevated/60 overflow-hidden"
                >
                  <div className="px-4 py-2.5 border-b border-border-light">
                    <h3 className="text-xs font-semibold text-dark-300">Recent Executions</h3>
                  </div>
                  <div className="divide-y divide-border-light max-h-[200px] overflow-y-auto">
                    {executions.slice(0, 10).map((ex, i) => (
                      <motion.div
                        key={ex.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="px-4 py-2.5 flex items-center justify-between hover:bg-dark-800/20 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={cn(
                            'p-1 rounded-lg',
                            ex.phase === 'completed' ? 'bg-emerald-500/10' : ex.phase === 'failed' ? 'bg-red-500/10' : 'bg-dark-800',
                          )}>
                            <Terminal className={cn(
                              'h-3 w-3',
                              ex.phase === 'completed' ? 'text-emerald-400' : ex.phase === 'failed' ? 'text-red-400' : 'text-dark-500',
                            )} />
                          </div>
                          <p className="text-xs text-dark-400 truncate max-w-[300px]">{ex.objective}</p>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-dark-600 shrink-0">
                          <span>{ex.completedCount}/{ex.totalCount} tasks</span>
                          <span className="text-dark-700">·</span>
                          <span>{new Date(ex.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Approval Panel */}
          <ApprovalPanel />
        </div>

        {/* Right Panel: Notifications + Analytics */}
        <AnimatePresence mode="wait">
          {rightPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="shrink-0 border-l border-border-light bg-surface-alt/50 overflow-hidden flex flex-col"
            >
              {/* Notifications */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <NotificationCenter
                  notifications={notifications}
                  onDismiss={dismissNotification}
                  onMarkAllRead={markAllNotificationsRead}
                  isLive={isProcessing || notifications.length > 0}
                />
              </div>

              {/* Analytics */}
              <div className="shrink-0 border-t border-border-light">
                <AnalyticsDashboard data={analyticsData} isLive={isProcessing} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
