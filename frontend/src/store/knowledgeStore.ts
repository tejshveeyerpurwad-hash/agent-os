import { create } from 'zustand'
import type { KnowledgeItem, KnowledgeItemType } from '@/types/execution'

const seedData: KnowledgeItem[] = [
  { id: 'doc-1', type: 'document', title: 'API Integration Guide v2', content: 'Complete reference for integrating with AgentOS REST API, webhooks, and SDK. Supports OAuth 2.0 and API key authentication. Rate limit: 1000 req/min.', tags: ['API', 'Integration', 'Technical'], relatedIds: ['proj-1', 'note-2'], createdAt: '2025-01-15', updatedAt: '2026-06-28', metadata: { pages: '45', format: 'PDF', author: 'Engineering' } },
  { id: 'doc-2', type: 'document', title: 'Customer Onboarding Checklist', content: 'Step 1: Account creation. Step 2: Profile setup. Step 3: Team invitation. Step 4: API key generation. Step 5: Integration testing. Step 6: Go live review.', tags: ['Onboarding', 'Customer', 'Operations'], relatedIds: ['customer-1', 'proj-2'], createdAt: '2025-03-10', updatedAt: '2026-06-20', metadata: { pages: '12', format: 'Doc', author: 'Operations' } },
  { id: 'doc-3', type: 'document', title: 'Security Best Practices 2026', content: 'All agents must use encrypted channels. Data at rest uses AES-256. Access requires MFA. Weekly security audits conducted. Incident response: < 15 min.', tags: ['Security', 'Compliance'], relatedIds: ['policy-1', 'contract-2'], createdAt: '2026-01-01', updatedAt: '2026-06-25', metadata: { pages: '78', format: 'PDF', author: 'Security Team' } },
  { id: 'doc-4', type: 'document', title: 'Employee Handbook 2026', content: 'Company values: Innovation, Collaboration, Integrity. Work hours: flexible. Benefits: health, dental, 401k match, unlimited PTO. Code of conduct applies to all.', tags: ['HR', 'Policies', 'Handbook'], relatedIds: ['policy-1', 'employee-1', 'employee-2'], createdAt: '2026-01-01', updatedAt: '2026-06-01', metadata: { pages: '92', format: 'PDF', author: 'HR' } },
  { id: 'policy-1', type: 'policy', title: 'Remote Work Policy', content: 'Employees may work remotely up to 100%. Core hours 10am-3pm ET. Equipment provided. Home office stipend: $2000/year. Must maintain broadband connection.', tags: ['HR', 'Policy', 'Remote'], relatedIds: ['doc-4', 'employee-1'], createdAt: '2025-06-01', updatedAt: '2026-05-15', metadata: { department: 'HR', approvedBy: 'CEO' } },
  { id: 'policy-2', type: 'policy', title: 'Expense Reimbursement Policy', content: 'Pre-approval required for expenses > $500. Receipts required for all expenses. Travel: economy class, hotels up to $300/night. Meals: $75/day limit.', tags: ['Finance', 'Policy', 'Travel'], relatedIds: ['invoice-1', 'invoice-2'], createdAt: '2025-01-01', updatedAt: '2026-04-01', metadata: { department: 'Finance', approvedBy: 'CFO' } },
  { id: 'employee-1', type: 'employee', title: 'Alex Chen — CEO', content: 'CEO since 2024. Background: Stanford CS, ex-Google VP Eng. Focus: AI strategy, fundraising, executive team building. Email: alex@agentos.ai', tags: ['Executive', 'Leadership'], relatedIds: ['doc-4', 'policy-1', 'proj-1'], createdAt: '2025-01-01', updatedAt: '2026-06-15', metadata: { role: 'CEO', department: 'Executive', email: 'alex@agentos.ai' } },
  { id: 'employee-2', type: 'employee', title: 'Sarah Park — VP Engineering', content: 'VP Engineering since 2024. Background: MIT, ex-Stripe Eng Manager. Leads platform, infrastructure, and AI teams. 8 direct reports.', tags: ['Engineering', 'Leadership'], relatedIds: ['doc-1', 'proj-1', 'proj-2'], createdAt: '2025-01-15', updatedAt: '2026-06-20', metadata: { role: 'VP Engineering', department: 'Engineering', email: 'sarah@agentos.ai' } },
  { id: 'customer-1', type: 'customer', title: 'TechCorp Inc.', content: 'Enterprise client since Q1 2025. Annual contract: $240,000. Primary contact: CTO Jane Smith. Industry: FinTech. Active projects: API integration, Data migration.', tags: ['Enterprise', 'FinTech', 'Active'], relatedIds: ['proj-2', 'invoice-1', 'contract-1'], createdAt: '2025-02-01', updatedAt: '2026-06-28', metadata: { industry: 'FinTech', tier: 'Enterprise', arr: '$240,000' } },
  { id: 'customer-2', type: 'customer', title: 'DataFlow Systems', content: 'Mid-market client. Annual contract: $48,000. Contact: COO Mark Rivera. Uses AgentOS for workflow automation. 150 employees.', tags: ['Mid-Market', 'Active'], relatedIds: ['invoice-2', 'contract-2'], createdAt: '2026-03-01', updatedAt: '2026-06-25', metadata: { industry: 'Logistics', tier: 'Growth', arr: '$48,000' } },
  { id: 'proj-1', type: 'project', title: 'AgentOS Platform v3', content: 'Major platform upgrade. Goals: 2x throughput, real-time execution, improved planner accuracy. Timeline: Q3 2026. Team: 12 engineers. Status: In progress.', tags: ['Engineering', 'Platform', 'Q3'], relatedIds: ['employee-2', 'doc-1', 'note-1'], createdAt: '2026-04-01', updatedAt: '2026-06-28', metadata: { status: 'In Progress', budget: '$1,200,000', deadline: '2026-09-30' } },
  { id: 'proj-2', type: 'project', title: 'TechCorp Integration', content: 'Enterprise integration with TechCorp. Scope: SSO, data sync, custom workflows. Status: Integration testing. Timeline: Complete by July 2026.', tags: ['Customer', 'Integration', 'Active'], relatedIds: ['customer-1', 'doc-2', 'contract-1'], createdAt: '2026-05-01', updatedAt: '2026-06-27', metadata: { status: 'Testing', budget: '$180,000', deadline: '2026-07-31' } },
  { id: 'invoice-1', type: 'invoice', title: 'TechCorp — Q2 2026', content: 'Invoice for Q2 2026 enterprise subscription. Amount: $60,000. Status: Paid on June 15, 2026. Payment method: Wire transfer. PO: PO-2026-0421.', tags: ['Finance', 'Paid', 'Enterprise'], relatedIds: ['customer-1', 'contract-1'], createdAt: '2026-04-01', updatedAt: '2026-06-15', metadata: { amount: '$60,000', status: 'Paid', quarter: 'Q2 2026' } },
  { id: 'invoice-2', type: 'invoice', title: 'DataFlow — Q2 2026', content: 'Invoice for Q2 2026 subscription. Amount: $12,000. Status: Due July 15, 2026. Late payment penalty: 2%/month.', tags: ['Finance', 'Due', 'Growth'], relatedIds: ['customer-2', 'contract-2'], createdAt: '2026-04-01', updatedAt: '2026-06-28', metadata: { amount: '$12,000', status: 'Due', quarter: 'Q2 2026' } },
  { id: 'contract-1', type: 'contract', title: 'TechCorp Enterprise Agreement', content: 'Annual enterprise agreement. Term: Jan 2026 — Dec 2026. Auto-renewal. SLA: 99.9% uptime. Support: 24/7 premium. NDA and data processing terms included.', tags: ['Legal', 'Enterprise', 'Active'], relatedIds: ['customer-1', 'invoice-1', 'proj-2'], createdAt: '2025-12-15', updatedAt: '2026-06-01', metadata: { type: 'Enterprise', value: '$240,000/yr', expiry: '2026-12-31' } },
  { id: 'contract-2', type: 'contract', title: 'DataFlow MS Agreement', content: 'Master services agreement. Term: Mar 2026 — Mar 2027. Monthly billing. SLA: 99.5% uptime. Standard support. 30-day termination clause.', tags: ['Legal', 'Growth', 'Active'], relatedIds: ['customer-2', 'invoice-2', 'doc-3'], createdAt: '2026-02-15', updatedAt: '2026-06-01', metadata: { type: 'MSA', value: '$48,000/yr', expiry: '2027-03-01' } },
  { id: 'note-1', type: 'note', title: 'Q3 Planning Notes', content: 'Key priorities: Platform v3 launch, 2 new enterprise clients, AI agent improvements, hire 3 engineers. Budget approved: $2.5M. Timeline: July-Sept.', tags: ['Planning', 'Strategy', 'Q3'], relatedIds: ['proj-1', 'employee-1'], createdAt: '2026-06-20', updatedAt: '2026-06-28', metadata: { author: 'CEO', department: 'Executive' } },
  { id: 'note-2', type: 'note', title: 'API v2 Migration Notes', content: 'Breaking changes in v2: endpoint restructuring, new auth flow. Migration window: July 1-15. All clients notified. Rollback plan in place.', tags: ['API', 'Technical', 'Migration'], relatedIds: ['doc-1', 'customer-1'], createdAt: '2026-06-25', updatedAt: '2026-06-28', metadata: { author: 'Engineering', department: 'Engineering' } },
]

interface KnowledgeState {
  items: KnowledgeItem[]
  searchResults: KnowledgeItem[]
  selectedItem: KnowledgeItem | null
  searchQuery: string
  isLoading: boolean
}

interface KnowledgeActions {
  search: (query: string) => void
  selectItem: (item: KnowledgeItem | null) => void
  getByType: (type: KnowledgeItemType) => KnowledgeItem[]
  getById: (id: string) => KnowledgeItem | undefined
  getRelated: (item: KnowledgeItem) => KnowledgeItem[]
  addItem: (item: KnowledgeItem) => void
  clearSearch: () => void
}

export const useKnowledgeStore = create<KnowledgeState & KnowledgeActions>((set, get) => ({
  items: seedData,
  searchResults: [],
  selectedItem: null,
  searchQuery: '',
  isLoading: false,

  search: (query: string) => {
    set({ isLoading: true, searchQuery: query })
    const q = query.toLowerCase()
    const results = get().items.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q)) ||
      item.type.toLowerCase().includes(q)
    )
    setTimeout(() => set({ searchResults: results, isLoading: false }), 150)
  },

  selectItem: (item) => set({ selectedItem: item }),

  getByType: (type) => get().items.filter(i => i.type === type),

  getById: (id) => get().items.find(i => i.id === id),

  getRelated: (item) => get().items.filter(i => item.relatedIds.includes(i.id)),

  addItem: (item) => set(state => ({ items: [...state.items, item] })),

  clearSearch: () => set({ searchResults: [], searchQuery: '' }),
}))
