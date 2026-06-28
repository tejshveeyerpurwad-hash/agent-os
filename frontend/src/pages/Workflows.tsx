import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { WorkflowCard } from '@/components/workflows/WorkflowCard'
import type { Workflow } from '@/types/workflow'

const placeholderWorkflows: Workflow[] = [
  { id: '1', name: 'Customer Onboarding', description: 'Automated welcome sequence with email verification, profile setup, and initial training.', status: 'active', steps: [
    { id: 's1', name: 'Verify Email', agentId: 'a1', input: {}, output: null, status: 'pending', order: 1 },
    { id: 's2', name: 'Create Profile', agentId: 'a2', input: {}, output: null, status: 'pending', order: 2 },
  ], createdAt: '2024-01-01', updatedAt: '2024-01-01', lastRunAt: '2024-01-01', runCount: 145 },
  { id: '2', name: 'Monthly Report Generation', description: 'Aggregates data from multiple sources and generates comprehensive monthly business reports.', status: 'active', steps: [
    { id: 's1', name: 'Data Collection', agentId: 'a3', input: {}, output: null, status: 'pending', order: 1 },
    { id: 's2', name: 'Analysis', agentId: 'a4', input: {}, output: null, status: 'pending', order: 2 },
  ], createdAt: '2024-01-01', updatedAt: '2024-01-01', lastRunAt: '2024-01-01', runCount: 23 },
  { id: '3', name: 'Lead Qualification', description: 'Scores and qualifies incoming leads based on historical data and behavioral patterns.', status: 'draft', steps: [
    { id: 's1', name: 'Score Lead', agentId: 'a5', input: {}, output: null, status: 'pending', order: 1 },
  ], createdAt: '2024-01-01', updatedAt: '2024-01-01', lastRunAt: null, runCount: 0 },
  { id: '4', name: 'Social Media Monitoring', description: 'Monitors brand mentions and sentiment across social platforms with alerting.', status: 'paused', steps: [
    { id: 's1', name: 'Monitor', agentId: 'a6', input: {}, output: null, status: 'pending', order: 1 },
    { id: 's2', name: 'Analyze', agentId: 'a7', input: {}, output: null, status: 'pending', order: 2 },
  ], createdAt: '2024-01-01', updatedAt: '2024-01-01', lastRunAt: null, runCount: 89 },
  { id: '5', name: 'Data Pipeline ETL', description: 'Extracts, transforms, and loads data from external APIs into the data warehouse.', status: 'failed', steps: [
    { id: 's1', name: 'Extract', agentId: 'a8', input: {}, output: null, status: 'pending', order: 1 },
    { id: 's2', name: 'Transform', agentId: 'a9', input: {}, output: null, status: 'pending', order: 2 },
    { id: 's3', name: 'Load', agentId: 'a10', input: {}, output: null, status: 'pending', order: 3 },
  ], createdAt: '2024-01-01', updatedAt: '2024-01-01', lastRunAt: '2024-01-01', runCount: 67 },
  { id: '6', name: 'Content Publishing', description: 'End-to-end content creation, review, approval, and publishing pipeline.', status: 'active', steps: [
    { id: 's1', name: 'Generate', agentId: 'a11', input: {}, output: null, status: 'pending', order: 1 },
    { id: 's2', name: 'Review', agentId: 'a12', input: {}, output: null, status: 'pending', order: 2 },
  ], createdAt: '2024-01-01', updatedAt: '2024-01-01', lastRunAt: '2024-01-01', runCount: 234 },
]

export function Workflows() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-xl font-bold text-dark-100">Workflows</h1>
          <p className="text-dark-400 mt-1">Design and orchestrate multi-step business processes.</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Create Workflow</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {placeholderWorkflows.map((workflow, i) => (
          <WorkflowCard key={workflow.id} workflow={workflow} index={i} />
        ))}
      </div>
    </div>
  )
}
