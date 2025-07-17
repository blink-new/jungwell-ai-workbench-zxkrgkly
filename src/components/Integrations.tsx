import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { 
  Database,
  BarChart3,
  Slack,
  Calendar,
  Mail,
  Zap,
  CheckCircle2,
  AlertCircle,
  Settings,
  ExternalLink,
  Key,
  RefreshCw,
  Trash2,
  Plus,
  ArrowLeft
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

interface Integration {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  category: 'crm' | 'analytics' | 'communication' | 'productivity'
  status: 'connected' | 'disconnected' | 'error' | 'syncing'
  lastSync?: string
  features: string[]
  setupUrl?: string
  apiKeyRequired?: boolean
  oauthSupported?: boolean
}

interface IntegrationConfig {
  id: string
  apiKey?: string
  webhookUrl?: string
  syncFrequency: 'realtime' | 'hourly' | 'daily'
  enabledFeatures: string[]
}

export const Integrations: React.FC = () => {
  const { setCurrentView } = useAppStore()
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [configs, setConfigs] = useState<Record<string, IntegrationConfig>>({})
  const [isConnecting, setIsConnecting] = useState<string | null>(null)

  const integrations: Integration[] = [
    {
      id: 'salesforce',
      name: 'Salesforce',
      icon: <Database className="w-6 h-6" />,
      description: 'Sync customer data, opportunities, and account health scores',
      category: 'crm',
      status: 'connected',
      lastSync: '2 minutes ago',
      features: ['Customer Records', 'Opportunity Pipeline', 'Account Health', 'Activity Tracking'],
      oauthSupported: true,
      setupUrl: 'https://login.salesforce.com/services/oauth2/authorize'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'Import contacts, deals, and marketing analytics',
      category: 'crm',
      status: 'disconnected',
      features: ['Contact Management', 'Deal Pipeline', 'Marketing Analytics', 'Email Tracking'],
      oauthSupported: true,
      setupUrl: 'https://app.hubspot.com/oauth/authorize'
    },
    {
      id: 'gainsight',
      name: 'Gainsight',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'Customer success metrics and health scores',
      category: 'analytics',
      status: 'disconnected',
      features: ['Health Scores', 'Success Metrics', 'Risk Alerts', 'Renewal Tracking'],
      apiKeyRequired: true
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: <Slack className="w-6 h-6" />,
      description: 'Send notifications and updates to team channels',
      category: 'communication',
      status: 'connected',
      lastSync: '5 minutes ago',
      features: ['Channel Notifications', 'Stand-up Reminders', 'Task Updates', 'Alert Routing'],
      oauthSupported: true,
      setupUrl: 'https://slack.com/oauth/v2/authorize'
    },
    {
      id: 'zoom',
      name: 'Zoom',
      icon: <Calendar className="w-6 h-6" />,
      description: 'Schedule and manage customer meetings',
      category: 'communication',
      status: 'disconnected',
      features: ['Meeting Scheduling', 'Recording Access', 'Participant Analytics', 'Calendar Sync'],
      oauthSupported: true
    },
    {
      id: 'tableau',
      name: 'Tableau',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'Advanced analytics and custom dashboards',
      category: 'analytics',
      status: 'error',
      features: ['Custom Dashboards', 'Data Visualization', 'Report Automation', 'KPI Tracking'],
      apiKeyRequired: true
    },
    {
      id: 'jira',
      name: 'Jira',
      icon: <Settings className="w-6 h-6" />,
      description: 'Track customer issues and feature requests',
      category: 'productivity',
      status: 'disconnected',
      features: ['Issue Tracking', 'Feature Requests', 'Bug Reports', 'Sprint Planning'],
      oauthSupported: true
    },
    {
      id: 'gmail',
      name: 'Gmail',
      icon: <Mail className="w-6 h-6" />,
      description: 'Email integration for customer communications',
      category: 'communication',
      status: 'disconnected',
      features: ['Email Sync', 'Template Management', 'Auto-responses', 'Thread Tracking'],
      oauthSupported: true
    }
  ]

  const handleConnect = async (integration: Integration) => {
    setIsConnecting(integration.id)
    
    try {
      if (integration.oauthSupported) {
        // Simulate OAuth flow
        console.log(`Starting OAuth flow for ${integration.name}`)
        // In real implementation, this would redirect to OAuth provider
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Update integration status
        const updatedIntegration = { ...integration, status: 'connected' as const, lastSync: 'Just now' }
        console.log('Connected:', updatedIntegration)
      } else if (integration.apiKeyRequired) {
        // Show API key configuration dialog
        setSelectedIntegration(integration)
      }
    } catch (error) {
      console.error('Connection failed:', error)
    } finally {
      setIsConnecting(null)
    }
  }

  const handleDisconnect = (integrationId: string) => {
    console.log(`Disconnecting ${integrationId}`)
    // Remove from configs
    const newConfigs = { ...configs }
    delete newConfigs[integrationId]
    setConfigs(newConfigs)
  }

  const handleSync = async (integrationId: string) => {
    console.log(`Syncing ${integrationId}`)
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Connected</Badge>
      case 'syncing':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Syncing</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Error</Badge>
      default:
        return <Badge variant="secondary">Disconnected</Badge>
    }
  }

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getCategoryColor = (category: Integration['category']) => {
    switch (category) {
      case 'crm':
        return 'bg-blue-100 text-blue-700'
      case 'analytics':
        return 'bg-purple-100 text-purple-700'
      case 'communication':
        return 'bg-green-100 text-green-700'
      case 'productivity':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const IntegrationConfigDialog: React.FC<{ integration: Integration }> = ({ integration }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            {integration.icon}
          </div>
          Configure {integration.name}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {integration.apiKeyRequired && (
          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key..."
                className="flex-1"
              />
              <Button variant="outline">
                <Key className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Find your API key in your {integration.name} account settings
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
          <Input
            id="webhookUrl"
            placeholder="https://your-app.com/webhooks/integration"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Configure webhooks for real-time updates
          </p>
        </div>

        <div>
          <Label>Sync Frequency</Label>
          <div className="flex gap-2 mt-2">
            {['realtime', 'hourly', 'daily'].map((freq) => (
              <Button
                key={freq}
                variant="outline"
                size="sm"
                className="capitalize"
              >
                {freq}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label>Enabled Features</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {integration.features.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Switch id={feature} defaultChecked />
                <Label htmlFor={feature} className="text-sm">{feature}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button className="flex-1 gradient-jungwell">
            Save Configuration
          </Button>
          <Button variant="outline">
            Test Connection
          </Button>
        </div>
      </div>
    </DialogContent>
  )

  const categories = Array.from(new Set(integrations.map(i => i.category)))

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
                <h1 className="font-poppins text-xl font-semibold">Integrations</h1>
                <p className="text-sm text-muted-foreground">Connect your favorite tools to sync data and automate workflows</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-semibold">
                      {integrations.filter(i => i.status === 'connected').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Connected</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-semibold">
                      {integrations.filter(i => i.status === 'syncing').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Syncing</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="font-semibold">
                      {integrations.filter(i => i.status === 'error').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Errors</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="font-semibold">{integrations.length}</div>
                    <div className="text-xs text-muted-foreground">Available</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Integration Categories */}
          {categories.map((category) => (
            <div key={category}>
              <h3 className="font-poppins text-lg font-semibold mb-4 capitalize flex items-center gap-2">
                <Badge className={getCategoryColor(category)}>{category}</Badge>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations
                  .filter(integration => integration.category === category)
                  .map((integration) => (
                    <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                              {integration.icon}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              <p className="text-sm text-muted-foreground font-normal">
                                {integration.description}
                              </p>
                            </div>
                          </div>
                          {getStatusIcon(integration.status)}
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            {getStatusBadge(integration.status)}
                            {integration.lastSync && (
                              <span className="text-xs text-muted-foreground">
                                Last sync: {integration.lastSync}
                              </span>
                            )}
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Features</h4>
                            <div className="flex flex-wrap gap-1">
                              {integration.features.slice(0, 3).map((feature) => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {integration.features.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{integration.features.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {integration.status === 'connected' ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSync(integration.id)}
                                  className="flex-1"
                                >
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Sync
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Settings className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <IntegrationConfigDialog integration={integration} />
                                </Dialog>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDisconnect(integration.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                onClick={() => handleConnect(integration)}
                                disabled={isConnecting === integration.id}
                                className="flex-1 gradient-jungwell hover:opacity-90 transition-opacity"
                              >
                                {isConnecting === integration.id ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Connecting...
                                  </>
                                ) : (
                                  <>
                                    <Zap className="w-4 h-4 mr-2" />
                                    Connect
                                  </>
                                )}
                              </Button>
                            )}
                          </div>

                          {integration.setupUrl && integration.status !== 'connected' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => window.open(integration.setupUrl, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Setup Guide
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}

          {/* Custom Integration */}
          <Card className="border-dashed border-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-poppins text-lg font-semibold mb-2">Need a Custom Integration?</h3>
              <p className="text-muted-foreground mb-4">
                We can build custom integrations for your specific tools and workflows
              </p>
              <Button className="gradient-jungwell">
                Request Integration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}