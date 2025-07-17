import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { 
  ArrowLeft,
  Users,
  Settings,
  Bell,
  Shield,
  Zap,
  Plus,
  Edit,
  Trash2,
  Mail,
  Slack,
  Calendar,
  Database,
  BarChart3,
  Save,
  X
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

interface Integration {
  id: string
  name: string
  icon: React.ReactNode
  connected: boolean
  description: string
  lastSync?: string
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  status: 'active' | 'inactive'
  permissions: string[]
}

export const TeamSettings: React.FC = () => {
  const { setCurrentView, onboardingData, setOnboardingData } = useAppStore()
  const [activeTab, setActiveTab] = useState('team')
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [newMemberEmail, setNewMemberEmail] = useState('')

  // Sample team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      role: 'CS Manager',
      avatar: '👩‍💼',
      status: 'active',
      permissions: ['admin', 'analytics', 'integrations']
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      email: 'mike@company.com',
      role: 'CS Specialist',
      avatar: '👨‍💻',
      status: 'active',
      permissions: ['tasks', 'customers']
    },
    {
      id: '3',
      name: 'Emma Thompson',
      email: 'emma@company.com',
      role: 'CS Analyst',
      avatar: '👩‍📊',
      status: 'active',
      permissions: ['analytics', 'reports']
    }
  ])

  // Sample integrations
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'salesforce',
      name: 'Salesforce',
      icon: <Database className="w-5 h-5" />,
      connected: true,
      description: 'CRM data and customer records',
      lastSync: '2 minutes ago'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      icon: <BarChart3 className="w-5 h-5" />,
      connected: false,
      description: 'Marketing and sales analytics'
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: <Slack className="w-5 h-5" />,
      connected: true,
      description: 'Team notifications and updates',
      lastSync: '5 minutes ago'
    },
    {
      id: 'calendar',
      name: 'Google Calendar',
      icon: <Calendar className="w-5 h-5" />,
      connected: false,
      description: 'Meeting scheduling and reminders'
    }
  ])

  const [notifications, setNotifications] = useState({
    standupReminders: true,
    taskDeadlines: true,
    happinessPulse: true,
    weeklyReports: false,
    slackIntegration: true,
    emailDigest: true
  })

  const handleInviteMember = () => {
    if (!newMemberEmail.trim()) return
    
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberEmail.split('@')[0],
      email: newMemberEmail,
      role: 'CS Specialist',
      avatar: '👤',
      status: 'active',
      permissions: ['tasks']
    }
    
    setTeamMembers(prev => [...prev, newMember])
    setNewMemberEmail('')
  }

  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    )
  }

  const handleUpdateNotifications = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  const MemberEditDialog: React.FC<{ member: TeamMember }> = ({ member }) => (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Team Member</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue={member.name} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue={member.email} />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Input id="role" defaultValue={member.role} />
        </div>
        <div>
          <Label>Permissions</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['admin', 'analytics', 'integrations', 'tasks', 'customers', 'reports'].map((permission) => (
              <div key={permission} className="flex items-center space-x-2">
                <Switch 
                  id={permission}
                  defaultChecked={member.permissions.includes(permission)}
                />
                <Label htmlFor={permission} className="capitalize">{permission}</Label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-4">
          <Button className="flex-1 gradient-jungwell">Save Changes</Button>
          <Button variant="outline" onClick={() => setEditingMember(null)}>Cancel</Button>
        </div>
      </div>
    </DialogContent>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setCurrentView('dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="font-poppins text-xl font-semibold">Team Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your team and workspace configuration</p>
              </div>
            </div>
            <Button className="gradient-jungwell">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-6">
            {/* Team Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{member.avatar}</div>
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        <Badge variant="secondary">{member.role}</Badge>
                        <Badge 
                          variant={member.status === 'active' ? 'default' : 'secondary'}
                          className={member.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                        >
                          {member.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <MemberEditDialog member={member} />
                        </Dialog>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Invite New Member */}
                <div className="mt-6 p-4 border-2 border-dashed border-secondary rounded-lg">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter email address to invite..."
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleInviteMember}
                      disabled={!newMemberEmail.trim()}
                      className="gradient-jungwell"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Invite
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Connected Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integrations.map((integration) => (
                    <Card key={integration.id} className="border-2">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                              {integration.icon}
                            </div>
                            <div>
                              <h4 className="font-medium">{integration.name}</h4>
                              <p className="text-sm text-muted-foreground">{integration.description}</p>
                            </div>
                          </div>
                          <Switch
                            checked={integration.connected}
                            onCheckedChange={() => handleToggleIntegration(integration.id)}
                          />
                        </div>
                        
                        {integration.connected && integration.lastSync && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span>Last sync: {integration.lastSync}</span>
                          </div>
                        )}
                        
                        {integration.connected && (
                          <Button variant="outline" size="sm" className="w-full mt-3">
                            Configure
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Stand-up Reminders</h4>
                      <p className="text-sm text-muted-foreground">Get notified when it's time for daily stand-ups</p>
                    </div>
                    <Switch
                      checked={notifications.standupReminders}
                      onCheckedChange={(value) => handleUpdateNotifications('standupReminders', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Task Deadlines</h4>
                      <p className="text-sm text-muted-foreground">Alerts for upcoming task due dates</p>
                    </div>
                    <Switch
                      checked={notifications.taskDeadlines}
                      onCheckedChange={(value) => handleUpdateNotifications('taskDeadlines', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Happiness Pulse</h4>
                      <p className="text-sm text-muted-foreground">Monthly team happiness surveys</p>
                    </div>
                    <Switch
                      checked={notifications.happinessPulse}
                      onCheckedChange={(value) => handleUpdateNotifications('happinessPulse', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Weekly Reports</h4>
                      <p className="text-sm text-muted-foreground">Summary of team performance and metrics</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(value) => handleUpdateNotifications('weeklyReports', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Slack Integration</h4>
                      <p className="text-sm text-muted-foreground">Send notifications to Slack channels</p>
                    </div>
                    <Switch
                      checked={notifications.slackIntegration}
                      onCheckedChange={(value) => handleUpdateNotifications('slackIntegration', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Digest</h4>
                      <p className="text-sm text-muted-foreground">Daily email summary of activities</p>
                    </div>
                    <Switch
                      checked={notifications.emailDigest}
                      onCheckedChange={(value) => handleUpdateNotifications('emailDigest', value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workspace" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Workspace Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input 
                      id="company"
                      value={onboardingData.companyDescription}
                      onChange={(e) => setOnboardingData({ companyDescription: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="teamSize">Team Size</Label>
                    <Input 
                      id="teamSize"
                      value={onboardingData.teamSize}
                      onChange={(e) => setOnboardingData({ teamSize: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Quarterly Goals</Label>
                    <div className="space-y-2 mt-2">
                      {onboardingData.quarterlyGoals.map((goal, index) => (
                        <div key={index} className="flex gap-2">
                          <Input 
                            value={goal}
                            onChange={(e) => {
                              const newGoals = [...onboardingData.quarterlyGoals]
                              newGoals[index] = e.target.value
                              setOnboardingData({ quarterlyGoals: newGoals })
                            }}
                            className="flex-1"
                          />
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              const newGoals = onboardingData.quarterlyGoals.filter((_, i) => i !== index)
                              setOnboardingData({ quarterlyGoals: newGoals })
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setOnboardingData({ 
                          quarterlyGoals: [...onboardingData.quarterlyGoals, ''] 
                        })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Goal
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Systems Used</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {onboardingData.systems.map((system, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {system}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => {
                              const newSystems = onboardingData.systems.filter((_, i) => i !== index)
                              setOnboardingData({ systems: newSystems })
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Shield className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-red-600">Reset Workspace</h4>
                      <p className="text-sm text-muted-foreground">Clear all data and start fresh</p>
                    </div>
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                      Reset
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-red-600">Delete Workspace</h4>
                      <p className="text-sm text-muted-foreground">Permanently delete this workspace</p>
                    </div>
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}