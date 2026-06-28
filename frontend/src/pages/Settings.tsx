import { Bell, Shield, User, Palette, Key, Database } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const sections = [
  { icon: User, label: 'Profile', description: 'Manage your account settings and preferences' },
  { icon: Bell, label: 'Notifications', description: 'Configure how you receive alerts and updates' },
  { icon: Shield, label: 'Security', description: 'Password, 2FA, and session management' },
  { icon: Key, label: 'API Keys', description: 'Manage API keys for external integrations' },
  { icon: Palette, label: 'Appearance', description: 'Customize the look and feel of AgentOS' },
  { icon: Database, label: 'Data Management', description: 'Data retention, export, and backups' },
]

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-xl font-bold text-dark-100">Settings</h1>
        <p className="text-dark-400 mt-1">Manage your account and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card key={section.label} hover>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-dark-800 text-dark-400">
                  <section.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm">{section.label}</CardTitle>
                  <p className="text-xs text-dark-500 mt-0.5">{section.description}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardTitle>Email Preferences</CardTitle>
        <CardContent>
          <div className="space-y-4 max-w-md">
            <Input label="Email Address" type="email" placeholder="you@company.com" defaultValue="admin@agentos.ai" />
            <Input label="Display Name" type="text" placeholder="Your name" defaultValue="Admin User" />
            <div className="pt-2">
              <Button>Save Changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
