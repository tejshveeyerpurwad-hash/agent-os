import { create } from 'zustand'
import { useActivityStore } from './activityStore'
import { useKnowledgeStore } from './knowledgeStore'
import type { AgentStatus } from '@/types/agent'

export interface AgentState {
  id: string
  name: string
  role: string
  description: string
  status: AgentStatus
  capabilities: string[]
  confidence: number
  currentTask: string | null
  lastAction: string
  memory: string[]
  taskCount: number
  successRate: number
}

const defaultAgents: AgentState[] = [
  { id: 'agent-ceo', name: 'CEOArya', role: 'CEO Agent', description: 'Strategic decision-making, executive summaries, market intelligence, and board-level reporting. Approves high-impact decisions and quarterly strategies.', status: 'idle', capabilities: ['strategy', 'planning', 'approval', 'reporting', 'analysis'], confidence: 96, currentTask: null, lastAction: 'Generated weekly executive summary', memory: ['Approved Q3 strategy', 'Reviewed budget allocations', 'Board meeting scheduled'], taskCount: 847, successRate: 97 },
  { id: 'agent-hr', name: 'HRBot', role: 'HR Agent', description: 'Talent acquisition, employee engagement, performance reviews, and organizational development. Manages the full hiring pipeline.', status: 'idle', capabilities: ['recruiting', 'onboarding', 'reviews', 'hiring', 'engagement'], confidence: 92, currentTask: null, lastAction: 'Shortlisted 14 candidates for Senior Engineer', memory: ['Hiring: Senior Engineer role active', 'Q2 performance reviews completed', '3 new offers extended'], taskCount: 2341, successRate: 94 },
  { id: 'agent-finance', name: 'FinanceAI', role: 'Finance Agent', description: 'Real-time financial analysis, forecasting, budget optimization, invoice processing, and compliance monitoring.', status: 'idle', capabilities: ['analysis', 'forecasting', 'budgeting', 'invoicing', 'compliance'], confidence: 98, currentTask: null, lastAction: 'Approved $240k Q3 marketing budget', memory: ['Q3 budget approved: $2.5M', 'TechCorp invoice paid', 'Expense anomaly flagged in R&D'], taskCount: 5632, successRate: 99 },
  { id: 'agent-sales', name: 'SalesPro', role: 'Sales Agent', description: 'Lead scoring, pipeline management, prospect intelligence, contract negotiation, and revenue forecasting.', status: 'idle', capabilities: ['scoring', 'pipeline', 'negotiation', 'forecasting', 'outreach'], confidence: 89, currentTask: null, lastAction: 'Closed $85k TechCorp deal', memory: ['TechCorp deal closed Q2', 'Pipeline value: $1.2M', '3 enterprise leads in negotiation'], taskCount: 4123, successRate: 91 },
  { id: 'agent-marketing', name: 'MarketGenius', role: 'Marketing Agent', description: 'Campaign optimization, audience segmentation, content strategy, multi-channel analytics, and brand management.', status: 'idle', capabilities: ['campaigns', 'content', 'analytics', 'seo', 'social'], confidence: 93, currentTask: null, lastAction: 'Published product launch campaign across 4 channels', memory: ['Q3 campaign in progress', '240k impressions this week', 'Content calendar updated'], taskCount: 3124, successRate: 95 },
  { id: 'agent-ops', name: 'OpsBot', role: 'Operations Agent', description: 'Process optimization, resource allocation, supply chain intelligence, workflow automation, and scheduling.', status: 'idle', capabilities: ['optimization', 'scheduling', 'automation', 'monitoring', 'coordination'], confidence: 91, currentTask: null, lastAction: 'Optimized production schedule (12% efficiency gain)', memory: ['Production schedule optimized', 'Resource allocation updated', 'Monitoring dashboards active'], taskCount: 2876, successRate: 93 },
  { id: 'agent-legal', name: 'LegalShield', role: 'Legal Agent', description: 'Contract review, compliance monitoring, risk assessment, regulatory documentation, and intellectual property.', status: 'idle', capabilities: ['contracts', 'compliance', 'risk', 'review', 'ip'], confidence: 95, currentTask: null, lastAction: 'Reviewed supplier agreement (3 clauses flagged)', memory: ['TechCorp contract reviewed', 'Supplier agreement flagged', 'Compliance audit scheduled'], taskCount: 1567, successRate: 98 },
  { id: 'agent-support', name: 'SupportBot', role: 'Support Agent', description: 'Intelligent ticket routing, knowledge base retrieval, sentiment analysis, automated resolution, and customer satisfaction.', status: 'idle', capabilities: ['tickets', 'kb', 'sentiment', 'automation', 'csat'], confidence: 90, currentTask: null, lastAction: 'Resolved 26 tickets (94% satisfaction)', memory: ['26 tickets resolved today', 'KB article updated', 'CSAT score: 94%'], taskCount: 8921, successRate: 96 },
]

interface AgentsState {
  agents: AgentState[]
}

interface AgentsActions {
  getAgent: (id: string) => AgentState | undefined
  setAgentStatus: (id: string, status: AgentStatus) => void
  setAgentTask: (id: string, task: string | null) => void
  setAgentAction: (id: string, action: string) => void
  addMemory: (id: string, memory: string) => void
  incrementTasks: (id: string) => void
  executeTask: (agentId: string, taskDescription: string) => Promise<string>
  resetAll: () => void
}

export const useAgentsStore = create<AgentsState & AgentsActions>((set, get) => ({
  agents: defaultAgents,

  getAgent: (id) => get().agents.find(a => a.id === id),

  setAgentStatus: (id, status) => set(state => ({
    agents: state.agents.map(a => a.id === id ? { ...a, status } : a),
  })),

  setAgentTask: (id, task) => set(state => ({
    agents: state.agents.map(a => a.id === id ? { ...a, currentTask: task } : a),
  })),

  setAgentAction: (id, action) => set(state => ({
    agents: state.agents.map(a => a.id === id ? { ...a, lastAction: action } : a),
  })),

  addMemory: (id, memory) => set(state => ({
    agents: state.agents.map(a =>
      a.id === id ? { ...a, memory: [memory, ...a.memory].slice(0, 10) } : a
    ),
  })),

  incrementTasks: (id) => set(state => ({
    agents: state.agents.map(a =>
      a.id === id ? { ...a, taskCount: a.taskCount + 1 } : a
    ),
  })),

  executeTask: async (agentId, taskDescription) => {
    const agent = get().agents.find(a => a.id === agentId)
    if (!agent) return ''

    set(state => ({
      agents: state.agents.map(a =>
        a.id === agentId ? { ...a, status: 'running', currentTask: taskDescription } : a
      ),
    }))

    const activityStore = useActivityStore.getState()
    activityStore.addEvent({
      type: 'agent',
      action: `${agent.name} started task`,
      detail: taskDescription,
      agentId,
      severity: 'info',
    })

    const knowledgeStore = useKnowledgeStore.getState()
    const relevantDocs = knowledgeStore.searchQuery
      ? knowledgeStore.searchResults
      : knowledgeStore.items.filter(item =>
          item.content.toLowerCase().includes(taskDescription.toLowerCase().split(' ').slice(0, 3).join(' ')) ||
          item.tags.some(t => taskDescription.toLowerCase().includes(t.toLowerCase()))
        )

    const knowledgeContext = relevantDocs.length > 0
      ? relevantDocs.slice(0, 3).map(d => `${d.title}: ${d.content.slice(0, 200)}`).join('\n')
      : 'No directly relevant knowledge found.'

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))

    const result = generateAgentResult(agentId, taskDescription, knowledgeContext)

    set(state => ({
      agents: state.agents.map(a =>
        a.id === agentId ? {
          ...a,
          status: 'idle',
          currentTask: null,
          lastAction: `${taskDescription.slice(0, 80)}`,
          taskCount: a.taskCount + 1,
        } : a
      ),
    }))

    activityStore.addEvent({
      type: 'agent',
      action: `${agent.name} completed task`,
      detail: result,
      agentId,
      severity: 'success',
    })

    get().addMemory(agentId, `${taskDescription} → ${result.slice(0, 100)}`)

    return result
  },

  resetAll: () => set({ agents: defaultAgents }),
}))

function generateAgentResult(agentId: string, task: string, context: string): string {
  const taskLower = task.toLowerCase()
  switch (agentId) {
    case 'agent-ceo':
      if (taskLower.includes('report') || taskLower.includes('summary'))
        return `Weekly executive summary generated. Key insights: Revenue up 18% MoM, 2 enterprise deals in pipeline, platform v3 on track for Q3. Board-ready PDF attached.`
      if (taskLower.includes('strategy') || taskLower.includes('plan'))
        return `Strategic analysis complete. Recommended: focus on enterprise segment, expand AI agent capabilities, hire 3 senior engineers. ROI projection: 340% over 12 months.`
      return `Decision analysis complete. Evaluated 4 options using weighted criteria. Recommended path prepared with risk assessment and mitigation plan.`
    case 'agent-hr':
      if (taskLower.includes('hire') || taskLower.includes('recruit') || taskLower.includes('candidate'))
        return `Sourcing pipeline established. Posted to 5 job boards. 14 candidates pre-screened. 4 qualified for technical interview. Offer range: $150-180k. ETA: 3 weeks.`
      if (taskLower.includes('review') || taskLower.includes('performance'))
        return `Performance review cycle initiated. 3 pending reviews. Templates generated. Manager calibration session scheduled.`
      return `HR task executed. Employee records updated. Policy compliance verified. All documentation filed.`
    case 'agent-finance':
      if (taskLower.includes('budget') || taskLower.includes('approve'))
        return `Budget approved and allocated. Funds distributed across departments. Variance thresholds set. Monthly review scheduled.`
      if (taskLower.includes('invoice') || taskLower.includes('payment'))
        return `Invoice processed. Verified against PO and contract terms. Payment initiated. Transaction recorded in general ledger.`
      if (taskLower.includes('forecast') || taskLower.includes('projection'))
        return `Financial forecast updated. Q3 revenue projection: $4.2M (+22% QoQ). Cash runway: 18 months. Key risks identified and modeled.`
      return `Financial analysis complete. All transactions reconciled. No anomalies detected. Reports generated and archived.`
    case 'agent-sales':
      if (taskLower.includes('lead') || taskLower.includes('pipeline'))
        return `Pipeline scored and prioritized. 23 new leads: 8 hot, 10 warm, 5 cold. Top 3 opportunities: TechCorp ($85k), DataFlow ($48k), CloudSync ($120k).`
      if (taskLower.includes('deal') || taskLower.includes('close'))
        return `Deal analysis complete. Contract terms finalized. Win probability: 87%. Recommended discount: 12% for multi-year commitment.`
      if (taskLower.includes('forecast'))
        return `Revenue forecast generated. Q3 projected: $1.8M. Q4 projected: $2.4M. Annual target: 72% achieved. Growth rate: +25% QoQ.`
      return `Sales task completed. CRM updated. Next actions identified. Follow-up sequences triggered.`
    case 'agent-marketing':
      if (taskLower.includes('campaign'))
        return `Campaign strategy developed. 4-channel approach: LinkedIn, Twitter, Email, Blog. Target: 500k impressions. Budget: $85,000. Timeline: 6 weeks. Content calendar attached.`
      if (taskLower.includes('content') || taskLower.includes('publish'))
        return `Content published across channels. Performance: 45k impressions, 2.1k clicks, 3.2% CTR. Above benchmark by 18%. Engagement rate: 4.7%.`
      if (taskLower.includes('analytics') || taskLower.includes('report'))
        return `Marketing analytics report generated. Channel performance: LinkedIn (34%), Twitter (28%), Email (22%), Blog (16%). Top content: 'AI for Enterprise' guide. Recommendations attached.`
      return `Marketing task completed. Brand guidelines followed. All channels updated. Performance metrics tracked.`
    case 'agent-ops':
      if (taskLower.includes('schedule') || taskLower.includes('optimize'))
        return `Schedule optimized. Resource allocation balanced. 12% efficiency gain achieved. Bottlenecks resolved. Shift coverage: 100%.`
      if (taskLower.includes('monitor') || taskLower.includes('alert'))
        return `Monitoring dashboards updated. All systems operational. 0 alerts in last 24h. Response time: p95 < 200ms. uptime: 99.97%.`
      if (taskLower.includes('coordinate') || taskLower.includes('automate'))
        return `Process automated. Manual steps reduced from 8 to 3. Estimated time savings: 14 hours/week. Implementation complete and stable.`
      return `Operations task completed. Processes streamlined. Metrics recorded. Recommendations for further optimization documented.`
    case 'agent-legal':
      if (taskLower.includes('contract') || taskLower.includes('agreement'))
        return `Contract reviewed. 3 clauses flagged for revision: liability cap (too low), termination notice (30d → 60d recommended), data processing (GDPR compliance gap).`
      if (taskLower.includes('compliance') || taskLower.includes('audit'))
        return `Compliance check complete. All regulatory requirements met. GDPR: compliant. SOC 2: audit scheduled. Data retention: policy updated.`
      if (taskLower.includes('ip') || taskLower.includes('patent'))
        return `IP assessment complete. 2 patent filings recommended. Trademark portfolio reviewed. No infringement risks identified.`
      return `Legal review complete. Risk assessment: low. All documentation filed and archived. Standard terms applied.`
    case 'agent-support':
      if (taskLower.includes('ticket') || taskLower.includes('resolve'))
        return `${Math.floor(Math.random() * 15) + 10} tickets processed. Resolution rate: 94%. Avg response: < 2min. CSAT: 4.8/5. Escalations: 3 (handled).`
      if (taskLower.includes('kb') || taskLower.includes('knowledge'))
        return `KB article updated. 3 new articles created. Search accuracy improved by 15%. Top queries all have matches.`
      if (taskLower.includes('sentiment'))
        return `Sentiment analysis complete. Overall: positive (78%). Negative trends: billing (12%), feature requests (8%). Action items generated for product team.`
      return `Support completed. All queues cleared. SLA compliance: 100%. Customer satisfaction tracked and reported.`
    default:
      return `Task "${task}" processed successfully.`
  }
}
