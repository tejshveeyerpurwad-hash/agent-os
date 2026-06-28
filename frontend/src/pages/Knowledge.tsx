import { Search, Plus, FileText, FolderOpen, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardTitle, CardContent } from '@/components/ui/Card'

const categories = [
  { name: 'Product Documentation', count: 45 },
  { name: 'Customer FAQs', count: 128 },
  { name: 'Internal Policies', count: 32 },
  { name: 'Technical Guides', count: 67 },
  { name: 'Training Materials', count: 89 },
]

const recentItems = [
  { title: 'API Integration Guide v2', type: 'PDF', updated: '2 hours ago' },
  { title: 'Customer Onboarding Checklist', type: 'Doc', updated: '5 hours ago' },
  { title: 'Security Best Practices 2024', type: 'PDF', updated: '1 day ago' },
  { title: 'Product Roadmap Q3', type: 'Doc', updated: '2 days ago' },
]

export function Knowledge() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-xl font-bold text-dark-100">Knowledge Base</h1>
          <p className="text-dark-400 mt-1">Centralized business knowledge with intelligent retrieval.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<Upload className="h-4 w-4" />}>Import</Button>
          <Button leftIcon={<Plus className="h-4 w-4" />}>Add Document</Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
        <input
          type="text"
          placeholder="Search knowledge base..."
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm text-dark-200 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {recentItems.map((item) => (
            <Card key={item.title} hover>
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-primary-500/10 text-primary-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-dark-200">{item.title}</h3>
                  <p className="text-xs text-dark-500 mt-0.5">{item.type} &middot; Updated {item.updated}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card>
            <CardTitle>Categories</CardTitle>
            <CardContent>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-dark-800/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-dark-400" />
                      <span className="text-sm text-dark-300">{cat.name}</span>
                    </div>
                    <span className="text-xs text-dark-500">{cat.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
