export interface BusinessActivity {
  id: string
  agentName: string
  agentRole: string
  action: string
  detail: string
  timestamp: string
  type: 'success' | 'warning' | 'info' | 'error'
}

export interface KPI {
  id: string
  label: string
  value: string
  change: number
  positive: boolean
  unit?: string
}

export interface Approval {
  id: string
  title: string
  agentName: string
  amount: string
  urgency: 'high' | 'medium' | 'low'
  timeAgo: string
}

export interface Notification {
  id: string
  agentName: string
  agentRole: string
  message: string
  timeAgo: string
  unread: boolean
}

export const kpis: KPI[] = [
  { id: 'k1', label: 'Active Agents', value: '8', change: 2, positive: true },
  { id: 'k2', label: 'Workflows Running', value: '14', change: 5, positive: true },
  { id: 'k3', label: 'Tasks Completed Today', value: '847', change: 12.3, positive: true },
  { id: 'k4', label: 'Avg Response Time', value: '1.2', change: 8, positive: false, unit: 's' },
  { id: 'k5', label: 'Cost Efficiency', value: '94', change: 3.1, positive: true, unit: '%' },
  { id: 'k6', label: 'Pending Approvals', value: '3', change: 1, positive: false },
]

export const activities: BusinessActivity[] = [
  { id: 'a1', agentName: 'HRAgent', agentRole: 'HR', action: 'shortlisted candidates', detail: '14 candidates shortlisted for Senior Engineer role', timestamp: '2 min ago', type: 'success' },
  { id: 'a2', agentName: 'FinanceAgent', agentRole: 'Finance', action: 'approved budget', detail: 'Q3 marketing budget of $240,000 approved', timestamp: '8 min ago', type: 'success' },
  { id: 'a3', agentName: 'MarketingAgent', agentRole: 'Marketing', action: 'published campaign', detail: 'Product launch campaign published across 4 channels', timestamp: '15 min ago', type: 'success' },
  { id: 'a4', agentName: 'SupportAgent', agentRole: 'Support', action: 'resolved tickets', detail: '26 support tickets resolved in last hour', timestamp: '22 min ago', type: 'info' },
  { id: 'a5', agentName: 'SalesAgent', agentRole: 'Sales', action: 'closed deal', detail: 'Enterprise deal worth $85,000 closed with TechCorp', timestamp: '31 min ago', type: 'success' },
  { id: 'a6', agentName: 'LegalAgent', agentRole: 'Legal', action: 'reviewed contract', detail: 'Supplier agreement reviewed, 3 clauses flagged', timestamp: '45 min ago', type: 'warning' },
  { id: 'a7', agentName: 'OperationsAgent', agentRole: 'Operations', action: 'optimized schedule', detail: 'Production schedule optimized, 12% efficiency gain', timestamp: '1 hour ago', type: 'success' },
  { id: 'a8', agentName: 'CEOAgent', agentRole: 'CEO', action: 'generated report', detail: 'Weekly executive summary distributed to board', timestamp: '1 hour ago', type: 'info' },
  { id: 'a9', agentName: 'FinanceAgent', agentRole: 'Finance', action: 'flagged anomaly', detail: 'Unusual expense pattern detected in R&D department', timestamp: '2 hours ago', type: 'error' },
  { id: 'a10', agentName: 'MarketingAgent', agentRole: 'Marketing', action: 'analyzed campaign', detail: 'Campaign performance analysis: 24% above target', timestamp: '2 hours ago', type: 'success' },
]

export const approvals: Approval[] = [
  { id: 'ap1', title: 'Q3 Marketing Budget', agentName: 'Marketing Agent', amount: '$240,000', urgency: 'high', timeAgo: '10 min ago' },
  { id: 'ap2', title: 'New Server Infrastructure', agentName: 'Operations Agent', amount: '$85,000', urgency: 'medium', timeAgo: '1 hour ago' },
  { id: 'ap3', title: 'Hiring: Senior Engineer', agentName: 'HR Agent', amount: '$180,000/yr', urgency: 'high', timeAgo: '2 hours ago' },
]

export const notifications: Notification[] = [
  { id: 'n1', agentName: 'SupportAgent', agentRole: 'Support', message: '26 tickets resolved in last hour — above target', timeAgo: '22 min ago', unread: true },
  { id: 'n2', agentName: 'SalesAgent', agentRole: 'Sales', message: '$85,000 deal closed with TechCorp', timeAgo: '31 min ago', unread: true },
  { id: 'n3', agentName: 'FinanceAgent', agentRole: 'Finance', message: 'Unusual expense pattern detected', timeAgo: '2 hours ago', unread: false },
  { id: 'n4', agentName: 'CEOAgent', agentRole: 'CEO', message: 'Weekly report ready for review', timeAgo: '4 hours ago', unread: false },
]

export const commandExamples = [
  'Hire two frontend engineers',
  'Generate Q3 marketing campaign',
  'Prepare investor report',
  'Review last month expenses',
  'Onboard new customer Acme Corp',
  'Run quarterly sales forecast',
]

export interface WorkflowExecution {
  id: string
  prompt: string
  status: 'idle' | 'planning' | 'decomposing' | 'executing' | 'tool_calls' | 'completed' | 'error'
  steps: { label: string; status: 'pending' | 'active' | 'done' | 'error' }[]
  result: string | null
  startedAt: string | null
}

export function createExecution(prompt: string): WorkflowExecution {
  return {
    id: Math.random().toString(36).slice(2),
    prompt,
    status: 'idle',
    steps: [
      { label: 'Analyzing prompt', status: 'pending' },
      { label: 'Decomposing into tasks', status: 'pending' },
      { label: 'Assigning to agents', status: 'pending' },
      { label: 'Executing tasks', status: 'pending' },
      { label: 'Generating output', status: 'pending' },
    ],
    result: null,
    startedAt: null,
  }
}

export const agents = [
  { id: 'agent-ceo', name: 'CEOArya', role: 'CEO Agent', description: 'Strategic decision-making, executive summaries, market intelligence, and board-level reporting.', status: 'running', model: 'gpt-4', capabilities: ['strategy', 'reporting', 'analysis'], confidence: 96, currentTask: 'Generating weekly executive summary', lastAction: 'Distributed board report', taskCount: 847, successRate: 97, color: 'from-blue-500/20 to-blue-600/10', icon: 'Crown', createdAt: '2024-01-01' },
  { id: 'agent-hr', name: 'HRBot', role: 'HR Agent', description: 'Talent acquisition, employee engagement, performance reviews, and organizational development.', status: 'running', model: 'gpt-4', capabilities: ['recruiting', 'onboarding', 'reviews'], confidence: 92, currentTask: 'Screening 14 engineering candidates', lastAction: 'Shortlisted candidates for Senior Engineer', taskCount: 2341, successRate: 94, color: 'from-emerald-500/20 to-emerald-600/10', icon: 'Users', createdAt: '2024-01-01' },
  { id: 'agent-finance', name: 'FinanceAI', role: 'Finance Agent', description: 'Real-time financial analysis, forecasting, budget optimization, and compliance monitoring.', status: 'running', model: 'claude-3', capabilities: ['analysis', 'forecasting', 'compliance'], confidence: 98, currentTask: 'Analyzing Q3 expense patterns', lastAction: 'Approved $240k marketing budget', taskCount: 5632, successRate: 99, color: 'from-amber-500/20 to-amber-600/10', icon: 'TrendingUp', createdAt: '2024-01-01' },
  { id: 'agent-sales', name: 'SalesPro', role: 'Sales Agent', description: 'Lead scoring, pipeline management, prospect intelligence, and revenue forecasting.', status: 'completed', model: 'gpt-4', capabilities: ['scoring', 'pipeline', 'forecasting'], confidence: 89, currentTask: null, lastAction: 'Closed $85k TechCorp deal', taskCount: 4123, successRate: 91, color: 'from-violet-500/20 to-violet-600/10', icon: 'Zap', createdAt: '2024-01-01' },
  { id: 'agent-marketing', name: 'MarketGenius', role: 'Marketing Agent', description: 'Campaign optimization, audience segmentation, content strategy, and multi-channel analytics.', status: 'running', model: 'gpt-4', capabilities: ['campaigns', 'content', 'analytics'], confidence: 93, currentTask: 'Optimizing Q3 campaign across 4 channels', lastAction: 'Published product launch campaign', taskCount: 3124, successRate: 95, color: 'from-pink-500/20 to-pink-600/10', icon: 'Globe', createdAt: '2024-01-01' },
  { id: 'agent-ops', name: 'OpsBot', role: 'Operations Agent', description: 'Process optimization, resource allocation, supply chain intelligence, and workflow automation.', status: 'idle', model: 'claude-3', capabilities: ['optimization', 'scheduling', 'automation'], confidence: 91, currentTask: null, lastAction: 'Optimized production schedule', taskCount: 2876, successRate: 93, color: 'from-cyan-500/20 to-cyan-600/10', icon: 'Layers', createdAt: '2024-01-01' },
  { id: 'agent-legal', name: 'LegalShield', role: 'Legal Agent', description: 'Contract review, compliance monitoring, risk assessment, and regulatory documentation.', status: 'paused', model: 'gpt-4', capabilities: ['contracts', 'compliance', 'risk'], confidence: 95, currentTask: 'Awaiting partner contract for review', lastAction: 'Flagged 3 clauses in supplier agreement', taskCount: 1567, successRate: 98, color: 'from-red-500/20 to-red-600/10', icon: 'Shield', createdAt: '2024-01-01' },
  { id: 'agent-support', name: 'SupportBot', role: 'Support Agent', description: 'Intelligent ticket routing, knowledge base retrieval, sentiment analysis, and automated resolution.', status: 'running', model: 'gpt-4', capabilities: ['tickets', 'kb', 'sentiment'], confidence: 90, currentTask: 'Resolving escalations in queue', lastAction: 'Resolved 26 tickets (94% satisfaction)', taskCount: 8921, successRate: 96, color: 'from-indigo-500/20 to-indigo-600/10', icon: 'Bot', createdAt: '2024-01-01' },
]
