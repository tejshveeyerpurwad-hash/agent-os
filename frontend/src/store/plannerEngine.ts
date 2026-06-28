import type { ExecutionPlan, Subtask } from '@/types/execution'

interface PlannerInput {
  objective: string
  context?: string
}

interface DomainMapping {
  pattern: RegExp
  domain: string
  agents: string[]
  description: string
}

const domainPatterns: DomainMapping[] = [
  { pattern: /hire|recruit|staff|talent|position|job|headcount|engineer|employee/i, domain: 'hiring', agents: ['agent-ceo', 'agent-hr', 'agent-finance', 'agent-legal', 'agent-ops', 'agent-marketing'], description: 'Talent acquisition and hiring pipeline' },
  { pattern: /budget|finance|cost|spend|revenue|invoice|payment|expense|forecast|financial|monthly expenses/i, domain: 'finance', agents: ['agent-finance', 'agent-ceo', 'agent-ops'], description: 'Financial planning, budgeting, and analysis' },
  { pattern: /campaign|market|marketing|content|social|brand|ad|promotion|seo|launch/i, domain: 'marketing', agents: ['agent-marketing', 'agent-sales', 'agent-ceo', 'agent-finance', 'agent-legal', 'agent-ops', 'agent-support'], description: 'Marketing campaigns and content strategy' },
  { pattern: /sales|deal|lead|pipeline|revenue|quota|client|prospect|close|contract/i, domain: 'sales', agents: ['agent-sales', 'agent-marketing', 'agent-legal'], description: 'Sales pipeline and deal management' },
  { pattern: /legal|contract|compliance|regulatory|policy|ip|patent|license|risk|audit/i, domain: 'legal', agents: ['agent-legal', 'agent-ceo'], description: 'Legal review, compliance, and risk management' },
  { pattern: /support|ticket|csat|help|issue|bug|complaint|customer satisfaction|resolve/i, domain: 'support', agents: ['agent-support', 'agent-ops'], description: 'Customer support and issue resolution' },
  { pattern: /ops|operation|process|workflow|automate|schedule|supply|logistic|optimize|efficiency/i, domain: 'operations', agents: ['agent-ops', 'agent-finance'], description: 'Operations optimization and process automation' },
  { pattern: /investor|fundraising|pitch|deck|valuation|funding|round|raise|capatable|investor update|board/i, domain: 'investor', agents: ['agent-ceo', 'agent-finance', 'agent-marketing', 'agent-sales'], description: 'Investor communications and fundraising' },
  { pattern: /product|launch|feature|build|develop|engineering|platform|tech|architecture|api|integration|release/i, domain: 'product_launch', agents: ['agent-ceo', 'agent-marketing', 'agent-sales', 'agent-ops', 'agent-support'], description: 'Product development and launch' },
  { pattern: /report|summary|analytics|insight|kpi|metric|dashboard|performance|executive/i, domain: 'reporting', agents: ['agent-ceo', 'agent-finance', 'agent-marketing'], description: 'Reporting and business intelligence' },
]

const scenarioTemplates: Record<string, (obj: string) => { reasoning: string[]; subtasks: SubtaskDesc[]; summary: string }> = {
  hiring: (obj) => ({
    reasoning: [
      `Analyzing hiring request: "${obj}"`,
      'Identified domain: Talent Acquisition',
      'Primary actors: CEO (budget approval), HR (recruitment), Finance (budget allocation), Legal (employment agreement), Ops (onboarding), Marketing (announcement)',
      'Decomposing into 8 subtasks across 6 agents with parallel execution groups',
      'Dependency graph: CEO approval → HR creates JD + Finance confirms budget (parallel) → HR screens → HR interviews + Legal generates agreement (parallel) → CEO approves offer + Finance approves salary (parallel) → HR negotiates → Ops prepares + Marketing announces (parallel) → CEO summarizes',
    ],
    subtasks: [
      { desc: 'Review headcount request and approve hiring plan for 2 frontend engineers', agent: 'agent-ceo', priority: 'high', depth: 0, approval: true },
      { desc: 'Create detailed job descriptions for frontend engineer positions', agent: 'agent-hr', priority: 'high', depth: 1 },
      { desc: 'Confirm budget allocation for 2 new hires ($300k total compensation)', agent: 'agent-finance', priority: 'high', depth: 1 },
      { desc: 'Post positions to job boards and screen incoming applications', agent: 'agent-hr', priority: 'high', depth: 2 },
      { desc: 'Coordinate technical interviews and shortlist top candidates', agent: 'agent-hr', priority: 'high', depth: 3 },
      { desc: 'Generate employment agreement template and offer letter', agent: 'agent-legal', priority: 'medium', depth: 3 },
      { desc: 'Approve offer package and authorize salary range', agent: 'agent-ceo', priority: 'high', depth: 4, approval: true },
      { desc: 'Allocate funds for new hire salaries in Q3 budget', agent: 'agent-finance', priority: 'medium', depth: 4 },
      { desc: 'Extend offer letters and manage negotiation process', agent: 'agent-hr', priority: 'high', depth: 5 },
      { desc: 'Prepare workstation setup and system access for new hires', agent: 'agent-ops', priority: 'medium', depth: 6 },
      { desc: 'Create onboarding announcement for company-wide communication', agent: 'agent-marketing', priority: 'low', depth: 6 },
      { desc: 'Generate hiring completion summary with timeline and costs', agent: 'agent-ceo', priority: 'low', depth: 7 },
    ],
    summary: 'Complete hiring pipeline executed: 2 frontend engineer positions approved, posted, interviewed, offered, and onboarded across 6 collaborating agents.',
  }),
  marketing: (obj) => ({
    reasoning: [
      `Analyzing campaign request: "${obj}"`,
      'Identified domain: Marketing Campaign',
      'Primary actors: Marketing (strategy/content), CEO (approval), Sales (lead targeting), Finance (budget), Legal (compliance), Ops (coordination), Support (FAQ prep)',
      'Decomposing into 10 subtasks across 7 agents with parallel execution groups',
      'Dependency graph: CEO approves strategy + Marketing researches (parallel) → Marketing creates strategy → Sales provides targets + Finance allocates budget (parallel) → Marketing creates content + Legal reviews (parallel) → CEO gives final approval → Marketing launches → Ops coordinates + Support prepares FAQ (parallel) → Marketing reports',
    ],
    subtasks: [
      { desc: 'Approve campaign strategy and confirm marketing objectives', agent: 'agent-ceo', priority: 'high', depth: 0, approval: true },
      { desc: 'Research market positioning, competition, and target audience', agent: 'agent-marketing', priority: 'high', depth: 0 },
      { desc: 'Develop comprehensive campaign strategy and content calendar', agent: 'agent-marketing', priority: 'high', depth: 1 },
      { desc: 'Provide lead segmentation and target account list for campaign', agent: 'agent-sales', priority: 'medium', depth: 2 },
      { desc: 'Allocate campaign budget ($85,000) across channels', agent: 'agent-finance', priority: 'high', depth: 2 },
      { desc: 'Create marketing assets and copy for 4 channels (LinkedIn, Twitter, Email, Blog)', agent: 'agent-marketing', priority: 'high', depth: 3 },
      { desc: 'Review campaign assets for compliance and regulatory requirements', agent: 'agent-legal', priority: 'medium', depth: 3 },
      { desc: 'Final campaign approval before launch', agent: 'agent-ceo', priority: 'high', depth: 4, approval: true },
      { desc: 'Launch campaign across all channels and monitor initial performance', agent: 'agent-marketing', priority: 'high', depth: 5 },
      { desc: 'Coordinate campaign timeline and resource allocation across teams', agent: 'agent-ops', priority: 'medium', depth: 6 },
      { desc: 'Prepare FAQ and support documentation for expected inquiries', agent: 'agent-support', priority: 'low', depth: 6 },
      { desc: 'Generate campaign launch report with KPIs and recommendations', agent: 'agent-marketing', priority: 'medium', depth: 7 },
    ],
    summary: 'Marketing campaign launched: strategy developed, assets created across 4 channels, legal-reviewed, approved by CEO, and published with monitoring and support preparation.',
  }),
  investor: (obj) => ({
    reasoning: [
      `Analyzing investor update request: "${obj}"`,
      'Identified domain: Investor Relations',
      'Primary actors: CEO (strategy/message), Finance (metrics), Marketing (presentation), Sales (growth data)',
      'Decomposing into 7 subtasks across 4 agents with parallel execution groups',
    ],
    subtasks: [
      { desc: 'Define investor update strategy and key messaging themes', agent: 'agent-ceo', priority: 'high', depth: 0, approval: true },
      { desc: 'Compile financial metrics: revenue, burn rate, runway, growth KPIs', agent: 'agent-finance', priority: 'high', depth: 1 },
      { desc: 'Gather sales metrics: pipeline value, win rate, top deals, expansion revenue', agent: 'agent-sales', priority: 'high', depth: 1 },
      { desc: 'Prepare investor presentation deck with visuals and narrative', agent: 'agent-marketing', priority: 'high', depth: 2 },
      { desc: 'Draft investor communication email with key highlights', agent: 'agent-ceo', priority: 'high', depth: 3 },
      { desc: 'Review financial projections and update fundraising model', agent: 'agent-finance', priority: 'medium', depth: 3 },
      { desc: 'Final review and send investor update package', agent: 'agent-ceo', priority: 'high', depth: 4, approval: true },
    ],
    summary: 'Investor update prepared: financial metrics compiled, growth data analyzed, presentation deck created, and communication package reviewed and sent.',
  }),
  finance: (obj) => ({
    reasoning: [
      `Analyzing expense review request: "${obj}"`,
      'Identified domain: Financial Review',
      'Primary actors: Finance (analysis), CEO (oversight), Ops (department review)',
      'Decomposing into 6 subtasks across 3 agents with parallel execution groups',
    ],
    subtasks: [
      { desc: 'Pull all departmental expense reports for the current month', agent: 'agent-finance', priority: 'high', depth: 0 },
      { desc: 'Categorize expenses and flag anomalies or unusual patterns', agent: 'agent-finance', priority: 'high', depth: 1 },
      { desc: 'Review operational department spending against budget', agent: 'agent-ops', priority: 'medium', depth: 1 },
      { desc: 'Generate expense variance report with recommendations', agent: 'agent-finance', priority: 'high', depth: 2 },
      { desc: 'Review expense report and approve recommended actions', agent: 'agent-ceo', priority: 'high', depth: 3, approval: true },
      { desc: 'Generate monthly expense summary with actionable insights', agent: 'agent-finance', priority: 'medium', depth: 4 },
    ],
    summary: 'Monthly expenses reviewed: $342k total spend analyzed across departments, 3 anomalies flagged, budget variances documented, and cost-saving recommendations approved.',
  }),
  product_launch: (obj) => ({
    reasoning: [
      `Analyzing product launch request: "${obj}"`,
      'Identified domain: Product Launch',
      'Primary actors: CEO (strategy/approval), Marketing (GTM/content), Sales (enablement), Ops (coordination), Support (readiness)',
      'Decomposing into 9 subtasks across 5 agents with parallel execution groups',
    ],
    subtasks: [
      { desc: 'Approve product launch strategy and define success criteria', agent: 'agent-ceo', priority: 'high', depth: 0, approval: true },
      { desc: 'Develop go-to-market plan with timeline and milestones', agent: 'agent-marketing', priority: 'high', depth: 1 },
      { desc: 'Define target segments and prepare sales enablement materials', agent: 'agent-sales', priority: 'high', depth: 1 },
      { desc: 'Create product launch content: website, blog, social, email sequences', agent: 'agent-marketing', priority: 'high', depth: 2 },
      { desc: 'Coordinate launch logistics and cross-team resource allocation', agent: 'agent-ops', priority: 'medium', depth: 2 },
      { desc: 'Prepare support team with product knowledge base and scripts', agent: 'agent-support', priority: 'medium', depth: 3 },
      { desc: 'Final launch approval and sign-off from CEO', agent: 'agent-ceo', priority: 'high', depth: 4, approval: true },
      { desc: 'Execute launch across all channels and monitor initial response', agent: 'agent-marketing', priority: 'high', depth: 5 },
      { desc: 'Generate post-launch report with metrics and recommendations', agent: 'agent-marketing', priority: 'medium', depth: 6 },
    ],
    summary: 'Product launch executed: GTM strategy approved, content created across channels, sales teams enabled, support prepared, launch executed, and post-launch metrics reported.',
  }),
}

interface SubtaskDesc {
  desc: string
  agent: string
  priority: 'high' | 'medium' | 'low'
  depth: number
  approval?: boolean
}

export function analyzeObjective(input: PlannerInput): ExecutionPlan {
  const { objective } = input
  const objLower = objective.toLowerCase()

  const matchedDomains = domainPatterns
    .filter(d => d.pattern.test(objLower))
    .sort((a, b) => countMatches(objLower, b.pattern) - countMatches(objLower, a.pattern))

  const primaryDomain = matchedDomains[0]
  const domain = primaryDomain?.domain || 'general'

  const template = scenarioTemplates[domain]
  let reasoning: string[] = []
  let subtaskDescs: SubtaskDesc[] = []
  let summary = ''

  if (template) {
    const result = template(objective)
    reasoning = result.reasoning
    subtaskDescs = result.subtasks
    summary = result.summary
  } else {
    reasoning = [
      `Analyzing business objective: "${objective}"`,
      'No specific domain template found — using general execution pattern',
      'Engaging CEO Agent for strategic analysis and decomposition',
    ]
    subtaskDescs = [
      { desc: `Analyze business objective: ${objective}`, agent: 'agent-ceo', priority: 'high', depth: 0, approval: true },
      { desc: 'Research relevant context and background information', agent: 'agent-ceo', priority: 'high', depth: 1 },
      { desc: 'Develop execution plan with key milestones', agent: 'agent-ceo', priority: 'high', depth: 2 },
      { desc: 'Assign tasks to appropriate business agents', agent: 'agent-ops', priority: 'medium', depth: 3 },
      { desc: 'Execute plan and monitor progress across teams', agent: 'agent-ops', priority: 'medium', depth: 4 },
      { desc: 'Generate comprehensive results report', agent: 'agent-ceo', priority: 'low', depth: 5 },
    ]
    summary = `Business objective "${objective}" processed with general execution workflow.`
  }

  const subtasks: Subtask[] = []
  const dependencies: { from: string; to: string }[] = []
  let subtaskId = 0

  subtaskDescs.forEach((desc, i) => {
    const id = `task-${++subtaskId}`
    const dependsOn: string[] = []

    if (desc.depth > 0) {
      const sameLevelBefore = subtaskDescs.slice(0, i).filter(s => s.depth === desc.depth)
      if (sameLevelBefore.length === 0) {
        const prevLevel = subtaskDescs.slice(0, i).filter(s => s.depth === desc.depth - 1)
        if (prevLevel.length > 0) {
          prevLevel.forEach(p => {
            const prevSubtask = subtasks[subtaskDescs.indexOf(p)]
            if (prevSubtask) {
              dependsOn.push(prevSubtask.id)
              dependencies.push({ from: prevSubtask.id, to: id })
            }
          })
        }
      }
    }

    subtasks.push({
      id,
      description: desc.desc,
      agentId: desc.agent,
      status: 'pending',
      dependsOn,
      result: null,
      knowledgeQueries: extractQueries(desc.desc),
      startedAt: null,
      completedAt: null,
      priority: desc.priority,
      depth: desc.depth,
      executionGroup: desc.depth,
    })
  })

  const maxDepth = Math.max(...subtasks.map(s => s.depth), 0)

  reasoning.push(`Execution plan: ${subtasks.length} subtasks across ${new Set(subtasks.map(s => s.agentId)).size} agents`)
  reasoning.push(`Parallel groups: ${maxDepth + 1} depth levels — tasks at same depth execute simultaneously`)
  reasoning.push('Plan ready. Starting execution.')

  return {
    objective,
    reasoning,
    subtasks,
    dependencies,
    depthLevels: maxDepth,
    createdAt: new Date().toISOString(),
    summary,
  }
}

function countMatches(text: string, pattern: RegExp): number {
  const matches = text.match(pattern)
  return matches ? matches.length : 0
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
