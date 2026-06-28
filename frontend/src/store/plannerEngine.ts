import type { ExecutionPlan, Subtask } from '@/types/execution'

interface PlannerInput {
  objective: string
  context?: string
}

const domainPatterns: { pattern: RegExp; domain: string; agents: string[]; description: string }[] = [
  { pattern: /hire|recruit|staff|talent|position|job|headcount|engineer|employee/i, domain: 'hiring', agents: ['agent-hr', 'agent-ceo'], description: 'Talent acquisition and hiring pipeline' },
  { pattern: /budget|finance|cost|spend|revenue|invoice|payment|expense|forecast|financial/i, domain: 'finance', agents: ['agent-finance', 'agent-ceo'], description: 'Financial planning, budgeting, and analysis' },
  { pattern: /campaign|market|marketing|content|social|brand|ad|promotion|seo|launch/i, domain: 'marketing', agents: ['agent-marketing', 'agent-sales', 'agent-ceo'], description: 'Marketing campaigns and content strategy' },
  { pattern: /sales|deal|lead|pipeline|revenue|quota|client|prospect|close|contract/i, domain: 'sales', agents: ['agent-sales', 'agent-marketing', 'agent-legal'], description: 'Sales pipeline and deal management' },
  { pattern: /legal|contract|compliance|regulatory|policy|ip|patent|license|risk|audit/i, domain: 'legal', agents: ['agent-legal', 'agent-ceo'], description: 'Legal review, compliance, and risk management' },
  { pattern: /support|ticket|csat|help|issue|bug|complaint|customer satisfaction|resolve/i, domain: 'support', agents: ['agent-support', 'agent-ops'], description: 'Customer support and issue resolution' },
  { pattern: /ops|operation|process|workflow|automate|schedule|supply|logistic|optimize|efficiency/i, domain: 'operations', agents: ['agent-ops', 'agent-finance'], description: 'Operations optimization and process automation' },
  { pattern: /report|summary|analytics|insight|kpi|metric|dashboard|performance|executive/i, domain: 'reporting', agents: ['agent-ceo', 'agent-finance', 'agent-marketing'], description: 'Reporting and business intelligence' },
  { pattern: /strategy|plan|vision|roadmap|objective|goal|initiative|q[1-4]|quarter/i, domain: 'strategy', agents: ['agent-ceo', 'agent-finance', 'agent-ops'], description: 'Strategic planning and quarterly initiatives' },
  { pattern: /product|feature|build|develop|engineering|platform|tech|architecture|api|integration/i, domain: 'engineering', agents: ['agent-ops', 'agent-ceo', 'agent-support'], description: 'Product development and engineering' },
]

export function analyzeObjective(input: PlannerInput): ExecutionPlan {
  const { objective } = input
  const reasoning: string[] = []
  const subtasks: Subtask[] = []
  const dependencies: { from: string; to: string }[] = []

  reasoning.push(`Analyzing objective: "${objective}"`)
  reasoning.push(`Identifying business domain...`)

  const matchedDomains = domainPatterns
    .filter(d => d.pattern.test(objective))
    .sort((a, b) => countMatches(objective, b.pattern) - countMatches(objective, a.pattern))

  const primaryDomain = matchedDomains[0]
  const secondaryDomains = matchedDomains.slice(1, 3)

  if (primaryDomain) {
    reasoning.push(`Primary domain identified: ${primaryDomain.domain} — ${primaryDomain.description}`)
    if (secondaryDomains.length > 0) {
      reasoning.push(`Related domains: ${secondaryDomains.map(d => d.domain).join(', ')}`)
    }
  } else {
    reasoning.push(`General business objective — engaging CEO Agent for strategic analysis`)
  }

  reasoning.push(`Decomposing objective into executable subtasks...`)
  reasoning.push(`Mapping subtasks to agent capabilities...`)
  reasoning.push(`Analyzing dependencies and execution order...`)

  let subtaskId = 0
  const allAgents = primaryDomain
    ? [...new Set([...primaryDomain.agents, ...secondaryDomains.flatMap(d => d.agents)])]
    : ['agent-ceo']

  const objectiveLower = objective.toLowerCase()
  const taskDescs = generateSubtaskDescriptions(objectiveLower, primaryDomain?.domain || 'general')

  taskDescs.forEach((desc, i) => {
    const agent = assignAgent(desc, allAgents)
    const id = `task-${++subtaskId}`
    subtasks.push({
      id,
      description: desc,
      agentId: agent,
      status: 'pending',
      dependsOn: i > 0 ? [subtasks[i - 1].id] : [],
      result: null,
      knowledgeQueries: extractQueries(desc),
      startedAt: null,
      completedAt: null,
    })
    if (i > 0) {
      dependencies.push({ from: subtasks[i - 1].id, to: id })
    }
  })

  reasoning.push(`Execution plan created: ${subtasks.length} subtasks across ${allAgents.length} agents`)
  reasoning.push(`Ready to execute. Awaiting user confirmation.`)

  return {
    objective,
    reasoning,
    subtasks,
    dependencies,
    createdAt: new Date().toISOString(),
  }
}

function countMatches(text: string, pattern: RegExp): number {
  const matches = text.match(pattern)
  return matches ? matches.length : 0
}

function generateSubtaskDescriptions(objective: string, domain: string): string[] {
  const tasks: Record<string, string[]> = {
    hiring: [
      `Analyze hiring requirements and create job descriptions for "${objective}"`,
      `Post positions to job boards and screen incoming applications`,
      `Coordinate technical interviews and assessment pipeline`,
      `Evaluate candidates and prepare offer recommendations`,
      `Extend offer and manage negotiation process`,
      `Initiate onboarding workflow for hired candidates`,
    ],
    finance: [
      `Pull current financial data and analyze budget against "${objective}"`,
      `Generate financial forecast and variance analysis`,
      `Process any outstanding invoices and payments`,
      `Prepare financial report with recommendations`,
      `Route report for CEO approval`,
    ],
    marketing: [
      `Research market positioning and competition for "${objective}"`,
      `Develop campaign strategy and content calendar`,
      `Create marketing assets and copy across channels`,
      `Launch campaign and monitor initial performance`,
      `Analyze campaign metrics and optimize targeting`,
      `Generate campaign performance report`,
    ],
    sales: [
      `Analyze current pipeline and identify opportunities related to "${objective}"`,
      `Score and prioritize leads in target segment`,
      `Prepare sales materials and proposal templates`,
      `Coordinate outreach sequence with Marketing`,
      `Track deal progression and update forecasts`,
      `Generate weekly sales report`,
    ],
    legal: [
      `Review existing contracts and agreements related to "${objective}"`,
      `Perform compliance and regulatory check`,
      `Draft or revise necessary legal documents`,
      `Flag risks and prepare mitigation recommendations`,
      `Submit for legal sign-off`,
    ],
    support: [
      `Assess current support ticket volume and trends`,
      `Route priority tickets to appropriate resolution paths`,
      `Update knowledge base with relevant solutions`,
      `Process escalated issues requiring agent intervention`,
      `Generate support performance report`,
    ],
    operations: [
      `Audit current operational processes related to "${objective}"`,
      `Identify bottlenecks and optimization opportunities`,
      `Design improved workflow and resource allocation`,
      `Implement process changes and monitor results`,
      `Generate operations efficiency report`,
    ],
    reporting: [
      `Gather data from all business units for "${objective}"`,
      `Analyze trends and generate key insights`,
      `Create executive summary with visualizations`,
      `Distribute report to stakeholders`,
    ],
    strategy: [
      `Analyze current business position and market conditions`,
      `Evaluate strategic options and scenarios for "${objective}"`,
      `Develop detailed execution roadmap with milestones`,
      `Assess resource requirements and constraints`,
      `Present strategy plan for board approval`,
    ],
    engineering: [
      `Define technical requirements and scope for "${objective}"`,
      `Architect solution and plan implementation sprints`,
      `Coordinate development and track progress`,
      `Run quality assurance and testing`,
      `Deploy and monitor launch`,
    ],
    general: [
      `Analyze business objective: "${objective}"`,
      `Research relevant context and background information`,
      `Develop execution plan with key milestones`,
      `Assign tasks to appropriate business agents`,
      `Execute plan and track progress`,
      `Generate comprehensive results report`,
    ],
  }

  return tasks[domain] || tasks.general
}

function assignAgent(description: string, availableAgents: string[]): string {
  const descLower = description.toLowerCase()
  if (descLower.includes('ceo') || descLower.includes('approv') || descLower.includes('strategy') || descLower.includes('board') || descLower.includes('executive')) return 'agent-ceo'
  if (descLower.includes('hr') || descLower.includes('hire') || descLower.includes('recruit') || descLower.includes('interview') || descLower.includes('candidate') || descLower.includes('offer') || descLower.includes('onboard')) return 'agent-hr'
  if (descLower.includes('finance') || descLower.includes('budget') || descLower.includes('invoice') || descLower.includes('cost') || descLower.includes('financial') || descLower.includes('revenue')) return 'agent-finance'
  if (descLower.includes('sales') || descLower.includes('lead') || descLower.includes('deal') || descLower.includes('pipeline') || descLower.includes('client') || descLower.includes('proposal')) return 'agent-sales'
  if (descLower.includes('market') || descLower.includes('campaign') || descLower.includes('content') || descLower.includes('social') || descLower.includes('brand') || descLower.includes('promotion')) return 'agent-marketing'
  if (descLower.includes('ops') || descLower.includes('operation') || descLower.includes('process') || descLower.includes('workflow') || descLower.includes('schedule') || descLower.includes('automate')) return 'agent-ops'
  if (descLower.includes('legal') || descLower.includes('contract') || descLower.includes('compliance') || descLower.includes('regulatory') || descLower.includes('risk') || descLower.includes('ip')) return 'agent-legal'
  if (descLower.includes('support') || descLower.includes('ticket') || descLower.includes('csat') || descLower.includes('help') || descLower.includes('issue') || descLower.includes('resolve')) return 'agent-support'
  return availableAgents[0] || 'agent-ceo'
}

function extractQueries(description: string): string[] {
  const queries: string[] = []
  const patterns = [
    /(?:check|review|find|search|look up|get)\s+([^,.]+)/gi,
    /(?:relevant|related|existing)\s+([^,.]+)/gi,
    /(?:policies?|documents?|contracts?|records?)\s+(?:for|about|related to|regarding)\s+([^,.]+)/gi,
  ]
  patterns.forEach(pattern => {
    const matches = description.matchAll(pattern)
    for (const match of matches) {
      queries.push(match[1].trim())
    }
  })
  if (queries.length === 0) {
    const words = description.split(' ').filter(w => w.length > 4).slice(0, 3)
    queries.push(words.join(' '))
  }
  return queries.slice(0, 3)
}
