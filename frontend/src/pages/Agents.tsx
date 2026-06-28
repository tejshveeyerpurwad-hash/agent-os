import { useState } from 'react'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AgentCard } from '@/components/agents/AgentCard'
import type { Agent } from '@/types/agent'

const placeholderAgents: Agent[] = [
  { id: '1', name: 'DataAnalysisAgent', description: 'Analyzes and extracts insights from structured and unstructured datasets using statistical models.', status: 'running', model: 'gpt-4', capabilities: ['analysis', 'reporting'], createdAt: '2024-01-01', updatedAt: '2024-01-01', lastRunAt: '2024-01-01', taskCount: 847, successRate: 94 },
  { id: '2', name: 'ContentGenerator', description: 'Creates and optimizes marketing content, blog posts, and social media copy.', status: 'idle', model: 'gpt-4', capabilities: ['writing', 'optimization'], createdAt: '2024-01-01', updatedAt: '2024-01-01', lastRunAt: null, taskCount: 1234, successRate: 97 },
  { id: '3', name: 'SentimentAnalyzer', description: 'Monitors brand sentiment across social media platforms and customer feedback channels.', status: 'running', model: 'claude-3', capabilities: ['nlp', 'monitoring'], createdAt: '2024-01-01', updatedAt: '2024-01-01', lastRunAt: '2024-01-01', taskCount: 2501, successRate: 91 },
  { id: '4', name: 'CustomerSupportBot', description: 'Handles customer inquiries, ticket routing, and automated responses.', status: 'paused', model: 'gpt-4', capabilities: ['support', 'routing'], createdAt: '2024-01-01', updatedAt: '2024-01-01', lastRunAt: null, taskCount: 5632, successRate: 88 },
  { id: '5', name: 'DataEnrichmentAgent', description: 'Enriches customer records with external data sources and cleanses existing data.', status: 'error', model: 'claude-3', capabilities: ['enrichment', 'cleaning'], createdAt: '2024-01-01', updatedAt: '2024-01-01', lastRunAt: '2024-01-01', taskCount: 423, successRate: 76 },
  { id: '6', name: 'ReportGenerator', description: 'Generates automated business reports and executive summaries from raw data.', status: 'idle', model: 'gpt-4', capabilities: ['reporting', 'visualization'], createdAt: '2024-01-01', updatedAt: '2024-01-01', lastRunAt: null, taskCount: 312, successRate: 99 },
]

export function Agents() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAgents = placeholderAgents.filter(
    (agent) => agent.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-xl font-bold text-dark-100">Agents</h1>
          <p className="text-dark-400 mt-1">Manage your AI agents and their capabilities.</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Create Agent</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agents..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm text-dark-200 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
          />
        </div>
        <Button variant="outline" size="sm" leftIcon={<SlidersHorizontal className="h-4 w-4" />}>
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAgents.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} index={i} />
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-dark-400">No agents found matching your search.</p>
        </div>
      )}
    </div>
  )
}
