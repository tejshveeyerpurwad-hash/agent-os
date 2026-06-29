import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Bot, User, ArrowUp } from 'lucide-react'
import { cn } from '@/utils/cn'

const conversations = [
  { id: 'c1', title: 'Q3 Marketing Campaign Strategy', agent: 'Marketing Agent', agentId: 'agent-marketing', lastMsg: 'Campaign optimized for 4 channels. Expected reach: 2.4M impressions.', time: '2 min ago', unread: true, messages: 12 },
  { id: 'c2', title: 'Senior Engineer Hiring Pipeline', agent: 'HR Agent', agentId: 'agent-hr', lastMsg: '14 candidates shortlisted. Scheduling first-round interviews.', time: '15 min ago', unread: true, messages: 8 },
  { id: 'c3', title: 'Monthly Financial Review', agent: 'Finance Agent', agentId: 'agent-finance', lastMsg: 'Q3 expenses analyzed. 3 anomalies flagged for review.', time: '1 hour ago', unread: false, messages: 5 },
  { id: 'c4', title: 'Enterprise Deal — TechCorp', agent: 'Sales Agent', agentId: 'agent-sales', lastMsg: 'Contract sent for signature. Expected close: $85,000 ARR.', time: '3 hours ago', unread: false, messages: 2 },
  { id: 'c5', title: 'Supplier Agreement Review', agent: 'Legal Agent', agentId: 'agent-legal', lastMsg: '3 clauses flagged. Recommended revisions attached.', time: '5 hours ago', unread: false, messages: 7 },
]

const agentAvatars: Record<string, string> = {
  'agent-marketing': 'bg-pink-500/20 text-pink-400',
  'agent-hr': 'bg-emerald-500/20 text-emerald-400',
  'agent-finance': 'bg-amber-500/20 text-amber-400',
  'agent-sales': 'bg-violet-500/20 text-violet-400',
  'agent-legal': 'bg-red-500/20 text-red-400',
}

export function Conversations() {
  const [search, setSearch] = useState('')
  const [activeConv, setActiveConv] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: string; text: string; time: string }[]>([])

  const filtered = conversations.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.agent.toLowerCase().includes(search.toLowerCase())
  )

  function selectConversation(id: string) {
    setActiveConv(id)
    setMessages([
      { role: 'user', text: 'What is the current status?', time: 'Just now' },
      { role: 'agent', text: 'All tasks are in progress. Here is the latest update based on your request.', time: 'Just now' },
    ])
  }

  function sendMessage() {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: input, time: 'Just now' }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'agent', text: 'I\'ve processed your request. Let me coordinate with the relevant agents and get back to you with results.', time: 'Just now',
      }])
    }, 800)
  }

  return (
    <div className="flex h-full">
      <div className={cn('w-72 lg:w-80 border-r border-dark-800 shrink-0 overflow-y-auto', activeConv && 'hidden lg:block')}>
        <div className="p-3 lg:p-4 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-dark-100">Conversations</h2>
            <p className="text-xs text-dark-500 mt-0.5">Chat with your agents</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-dark-800/50 border border-dark-700 text-xs text-dark-200 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
          </div>
          <div className="space-y-1">
            {filtered.map(conv => (
              <button key={conv.id} onClick={() => selectConversation(conv.id)}
                className={cn(
                  'w-full text-left p-3 rounded-lg transition-colors',
                  activeConv === conv.id ? 'bg-primary-500/10 border border-primary-500/20' : 'hover:bg-dark-800/50 border border-transparent',
                )}>
                <div className="flex items-start gap-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium shrink-0', agentAvatars[conv.agentId] || 'bg-dark-800 text-dark-400')}>
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-dark-200 truncate">{conv.title}</p>
                      <span className="text-[10px] text-dark-500 shrink-0">{conv.time}</span>
                    </div>
                    <p className="text-[11px] text-dark-400 mt-0.5">{conv.agent}</p>
                    <p className="text-[11px] text-dark-500 mt-1 line-clamp-1">{conv.lastMsg}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-dark-600">{conv.messages} messages</span>
                      {conv.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={cn('flex-1 flex flex-col', !activeConv && 'hidden lg:flex')}>
        {activeConv ? (
          <>
            <div className="px-4 lg:px-6 py-3 border-b border-dark-800 flex items-center gap-3 shrink-0">
              <button onClick={() => setActiveConv(null)} className="lg:hidden p-1 text-dark-500 hover:text-dark-300">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
              </button>
              <Bot className="h-5 w-5 text-primary-400" />
              <div>
                <p className="text-xs font-semibold text-dark-200">{conversations.find(c => c.id === activeConv)?.title}</p>
                <p className="text-[11px] text-dark-500">{conversations.find(c => c.id === activeConv)?.agent}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex items-start gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    msg.role === 'user' ? 'bg-primary-500/10' : 'bg-dark-800',
                  )}>
                    {msg.role === 'user' ? <User className="h-4 w-4 text-primary-400" /> : <Bot className="h-4 w-4 text-dark-400" />}
                  </div>
                  <div className={cn(
                    'max-w-lg px-4 py-2.5 rounded-xl text-xs leading-relaxed',
                    msg.role === 'user' ? 'bg-primary-500/10 text-dark-200' : 'bg-dark-800/50 text-dark-300 border border-dark-700/50',
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="p-3 lg:p-4 border-t border-dark-800 shrink-0">
              <div className="flex items-center gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
                  placeholder="Ask your agent questions..."
                  className="flex-1 px-4 py-2.5 rounded-lg bg-dark-800/50 border border-dark-700 text-sm text-dark-200 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                />
                <button onClick={sendMessage} disabled={!input.trim()}
                  className="p-2.5 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 transition-all">
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm p-8">
              <div className="w-14 h-14 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
                <Bot className="h-7 w-7 text-dark-500" />
              </div>
              <h3 className="text-sm font-semibold text-dark-200 mb-2">Select a conversation</h3>
              <p className="text-xs text-dark-500 leading-relaxed">Choose a conversation from the left panel to start interacting with your AI agents.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
