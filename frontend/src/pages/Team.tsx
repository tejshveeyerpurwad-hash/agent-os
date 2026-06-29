import { motion } from 'framer-motion'
import { Mail, MoreHorizontal, Search } from 'lucide-react'
import { cn } from '@/utils/cn'

const team = [
  { id: 't1', name: 'Alex Chen', role: 'CEO', email: 'alex@agentos.ai', status: 'online', avatar: 'AC' },
  { id: 't2', name: 'Sarah Park', role: 'VP Engineering', email: 'sarah@agentos.ai', status: 'online', avatar: 'SP' },
  { id: 't3', name: 'Marcus Johnson', role: 'Head of Product', email: 'marcus@agentos.ai', status: 'away', avatar: 'MJ' },
  { id: 't4', name: 'Emily Rodriguez', role: 'VP Marketing', email: 'emily@agentos.ai', status: 'online', avatar: 'ER' },
  { id: 't5', name: 'David Kim', role: 'CTO', email: 'david@agentos.ai', status: 'offline', avatar: 'DK' },
  { id: 't6', name: 'Lisa Wang', role: 'Head of Sales', email: 'lisa@agentos.ai', status: 'online', avatar: 'LW' },
  { id: 't7', name: 'James Thompson', role: 'VP Operations', email: 'james@agentos.ai', status: 'away', avatar: 'JT' },
  { id: 't8', name: 'Nina Patel', role: 'Legal Counsel', email: 'nina@agentos.ai', status: 'online', avatar: 'NP' },
]

const statusColors: Record<string, string> = {
  online: 'bg-emerald-400',
  away: 'bg-amber-400',
  offline: 'bg-dark-500',
}

export function Team() {
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-dark-100 tracking-tight">Team</h1>
          <p className="text-sm text-dark-400 mt-0.5">Your team members and their assigned AI agents</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
          <input placeholder="Search team..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-dark-800/50 border border-dark-700 text-sm text-dark-200 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {team.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -2 }}
            className="group rounded-xl border border-dark-800 bg-dark-900/50 p-5 hover:border-dark-700 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 
                  flex items-center justify-center text-white font-semibold text-sm">
                  {member.avatar}
                </div>
                <span className={cn(
                  'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-dark-900',
                  statusColors[member.status],
                )} />
              </div>
              <button className="p-1 rounded text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-colors opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm font-semibold text-dark-100">{member.name}</p>
            <p className="text-xs text-dark-400">{member.role}</p>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dark-800">
              <Mail className="h-3.5 w-3.5 text-dark-500" />
              <span className="text-[11px] text-dark-500 truncate">{member.email}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
