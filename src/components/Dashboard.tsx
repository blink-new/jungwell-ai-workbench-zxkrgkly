import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Mic, 
  Calendar, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Sparkles,
  MessageSquare,
  Heart,
  Bot,
  Home
} from 'lucide-react'
import { JungwellLogo } from './JungwellLogo'
import { HappinessPulse } from './HappinessPulse'
import { AIAgents } from './AIAgents'
import { useAppStore } from '../store/useAppStore'

export const Dashboard: React.FC = () => {
  const { onboardingData, setCurrentView, setStandupMode } = useAppStore()

  const handleStartStandup = () => {
    setStandupMode(true)
    setCurrentView('standup')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <JungwellLogo size="md" />
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                Setup Complete
              </Badge>
              <Button 
                onClick={handleStartStandup}
                className="gradient-jungwell hover:opacity-90 transition-opacity"
              >
                <Mic className="w-4 h-4 mr-2" />
                Start Stand-up
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-poppins text-3xl font-semibold mb-2">
            Welcome to your CS Workbench! 🚀
          </h1>
          <p className="text-muted-foreground text-lg">
            {onboardingData.companyDescription || "Ready to plan, act, and measure your Customer Success work."}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleStartStandup}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 gradient-jungwell rounded-xl flex items-center justify-center">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Daily Stand-up</h3>
                  <p className="text-sm text-muted-foreground">Voice-powered check-ins</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('kanban')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Kanban Board</h3>
                  <p className="text-sm text-muted-foreground">Manage your backlog</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('analytics')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Impact Analytics</h3>
                  <p className="text-sm text-muted-foreground">Track your KPIs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('settings')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Team Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage your team</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('integrations')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Integrations</h3>
                  <p className="text-sm text-muted-foreground">Connect your tools</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('voice')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Voice Collaboration</h3>
                  <p className="text-sm text-muted-foreground">Team voice calls</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="pulse" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Team Pulse
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Today's Focus */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-jungwell-red" />
                      Today's Focus
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <div className="w-2 h-2 bg-jungwell-red rounded-full" />
                        <span className="flex-1">Review Q4 renewal pipeline</span>
                        <Badge variant="outline">High Priority</Badge>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <div className="w-2 h-2 bg-jungwell-orange rounded-full" />
                        <span className="flex-1">Update customer health scores</span>
                        <Badge variant="outline">Medium</Badge>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="flex-1">Prepare onboarding materials</span>
                        <Badge variant="outline">Low</Badge>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => setCurrentView('kanban')}
                    >
                      View Full Board
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Sprint Progress</span>
                        <span className="font-semibold">73%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-gradient-to-r from-jungwell-red to-jungwell-orange h-2 rounded-full" style={{ width: '73%' }} />
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-muted-foreground">Team Happiness</span>
                        <span className="font-semibold">4.2/5</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`w-4 h-4 rounded-full ${
                              star <= 4 ? 'bg-yellow-400' : 'bg-secondary'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-jungwell-orange" />
                      AI Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-jungwell-red/10 to-jungwell-orange/10 rounded-lg border border-jungwell-orange/20">
                        <p className="text-sm">Consider scheduling a customer health review meeting this week.</p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-jungwell-red/10 to-jungwell-orange/10 rounded-lg border border-jungwell-orange/20">
                        <p className="text-sm">Your renewal rate is trending up! Time to document what's working.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Team Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Team Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full" />
                    </div>
                    <h4 className="font-semibold">Sarah Chen</h4>
                    <p className="text-sm text-muted-foreground">CS Manager</p>
                    <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">Online</Badge>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full" />
                    </div>
                    <h4 className="font-semibold">Mike Rodriguez</h4>
                    <p className="text-sm text-muted-foreground">CS Specialist</p>
                    <Badge variant="secondary" className="mt-2 bg-yellow-100 text-yellow-700">In Meeting</Badge>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full" />
                    </div>
                    <h4 className="font-semibold">Emma Thompson</h4>
                    <p className="text-sm text-muted-foreground">CS Analyst</p>
                    <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">Online</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pulse">
            <HappinessPulse />
          </TabsContent>

          <TabsContent value="agents">
            <AIAgents />
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-jungwell-orange" />
                    Weekly Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">🎉 Celebration</h4>
                      <p className="text-sm text-green-700">
                        Your team completed 8 out of 10 sprint tasks this week - that's 20% above your average!
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">📊 Trend Alert</h4>
                      <p className="text-sm text-blue-700">
                        Customer health scores have improved by 12% since implementing the new onboarding process.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Action Needed</h4>
                      <p className="text-sm text-yellow-700">
                        3 high-value accounts haven't had check-ins in over 2 weeks. Consider scheduling calls.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">🚀 Opportunity</h4>
                      <p className="text-sm text-purple-700">
                        Based on usage patterns, 5 accounts are ready for upsell conversations this month.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}