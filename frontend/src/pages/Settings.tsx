import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Key, Palette, Database, Copy, Eye, EyeOff, Check, Moon, Plus, Trash2, RotateCcw, Terminal, Bot, Activity } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useExecutionEngine } from '@/store/executionEngine'
import { useActivityStore } from '@/store/activityStore'
import { useAgentsStore } from '@/store/agentsStore'
import { useKnowledgeStore } from '@/store/knowledgeStore'

const apiKeys = [
  { id: 'key1', name: 'Production', key: 'sk-prod-8f3a...b2e1', lastUsed: '2 min ago' },
  { id: 'key2', name: 'Development', key: 'sk-dev-7c2d...f9a4', lastUsed: '1 hour ago' },
]

const notificationEvents = [
  { id: 'n1', label: 'Workflow completions', description: 'When a workflow finishes execution', enabled: true },
  { id: 'n2', label: 'Agent errors', description: 'When an agent encounters an error', enabled: true },
  { id: 'n3', label: 'Approval requests', description: 'When an approval is needed', enabled: true },
  { id: 'n4', label: 'Execution results', description: 'When an execution completes', enabled: false },
  { id: 'n5', label: 'System updates', description: 'Platform updates and maintenance', enabled: false },
]

export function Settings() {
  const [activeTab, setActiveTab] = useState('system')
  const [notifications, setNotifications] = useState(notificationEvents)
  const [showApiKey, setShowApiKey] = useState(false)
  const [copyId, setCopyId] = useState<string | null>(null)
  const { clearCompleted, executions, approvals } = useExecutionEngine()
  const activityStore = useActivityStore()
  const agentsStore = useAgentsStore()
  const knowledgeStore = useKnowledgeStore()

  function toggleNotification(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n))
  }

  function copyKey(id: string) {
    setCopyId(id)
    setTimeout(() => setCopyId(null), 2000)
  }

  function resetSystem() {
    clearCompleted()
    activityStore.clear()
    agentsStore.resetAll()
  }

  const tabs = [
    { id: 'system', label: 'System', icon: Terminal },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'data', label: 'Data', icon: Database },
  ]

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-dark-100 tracking-tight">Settings</h1>
        <p className="text-sm text-dark-400 mt-0.5">System configuration and management</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap focus-ring',
                activeTab === tab.id ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'bg-dark-800/30 text-dark-400 hover:text-dark-300 border border-transparent',
              )}>
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="w-full max-w-2xl">
        {activeTab === 'system' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <Card>
              <CardTitle>System Status</CardTitle>
              <CardContent>
                <div className="mt-3 space-y-3 text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-dark-800/30">
                    <span className="text-dark-400">Executions processed</span>
                    <span className="text-dark-200 font-medium">{executions.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-dark-800/30">
                    <span className="text-dark-400">Pending approvals</span>
                    <span className="text-dark-200 font-medium">{approvals.filter(a => a.status === 'pending').length}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-dark-800/30">
                    <span className="text-dark-400">Activity events</span>
                    <span className="text-dark-200 font-medium">{activityStore.events.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-dark-800/30">
                    <span className="text-dark-400">Knowledge items</span>
                    <span className="text-dark-200 font-medium">{knowledgeStore.items.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-dark-800/30">
                    <span className="text-dark-400">Registered agents</span>
                    <span className="text-dark-200 font-medium">{agentsStore.agents.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardTitle>System Actions</CardTitle>
              <CardContent>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-dark-800/30">
                    <div>
                      <p className="text-sm font-medium text-dark-200">Reset System State</p>
                      <p className="text-xs text-dark-500">Clear all executions, approvals, and activity events</p>
                    </div>
                    <Button variant="outline" size="sm" leftIcon={<RotateCcw className="h-3.5 w-3.5" />} onClick={resetSystem}>
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <Card>
              <CardTitle>Notification Preferences</CardTitle>
              <CardContent>
                <div className="mt-3 space-y-2">
                  {notifications.map(n => (
                    <div key={n.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-800/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-dark-200">{n.label}</p>
                        <p className="text-xs text-dark-500">{n.description}</p>
                      </div>
                      <button onClick={() => toggleNotification(n.id)}
                        role="switch"
                        aria-checked={n.enabled}
                        className={cn(
                          'relative w-10 h-5 rounded-full transition-all duration-300 focus-ring',
                          n.enabled ? 'bg-primary-500' : 'bg-dark-700',
                        )}>
                        <div className={cn(
                          'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow',
                          n.enabled ? 'left-5' : 'left-0.5',
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'agents' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <Card>
              <CardTitle>Agent Configuration</CardTitle>
              <CardContent>
                <div className="mt-3 space-y-2">
                  {agentsStore.agents.map(agent => (
                    <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg bg-dark-800/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-dark-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-dark-200">{agent.name}</p>
                          <p className="text-xs text-dark-500">{agent.role} · {agent.capabilities.slice(0, 3).join(', ')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-dark-500">
                        <span>{agent.confidence}%</span>
                        <span>{agent.taskCount} tasks</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardTitle>Reset Agents</CardTitle>
              <CardContent>
                <div className="mt-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-dark-800/30">
                    <div>
                      <p className="text-sm font-medium text-dark-200">Reset All Agent Memory</p>
                      <p className="text-xs text-dark-500">Clear agent memory and reset task counts</p>
                    </div>
                    <Button variant="outline" size="sm" leftIcon={<RotateCcw className="h-3.5 w-3.5" />} onClick={() => agentsStore.resetAll()}>
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'api-keys' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <CardTitle>API Keys</CardTitle>
                <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>Generate Key</Button>
              </div>
              <CardContent>
                <div className="space-y-3">
                  {apiKeys.map(k => (
                    <div key={k.id} className="p-3 rounded-lg bg-dark-800/30 border border-dark-800">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-dark-200">{k.name}</p>
                        <div className="flex items-center gap-1">
                          <button onClick={() => copyKey(k.id)}
                            className="p-1.5 rounded text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-colors focus-ring"
                            aria-label="Copy API key">
                            {copyId === k.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                          <button onClick={() => setShowApiKey(!showApiKey)}
                            className="p-1.5 rounded text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-colors focus-ring"
                            aria-label={showApiKey ? 'Hide API key' : 'Show API key'}>
                            {showApiKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                          <button className="p-1.5 rounded text-dark-500 hover:text-red-400 hover:bg-red-500/10 transition-colors focus-ring"
                            aria-label="Delete API key">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs font-mono text-dark-400 mb-2">{k.key}</p>
                      <p className="text-[11px] text-dark-500">Last used: {k.lastUsed}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'data' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <Card>
              <CardTitle>Data Management</CardTitle>
              <CardContent>
                <div className="mt-3 space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-dark-800/30">
                    <div>
                      <p className="text-sm font-medium text-dark-200">Export Activity Log</p>
                      <p className="text-xs text-dark-500">Download all activity events as JSON</p>
                    </div>
                    <Button variant="outline" size="sm">Export</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-dark-800/30">
                    <div>
                      <p className="text-sm font-medium text-dark-200">Export Knowledge Base</p>
                      <p className="text-xs text-dark-500">Download all knowledge items as JSON</p>
                    </div>
                    <Button variant="outline" size="sm">Export</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                    <div>
                      <p className="text-sm font-medium text-dark-200">Clear All Activity</p>
                      <p className="text-xs text-dark-500">Permanently remove all activity events</p>
                    </div>
                    <Button variant="danger" size="sm" onClick={() => { if (window.confirm('Are you sure you want to clear all activity? This cannot be undone.')) { activityStore.clear() } }}>Clear</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
