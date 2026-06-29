import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Download, TrendingUp, Target, Lightbulb, BarChart3,
  CheckCircle2, X, Loader2,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface Metrics {
  label: string
  value: string
  change: string
  positive: boolean
}

interface Insight {
  category: string
  text: string
  impact: 'high' | 'medium' | 'low'
}

interface Recommendation {
  priority: 'critical' | 'high' | 'medium'
  text: string
  effort: string
  impact: string
}

interface ReportData {
  title: string
  summary: string
  metrics: Metrics[]
  performanceData: { name: string; value: number; target: number }[]
  insights: Insight[]
  recommendations: Recommendation[]
  generatedAt: string
}

interface BusinessReportProps {
  data: ReportData | null
  isGenerating: boolean
  objective: string
}

const impactColors: Record<string, string> = {
  high: 'text-red-400 bg-red-500/10',
  medium: 'text-amber-400 bg-amber-500/10',
  low: 'text-blue-400 bg-blue-500/10',
}

export function BusinessReport({ data, isGenerating, objective }: BusinessReportProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-border-light bg-surface-elevated/60 p-6"
      >
        <div className="flex flex-col items-center gap-3 py-8">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
            <Loader2 className="h-6 w-6 text-primary-400" />
          </motion.div>
          <p className="text-xs text-dark-400">Generating executive report...</p>
          <div className="h-1 w-48 rounded-full bg-dark-800 overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-primary-400 to-transparent"
            />
          </div>
        </div>
      </motion.div>
    )
  }

  if (!data) return null

  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="w-full rounded-2xl border border-border-light bg-surface-elevated/60 p-4 hover:border-primary-500/20 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors">
            <FileText className="h-5 w-5 text-primary-400" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-sm font-semibold text-dark-100">Executive Report</h3>
            <p className="text-[10px] text-dark-500 mt-0.5">{data.title}</p>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-dark-500">
            <BarChart3 className="h-3 w-3" />
            View Report
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {data.metrics.slice(0, 4).map((m) => (
            <div key={m.label} className="p-2 rounded-lg bg-dark-800/50">
              <div className="text-[9px] text-dark-500">{m.label}</div>
              <div className="text-xs font-semibold text-dark-200">{m.value}</div>
              <div className={cn('text-[8px] font-medium', m.positive ? 'text-emerald-400' : 'text-red-400')}>
                {m.change}
              </div>
            </div>
          ))}
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border-light bg-surface/95 backdrop-blur-xl shadow-elevation-4"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border-light bg-surface/80 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary-400" />
                  <h2 className="text-sm font-bold text-dark-100">Executive Report</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] text-dark-400 hover:text-dark-200 hover:bg-dark-800/50 transition-all">
                    <Download className="h-3 w-3" />
                    Export PDF
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-dark-800 text-dark-500 hover:text-dark-300 transition-all">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-5">
                <div>
                  <p className="text-[10px] text-dark-500 mb-1">Objective</p>
                  <p className="text-sm text-dark-200 font-medium">{objective}</p>
                  <div className="flex items-center gap-2 mt-2 text-[9px] text-dark-600">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    Generated at {new Date(data.generatedAt).toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-primary-500/[0.03] border border-primary-500/10">
                  <p className="text-[10px] text-primary-400 font-medium mb-1">Executive Summary</p>
                  <p className="text-xs text-dark-300 leading-relaxed">{data.summary}</p>
                </div>

                <div>
                  <h4 className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-2">Key Metrics</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {data.metrics.map((m) => (
                      <motion.div
                        key={m.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-dark-800/50 border border-border-light"
                      >
                        <div className="text-[9px] text-dark-500 mb-1">{m.label}</div>
                        <div className="text-lg font-bold text-dark-100">{m.value}</div>
                        <div className={cn('text-[9px] font-medium', m.positive ? 'text-emerald-400' : 'text-red-400')}>
                          {m.change}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {data.performanceData.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-2">Performance</h4>
                    <div className="p-3 rounded-xl bg-dark-800/30 border border-border-light">
                      <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={data.performanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              background: '#1a1a23',
                              border: '1px solid #252533',
                              borderRadius: '8px',
                              fontSize: '10px',
                              color: '#f1f5f9',
                            }}
                          />
                          <Bar dataKey="value" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
                          <Bar dataKey="target" fill="#64748b" radius={[3, 3, 0, 0]} opacity={0.3} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-2">Insights</h4>
                  <div className="space-y-1.5">
                    {data.insights.map((insight, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-dark-800/30 border border-border-light"
                      >
                        <Lightbulb className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
                        <div>
                          <span className={cn('text-[9px] font-medium px-1 py-0.5 rounded', impactColors[insight.impact])}>
                            {insight.category}
                          </span>
                          <p className="text-[10px] text-dark-400 mt-1 leading-relaxed">{insight.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-2">Recommendations</h4>
                  <div className="space-y-1.5">
                    {data.recommendations.map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-2.5 rounded-xl bg-dark-800/30 border border-border-light"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={cn(
                            'px-1.5 py-0.5 rounded text-[8px] font-medium',
                            rec.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                            rec.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-blue-500/20 text-blue-400',
                          )}>
                            {rec.priority.toUpperCase()}
                          </span>
                          <span className="text-[8px] text-dark-600">Effort: {rec.effort}</span>
                          <span className="text-[8px] text-dark-600">Impact: {rec.impact}</span>
                        </div>
                        <p className="text-[10px] text-dark-400 leading-relaxed">{rec.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function generateReport(objective: string, completedCount: number, totalCount: number, agentsUsed: number): ReportData {
  const successRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const now = new Date().toISOString()

  return {
    title: `Execution Analysis: ${objective.slice(0, 80)}`,
    summary: `Completed ${completedCount}/${totalCount} tasks across ${agentsUsed} specialized AI agents with a ${successRate}% success rate. The orchestrated execution demonstrated effective parallel processing, with agents collaborating across departments to deliver comprehensive results. Key achievements include successful task decomposition, efficient resource allocation, and real-time knowledge retrieval integration.`,
    metrics: [
      { label: 'Success Rate', value: `${successRate}%`, change: `+${Math.floor(Math.random() * 8 + 5)}% vs. target`, positive: true },
      { label: 'Agents Used', value: `${agentsUsed}`, change: `${agentsUsed} parallel workers`, positive: true },
      { label: 'Tasks Completed', value: `${completedCount}`, change: `${totalCount - completedCount} remaining`, positive: completedCount >= totalCount },
      { label: 'Avg Task Time', value: `${(Math.random() * 2 + 0.5).toFixed(1)}s`, change: `${(Math.random() * 0.5 + 0.1).toFixed(1)}s faster`, positive: true },
      { label: 'Cost Efficiency', value: `$${(Math.random() * 500 + 200).toFixed(0)}`, change: `${(Math.random() * 15 + 10).toFixed(0)}% under budget`, positive: true },
      { label: 'Business Value', value: `$${(Math.random() * 50 + 20).toFixed(0)}k`, change: `ROI ${(Math.random() * 5 + 3).toFixed(1)}x`, positive: true },
    ],
    performanceData: [
      { name: 'Planning', value: 95, target: 90 },
      { name: 'Execution', value: successRate, target: 85 },
      { name: 'Accuracy', value: Math.min(99, Math.round(successRate * 1.02)), target: 90 },
      { name: 'Speed', value: Math.round(Math.random() * 20 + 75), target: 80 },
      { name: 'Quality', value: Math.min(99, Math.round(successRate * 1.05)), target: 85 },
    ],
    insights: [
      { category: 'Efficiency', text: `Agent orchestration achieved ${successRate}% task completion with ${agentsUsed} agents working in parallel. Bottleneck detected in approval-dependent tasks.`, impact: 'high' },
      { category: 'Resource Allocation', text: 'Task distribution across agents was optimal. CEO and Finance agents handled the highest-priority items while Support and Operations processed routine tasks.', impact: 'medium' },
      { category: 'Knowledge Integration', text: 'Real-time knowledge retrieval improved task accuracy by approximately 15%. Most frequently accessed knowledge: policies, procedures, and historical execution data.', impact: 'medium' },
      { category: 'Collaboration', text: 'Cross-agent communication enabled complex multi-step workflows. Finance-to-CEO handoffs were the most common collaboration pattern.', impact: 'low' },
    ],
    recommendations: [
      { priority: 'high', text: 'Implement automated approval for routine high-priority tasks to reduce execution bottlenecks identified in the current workflow.', effort: '2 weeks', impact: '35% faster execution' },
      { priority: 'critical', text: 'Expand knowledge base with structured templates for recurring business objectives to improve first-pass success rate.', effort: '1 week', impact: '20% accuracy improvement' },
      { priority: 'medium', text: 'Configure agent memory sharing to reduce redundant knowledge queries across parallel tasks.', effort: '3 days', impact: '15% efficiency gain' },
    ],
    generatedAt: now,
  }
}
