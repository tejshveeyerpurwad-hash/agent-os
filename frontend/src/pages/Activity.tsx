import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Activity as ActivityIcon, Bot, CheckCircle2, AlertCircle, Info, AlertTriangle, Filter, Clock, ChevronDown, Search, User, FileText, Workflow, BrainCircuit } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useActivityStore } from '@/store/activityStore'
import type { ActivityEvent } from '@/types/execution'

const typeIcons: Record<string, typeof Bot> = {
  execution: BrainCircuit,
  agent: Bot,
  knowledge: FileText,
  workflow: Workflow,
  approval: CheckCircle2,
  system: ActivityIcon,
}

const typeColors: Record<string, string> = {
  execution: 'text-primary-400 bg-primary-500/10',
  agent: 'text-violet-400 bg-violet-500/10',
  knowledge: 'text-cyan-400 bg-cyan-500/10',
  workflow: 'text-amber-400 bg-amber-500/10',
  approval: 'text-emerald-400 bg-emerald-500/10',
  system: 'text-dark-400 bg-dark-800',
}

const severityColors: Record<string, string> = {
  info: 'text-dark-400',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  error: 'text-red-400',
}

const severityIcons: Record<string, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
}

export function Activity() {
  const { events, unreadCount, markAllRead } = useActivityStore()
  const [filter, setFilter] = useState<ActivityEvent['type'] | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => events.filter(e => {
    if (filter !== 'all' && e.type !== filter) return false
    if (search && !e.action.toLowerCase().includes(search.toLowerCase()) && !e.detail.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [events, filter, search])

  const typeCounts = useMemo(() => ({
    all: events.length,
    execution: events.filter(e => e.type === 'execution').length,
    agent: events.filter(e => e.type === 'agent').length,
    workflow: events.filter(e => e.type === 'workflow').length,
    approval: events.filter(e => e.type === 'approval').length,
    knowledge: events.filter(e => e.type === 'knowledge').length,
    system: events.filter(e => e.type === 'system').length,
  }), [events])

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-dark-100 tracking-tight">Activity</h1>
          <p className="text-sm text-dark-400 mt-0.5">Real-time business execution timeline</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors focus-ring">
              Mark all read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activity..."
            aria-label="Search activity events"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-dark-800/50 border border-dark-700 text-sm text-dark-200 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus-ring" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'execution', 'agent', 'workflow', 'approval', 'knowledge', 'system'] as const).map(t => (
            <button key={t} onClick={() => setFilter(t)}
              aria-label={t === 'all' ? 'Show all events' : `Show ${t} events`}
              aria-pressed={filter === t}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus-ring',
                filter === t ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'bg-dark-800/30 text-dark-400 hover:text-dark-300 border border-transparent',
              )}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              <span className="ml-1 text-[10px] opacity-60">({typeCounts[t]})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-3 sm:left-5 top-0 bottom-0 w-px bg-dark-800" />
        <div className="space-y-1">
          {filtered.map((event, i) => {
            const TypeIcon = typeIcons[event.type] || ActivityIcon
            const SevIcon = severityIcons[event.severity] || Info
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.015 }}
                className="relative flex items-start gap-4 pl-8 sm:pl-12 pr-4 py-3 hover:bg-dark-800/20 rounded-lg transition-colors group"
              >
                <div className={cn(
                  'absolute left-1.5 sm:left-3.5 w-3 h-3 rounded-full border-2 border-dark-950 z-10',
                  event.severity === 'success' ? 'bg-emerald-400' :
                  event.severity === 'warning' ? 'bg-amber-400' :
                  event.severity === 'error' ? 'bg-red-400' :
                  'bg-dark-500',
                )} />
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                  typeColors[event.type] || 'bg-dark-800 text-dark-400',
                )}>
                  <TypeIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-dark-200 truncate">{event.action}</p>
                    <SevIcon className={cn('h-3 w-3 shrink-0', severityColors[event.severity])} />
                  </div>
                  <p className="text-xs text-dark-400 mt-0.5 break-words">{event.detail}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] text-dark-600">
                      <Clock className="h-3 w-3" />
                      {timeAgo(event.timestamp)}
                    </span>
                    <span className="text-[10px] text-dark-600">{event.type}</span>
                    {event.agentId && (
                      <span className="text-[10px] text-dark-600">Agent: {event.agentId.replace('agent-', '')}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <ActivityIcon className="h-8 w-8 text-dark-600 mx-auto mb-2" />
              <p className="text-sm text-dark-500">No activity events match your filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return 'just now'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const d = Math.floor(hr / 24)
  return `${d}d ago`
}
