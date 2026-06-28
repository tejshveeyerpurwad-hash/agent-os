import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Bot, Clock, Users as UsersIcon, FileText } from 'lucide-react'
import { cn } from '@/utils/cn'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const events = [
  { id: 'e1', title: 'Q3 Marketing Review', agent: 'Marketing Agent', time: '09:00 AM', type: 'meeting' },
  { id: 'e2', title: 'Hiring Pipeline Sync', agent: 'HR Agent', time: '10:30 AM', type: 'meeting' },
  { id: 'e3', title: 'Budget Approval Deadline', agent: 'Finance Agent', time: '12:00 PM', type: 'deadline' },
  { id: 'e4', title: 'Weekly Executive Report', agent: 'CEO Agent', time: '02:00 PM', type: 'report' },
  { id: 'e5', title: 'Candidate Interviews', agent: 'HR Agent', time: '03:30 PM', type: 'meeting' },
]

const dayEvents: Record<number, typeof events> = {
  12: events.slice(0, 2),
  13: events.slice(2, 3),
  15: events.slice(3, 5),
}

export function Calendar() {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year] = useState(new Date().getFullYear())
  const [selectedDay, setSelectedDay] = useState(15)

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const gridDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  function getEventColor(type: string) {
    switch (type) {
      case 'meeting': return 'border-l-primary-400 bg-primary-500/5'
      case 'deadline': return 'border-l-red-400 bg-red-500/5'
      case 'report': return 'border-l-emerald-400 bg-emerald-500/5'
      default: return 'border-l-dark-500 bg-dark-800/30'
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-dark-100 tracking-tight">Calendar</h1>
        <p className="text-sm text-dark-400 mt-0.5">Agent-scheduled events and business milestones</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-dark-800 bg-dark-900/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-dark-800">
              <button onClick={() => setMonth(m => m - 1)} className="p-1 rounded text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h2 className="text-sm font-semibold text-dark-100">{months[month]} {year}</h2>
              <button onClick={() => setMonth(m => m + 1)} className="p-1 rounded text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 mb-2">
                {days.map(d => (
                  <div key={d} className="text-center text-[11px] font-medium text-dark-500 py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {gridDays.map(day => {
                  const hasEvents = !!dayEvents[day]
                  const isSelected = day === selectedDay
                  return (
                    <button key={day} onClick={() => setSelectedDay(day)}
                      className={cn(
                        'relative h-9 rounded-lg text-xs font-medium transition-all',
                        isSelected ? 'bg-primary-500 text-white' :
                        hasEvents ? 'bg-primary-500/10 text-primary-400 hover:bg-primary-500/20' :
                        'text-dark-400 hover:bg-dark-800',
                      )}>
                      {day}
                      {hasEvents && !isSelected && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-400" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-dark-800 bg-dark-900/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-dark-800">
              <h2 className="text-sm font-semibold text-dark-100">
                {months[month]} {selectedDay}, {year}
              </h2>
            </div>
            <div className="divide-y divide-dark-800">
              {(dayEvents[selectedDay] || []).length > 0 ? (
                (dayEvents[selectedDay] || []).map((evt) => (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn('px-4 py-3 border-l-2', getEventColor(evt.type))}
                  >
                    <p className="text-sm font-medium text-dark-200">{evt.title}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-[11px] text-dark-500">
                        <Clock className="h-3 w-3" /> {evt.time}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-dark-500">
                        <Bot className="h-3 w-3" /> {evt.agent}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-dark-500">No events scheduled</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
