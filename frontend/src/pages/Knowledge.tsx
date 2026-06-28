import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, FileText, BookOpen, Upload, Sparkles, Tag, Clock, Globe, Shield, Users, Briefcase, MoreHorizontal, Download, Star, Bot, ChevronRight, Building, FileSignature, Library, User } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useKnowledgeStore } from '@/store/knowledgeStore'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'

const typeConfig: Record<string, { label: string; icon: typeof FileText; color: string }> = {
  document: { label: 'Document', icon: FileText, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  policy: { label: 'Policy', icon: Library, color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  employee: { label: 'Employee', icon: User, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  customer: { label: 'Customer', icon: Building, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  project: { label: 'Project', icon: Briefcase, color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  invoice: { label: 'Invoice', icon: FileSignature, color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  contract: { label: 'Contract', icon: FileSignature, color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  note: { label: 'Note', icon: BookOpen, color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
}

export function Knowledge() {
  const { items, search, searchResults, searchQuery, selectedItem, selectItem, getRelated, isLoading } = useKnowledgeStore()
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  function handleSearch() {
    search(query)
  }

  function handleSelect(item: typeof items[0]) {
    selectItem(item)
    setIsDetailOpen(true)
  }

  const typeCounts = items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const visible = searchQuery ? searchResults : items
  const filtered = selectedType ? visible.filter(i => i.type === selectedType) : visible

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-dark-100 tracking-tight">Knowledge</h1>
          <p className="text-sm text-dark-400 mt-0.5">Searchable company knowledge store — connected to every agent</p>
        </div>
        <Button leftIcon={<Sparkles className="h-4 w-4" />}>Add Document</Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
            placeholder="Search documents, policies, employees, customers..."
            className="w-full pl-9 pr-12 py-2.5 rounded-lg bg-dark-800/50 border border-dark-700 text-sm text-dark-200 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40" />
          <button onClick={handleSearch}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-primary-500/10 text-[10px] text-primary-400 font-medium hover:bg-primary-500/20 transition-colors">
            Search
          </button>
        </div>
      </div>

      {searchQuery && (
        <div className="flex items-center gap-2 text-xs text-dark-500">
          <Sparkles className="h-3.5 w-3.5 text-primary-400" />
          {isLoading ? 'Searching...' : `Found ${searchResults.length} results for "${searchQuery}"`}
          <button onClick={() => { setQuery(''); useKnowledgeStore.getState().clearSearch() }}
            className="text-primary-400 hover:text-primary-300">Clear</button>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="hidden lg:block space-y-1">
          <p className="text-[11px] font-semibold text-dark-500 uppercase tracking-wider mb-2 px-2">Types</p>
          {Object.entries(typeConfig).map(([type, cfg]) => {
            const Icon = cfg.icon
            return (
              <button key={type} onClick={() => setSelectedType(type === selectedType ? null : type)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all',
                  selectedType === type ? 'bg-primary-500/10 text-primary-400' : 'text-dark-400 hover:text-dark-300 hover:bg-dark-800/50',
                )}>
                <div className={cn('p-1 rounded', cfg.color)}>
                  <Icon className="h-3 w-3" />
                </div>
                <span className="flex-1 text-left">{cfg.label}</span>
                <span className="text-dark-500">{typeCounts[type] || 0}</span>
              </button>
            )
          })}
        </div>

        <div className="lg:col-span-3 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-8 w-8 text-dark-600 mx-auto mb-2" />
              <p className="text-sm text-dark-500">No items found</p>
            </div>
          ) : (
            filtered.map((item, i) => {
              const cfg = typeConfig[item.type] || typeConfig.document
              const Icon = cfg.icon
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => handleSelect(item)}
                  className="group rounded-xl border border-dark-800 bg-dark-900/50 p-4 hover:border-dark-700 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn('p-2.5 rounded-lg shrink-0', cfg.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-dark-100">{item.title}</p>
                      </div>
                      <p className="text-xs text-dark-400 line-clamp-2 mb-2">{item.content}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded border', cfg.color)}>{cfg.label}</span>
                        {item.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] text-dark-500 bg-dark-800/50 px-1.5 py-0.5 rounded">{tag}</span>
                        ))}
                        <span className="text-[10px] text-dark-600">
                          Updated {new Date(item.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-dark-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>

      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title={selectedItem?.title} size="xl">
        {selectedItem && (() => {
          const cfg = typeConfig[selectedItem.type] || typeConfig.document
          const related = getRelated(selectedItem)
          return (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <span className={cn('text-[11px] px-1.5 py-0.5 rounded border', cfg.color)}>{cfg.label}</span>
                {selectedItem.tags.map(tag => (
                  <span key={tag} className="text-[11px] px-1.5 py-0.5 rounded bg-dark-800 text-dark-400 border border-dark-700">{tag}</span>
                ))}
              </div>
              <p className="text-sm text-dark-400 leading-relaxed">{selectedItem.content}</p>
              <div className="space-y-1 text-xs text-dark-500">
                <p>Created: {new Date(selectedItem.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(selectedItem.updatedAt).toLocaleDateString()}</p>
                {Object.entries(selectedItem.metadata).map(([k, v]) => (
                  <p key={k}>{k}: {v}</p>
                ))}
              </div>
              {related.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-dark-300 mb-2">Related Items</p>
                  <div className="space-y-1">
                    {related.map(r => (
                      <button key={r.id}
                        onClick={() => { selectItem(r); useKnowledgeStore.getState(); setIsDetailOpen(true) }}
                        className="w-full text-left flex items-center gap-2 p-2 rounded-lg bg-dark-800/30 text-xs text-dark-400 hover:text-dark-300 hover:bg-dark-800/50 transition-colors">
                        <FileText className="h-3 w-3 shrink-0" />
                        {r.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>Export</Button>
                <Button leftIcon={<Sparkles className="h-4 w-4" />}>Ask AI</Button>
              </div>
            </div>
          )
        })()}
      </Modal>
    </div>
  )
}
