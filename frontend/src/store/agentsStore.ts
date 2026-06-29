import { create } from 'zustand'
import { useActivityStore } from './activityStore'
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
  getAgentsForTask: (taskDescription: string) => string[]
  executeTask: (agentId: string, taskDescription: string, executionId?: string) => Promise<string>
  executeTaskSync: (agentId: string, taskDescription: string, executionId?: string) => { result: string; log: { timestamp: string; action: string; detail: string; severity: 'info' | 'success' | 'warning' | 'error' }[] }
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

  getAgentsForTask: (taskDescription) => {
    const desc = taskDescription.toLowerCase()
    if (desc.includes('ceo') || desc.includes('approv') || desc.includes('strategy') || desc.includes('board') || desc.includes('executive') || desc.includes('summary')) return ['agent-ceo']
    if (desc.includes('hr') || desc.includes('hire') || desc.includes('recruit') || desc.includes('interview') || desc.includes('candidate') || desc.includes('offer') || desc.includes('onboard') || desc.includes('job')) return ['agent-hr']
    if (desc.includes('finance') || desc.includes('budget') || desc.includes('invoice') || desc.includes('cost') || desc.includes('financial') || desc.includes('revenue') || desc.includes('expense') || desc.includes('forecast')) return ['agent-finance']
    if (desc.includes('sales') || desc.includes('lead') || desc.includes('deal') || desc.includes('pipeline') || desc.includes('client') || desc.includes('proposal') || desc.includes('revenue')) return ['agent-sales']
    if (desc.includes('market') || desc.includes('campaign') || desc.includes('content') || desc.includes('social') || desc.includes('brand') || desc.includes('promotion') || desc.includes('announcement')) return ['agent-marketing']
    if (desc.includes('ops') || desc.includes('operation') || desc.includes('process') || desc.includes('workflow') || desc.includes('schedule') || desc.includes('automate') || desc.includes('coordinate') || desc.includes('workstation')) return ['agent-ops']
    if (desc.includes('legal') || desc.includes('contract') || desc.includes('compliance') || desc.includes('regulatory') || desc.includes('risk') || desc.includes('ip') || desc.includes('agreement')) return ['agent-legal']
    if (desc.includes('support') || desc.includes('ticket') || desc.includes('csat') || desc.includes('help') || desc.includes('issue') || desc.includes('resolve') || desc.includes('faq')) return ['agent-support']
    return ['agent-ceo']
  },

  executeTask: async (agentId, taskDescription, _executionId) => {
    const agent = get().agents.find(a => a.id === agentId)
    if (!agent) return ''

    const activityStore = useActivityStore.getState()

    set(state => ({
      agents: state.agents.map(a =>
        a.id === agentId ? { ...a, status: 'running', currentTask: taskDescription } : a
      ),
    }))

    activityStore.addEvent({
      type: 'agent',
      action: `${agent.name} started: ${truncate(taskDescription, 60)}`,
      detail: taskDescription,
      agentId,
      executionId: _executionId,
      severity: 'info',
    })

    await new Promise(r => setTimeout(r, 800 + Math.random() * 600))

    const result = generateAgentResult(agentId, taskDescription)

    set(state => ({
      agents: state.agents.map(a =>
        a.id === agentId ? {
          ...a,
          status: 'idle',
          currentTask: null,
          lastAction: truncate(taskDescription, 80),
          taskCount: a.taskCount + 1,
          confidence: Math.min(99, a.confidence + Math.floor(Math.random() * 3) - 1),
        } : a
      ),
    }))

    activityStore.addEvent({
      type: 'agent',
      action: `${agent.name} completed: ${truncate(taskDescription, 60)}`,
      detail: result,
      agentId,
      executionId: _executionId,
      severity: 'success',
    })

    get().addMemory(agentId, `${truncate(taskDescription, 60)} → ${truncate(result, 100)}`)

    return result
  },

  executeTaskSync: (agentId, taskDescription, _executionId) => {
    const agent = get().agents.find(a => a.id === agentId)
    const result = agent ? generateAgentResult(agentId, taskDescription) : ''

    const log = [{
      timestamp: new Date().toISOString(),
      action: `${agent?.name || 'Agent'} executed task`,
      detail: taskDescription,
      severity: 'success' as const,
    }]

    get().addMemory(agentId, `${truncate(taskDescription, 60)} → ${truncate(result, 100)}`)

    return { result, log }
  },

  resetAll: () => set({ agents: defaultAgents }),
}))

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + '...' : s
}

function generateAgentResult(agentId: string, task: string): string {
  const t = task.toLowerCase()
  switch (agentId) {
    case 'agent-ceo': {
      if (t.includes('hire') || t.includes('headcount'))
        return 'Headcount approved for 2 frontend engineers. Budget confirmed: $300k total compensation. Priority: High. Timeline: Fill within 6 weeks. Executive sponsorship assigned.'
      if (t.includes('campaign') || t.includes('launch') || t.includes('strategy'))
        return 'Campaign strategy reviewed and approved. Q3 marketing investment: $85,000. Key markets: Enterprise, Mid-Market. Success metrics: 500k impressions, 15% engagement rate, 200 qualified leads.'
      if (t.includes('investor') || t.includes('update'))
        return 'Investor update approved. Key messages: Revenue growth 22% QoQ, 3 enterprise customers added, platform v3 launching Q3, cash runway extended to 18 months. Distribution list confirmed.'
      if (t.includes('expense') || t.includes('budget') || t.includes('review'))
        return 'Expense report reviewed. Total: $342k. Variances in R&D (+$12k over budget) and Marketing (-$8k under budget). Recommendations: Approve R&D variance for headcount costs. Documented and filed.'
      if (t.includes('approv') || t.includes('sign-off'))
        return 'Approved. Decision rationale documented. Risk assessment: Low. Impact: Positive. Implementation: Proceed immediately with execution plan.'
      if (t.includes('summary') || t.includes('report'))
        return 'Executive summary generated. Highlights: Revenue $4.2M (+22% QoQ), 847 agent-assisted tasks completed, 3 enterprise wins, platform uptime 99.97%. Board-ready format.'
      if (t.includes('offer') || t.includes('salary'))
        return 'Offer package approved. Salary: $165k base + equity. Sign-on bonus: $20k. Start date: negotiable within 30 days. Reporting structure: VP Engineering.'
      return 'Analysis complete. 4 strategic options evaluated using weighted decision matrix. Recommended path: Proceed with confidence. Risk mitigation plan attached.'
    }

    case 'agent-hr': {
      if (t.includes('job') || t.includes('description'))
        return 'Job descriptions created for 2 frontend engineer positions. Requirements: 5+ years React/TypeScript, experience with state management, testing frameworks. Salary range: $150-180k. Posted to LinkedIn, Indeed, Glassdoor.'
      if (t.includes('screen') || t.includes('candidate') || t.includes('application'))
        return '14 applications screened. 6 candidates shortlisted for technical interview. Screening criteria: 5+ years experience, React/TypeScript expertise, system design skills. Rejected 8 (skill mismatch). Interview slots scheduled.'
      if (t.includes('interview') || t.includes('coordinator'))
        return 'Technical interviews coordinated for 4 shortlisted candidates. Panel: VP Engineering, Tech Lead, Senior Engineer. Format: 45-min coding challenge + 30-min system design. Feedback collected from all panelists.'
      if (t.includes('offer') || t.includes('extend') || t.includes('negotiation'))
        return 'Offer extended to top candidate. Base: $165k + equity (0.15%). Sign-on: $20k. Candidate requested 48 hours to review. Backup candidate identified and ready for second round.'
      if (t.includes('onboard') || t.includes('announce'))
        return 'Onboarding plan prepared. Day 1: Equipment setup, system access, team introductions. Week 1: Codebase overview, dev environment setup, first PR. Month 1: Feature ownership, on-call rotation, performance review kickoff.'
      if (t.includes('performance') || t.includes('review'))
        return 'Performance review cycle initiated. 8 employees scheduled. Templates generated. Manager calibration session: Friday 2pm. Review deadline: end of month.'
      return 'HR process completed. Employee records updated. Compliance verified. All documentation filed according to policy.'
    }

    case 'agent-finance': {
      if (t.includes('budget') || t.includes('allocat'))
        return 'Budget allocation confirmed: 2 frontend engineer positions ($300k). Source: Engineering expansion fund. Q3 headcount budget: $1.2M remaining. Approval code: FIN-2026-Q3-042.'
      if (t.includes('expense') || t.includes('spend') || t.includes('review'))
        return 'Monthly expenses reviewed: Total $342,847. Top categories: Payroll ($210k), Infrastructure ($52k), Marketing ($38k), R&D ($28k), Operations ($14k). 3 anomalies flagged in R&D category.'
      if (t.includes('variance') || t.includes('anomaly'))
        return 'Variance analysis complete. R&D: +$12k over budget (new hires). Marketing: -$8k under budget (campaign timing). Infrastructure: +$3k (cloud scaling). All variances have valid explanations. Recommended: approve with notes.'
      if (t.includes('campaign') || t.includes('market'))
        return 'Campaign budget allocated: $85,000. Breakdown: LinkedIn Ads ($30k), Twitter ($15k), Content Creation ($20k), Email Tools ($10k), Analytics ($5k), Contingency ($5k). Monthly spend caps configured.'
      if (t.includes('investor') || t.includes('forecast') || t.includes('metrics'))
        return 'Financial metrics compiled: Revenue $4.2M (+22% QoQ), Gross Margin 78%, Burn Rate $180k/mo, Runway 18 months, ARR $16.8M, NRR 112%. All metrics verified against ledger.'
      if (t.includes('invoice') || t.includes('payment'))
        return 'Invoice processed. Verified against PO and contract. Payment initiated via wire. Transaction ID: TX-2026-06-2847. General ledger updated.'
      return 'Financial analysis complete. All accounts reconciled. Cash position: $8.2M. Monthly burn: $180k. Runway: 45 months. No material changes from forecast.'
    }

    case 'agent-sales': {
      if (t.includes('lead') || t.includes('segment') || t.includes('target'))
        return 'Lead segmentation complete. 47 enterprise accounts identified in target market. Top 10 scored. Decision makers mapped. Recommended outreach: TechCorp ($85k expansion), DataFlow ($48k upsell), CloudSync ($120k new).'
      if (t.includes('pipeline'))
        return 'Pipeline analysis: Total value $3.2M. Weighted pipeline: $1.8M. Stage breakdown: Discovery (12), Demo (8), Negotiation (3), Closing (2). Win rate: 34%. Velocity: 45 days avg.'
      if (t.includes('enablement') || t.includes('material'))
        return 'Sales enablement materials created: Battle cards (12), Case studies (3), Product comparison guide, Technical FAQ, ROI calculator, Proposal templates. All uploaded to CRM.'
      return 'Sales analysis complete. CRM updated. 23 new activities logged. 5 follow-up tasks created. 3 deal stages advanced. Next actions identified for the team.'
    }

    case 'agent-marketing': {
      if (t.includes('research') || t.includes('market') || t.includes('position'))
        return 'Market research complete: 4 competitors analyzed. Market size: $4.2B. Growth rate: 18% YoY. Target segments: Mid-market (60%), Enterprise (30%), SMB (10%). Key differentiator: AI-native execution platform.'
      if (t.includes('strategy') || t.includes('calendar'))
        return 'Campaign strategy developed. 4-channel approach: LinkedIn (thought leadership), Twitter (community), Email (nurture), Blog (SEO). Content calendar: 12 pieces over 6 weeks. Milestones: Launch week, Mid-campaign optimization, Close analysis.'
      if (t.includes('content') || t.includes('asset') || t.includes('copy') || t.includes('creative'))
        return 'Campaign assets created: 4 LinkedIn ad variants, 8 Twitter posts, 3 email sequences (welcome, nurture, CTA), 2 blog posts. All assets reviewed for brand compliance. Visual identity: consistent with brand guidelines.'
      if (t.includes('launch') || t.includes('publish') || t.includes('monitor'))
        return 'Campaign launched across all channels. Initial results (first 2 hours): LinkedIn: 12k impressions, Twitter: 8k impressions, Email opens: 34%, Blog visits: 450. All systems operational. Performance dashboard active.'
      if (t.includes('announce') || t.includes('onboarding'))
        return 'Onboarding announcement created: Internal comms email drafted, Slack announcement ready, team calendar event created. Message: Welcome new team members, highlight their background and impact.'
      if (t.includes('report') || t.includes('kpi') || t.includes('metrics'))
        return 'Campaign performance report: 240k total impressions (+20% above target), 8.4k clicks (3.5% CTR), 340 leads generated. Top channel: LinkedIn (42% of leads). ROI: 4.2x. Recommendations for optimization attached.'
      if (t.includes('presentation') || t.includes('deck') || t.includes('pitch'))
        return 'Investor presentation deck created: 12 slides covering vision, traction, metrics, team, market, financials, and ask. Designed to premium standard. Data room compiled with supporting documents.'
      return 'Marketing task completed. Brand guidelines followed. Performance metrics tracked. All deliverables published and archived.'
    }

    case 'agent-ops': {
      if (t.includes('workstation') || t.includes('setup') || t.includes('access') || t.includes('equipment'))
        return 'Workstation setup prepared: MacBook Pro M4, 32GB RAM, 1TB SSD. Software: VS Code, Docker, Node.js, Git. Access: GitHub, Notion, G Suite, Jira, Slack, 1Password. Estimated ready date: 2 business days.'
      if (t.includes('coordinate') || t.includes('resource') || t.includes('timeline'))
        return 'Cross-team coordination complete. Resources allocated: Engineering (3 engineers, 2 weeks), Design (1 designer, 1 week), Marketing (2 marketers, ongoing). Timeline: 6 weeks with weekly syncs.'
      if (t.includes('logistics') || t.includes('launch'))
        return 'Launch logistics coordinated: Date confirmed, stakeholder notification sent, runbook prepared, rollback plan documented, monitoring dashboards configured. Go/no-go decision: Friday 10am.'
      if (t.includes('process') || t.includes('bottleneck') || t.includes('optimize'))
        return 'Process audit complete: 3 bottlenecks identified in deployment pipeline. Recommendations: Implement CI/CD automation (estimated 8h savings/week), streamline code review process (4h savings/week). Implementation plan created.'
      return 'Operations task completed. Systems monitored: all healthy. SLOs met: 99.97% uptime. Resource utilization optimized. Incident reports reviewed.'
    }

    case 'agent-legal': {
      if (t.includes('agreement') || t.includes('employment') || t.includes('offer letter') || t.includes('contract'))
        return 'Employment agreement generated: Standard at-will employment terms, IP assignment clause, confidentiality agreement, non-solicitation (12 months), equity grant details, benefits summary. Ready for counter-signature.'
      if (t.includes('compliance') || t.includes('regulatory') || t.includes('review'))
        return 'Compliance review complete: Campaign assets reviewed against FTC guidelines, GDPR requirements, and industry regulations. 2 minor issues flagged (disclaimer placement, data collection notice). Resolved before launch.'
      if (t.includes('campaign') || t.includes('asset') || t.includes('content'))
        return 'Campaign assets reviewed: 12 assets checked. 1 issue found — testimonial requires opt-in consent form. Updated with proper disclosure. All other assets compliant. Approved for publication.'
      return 'Legal review complete. Risk assessment: Low. All documents filed. Standard terms applied. 30-day review cycle initiated for renewals.'
    }

    case 'agent-support': {
      if (t.includes('faq') || t.includes('document') || t.includes('kb') || t.includes('knowledge'))
        return 'FAQ documentation prepared: 15 expected questions identified. Answers drafted with product team input. KB articles created and linked to campaign landing page. Support team briefed on expected volume.'
      if (t.includes('ticket') || t.includes('queue') || t.includes('resolve'))
        return 'Support queue processed: 18 tickets resolved today. Breakdown: Technical issues (8), Account questions (5), Billing (3), Feature requests (2). Avg response: 1.8 min. CSAT: 4.7/5. Escalations: 2 (handled).'
      if (t.includes('ready') || t.includes('prepare') || t.includes('product'))
        return 'Support readiness complete: Product knowledge base updated with launch features. 5 new macros created. Team of 4 trained on new workflows. Expected ticket volume: +30% during launch week. Staffing plan confirmed.'
      return 'Support task completed. All queues current. SLA compliance: 100%. Customer satisfaction: 94% positive. Knowledge base updated with latest resolutions.'
    }

    default:
      return `Task completed: ${task}`
  }
}
