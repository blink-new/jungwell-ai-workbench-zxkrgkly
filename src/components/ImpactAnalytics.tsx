import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target, 
  Users, 
  DollarSign,
  ArrowLeft,
  RefreshCw,
  Calendar,
  Download,
  Settings
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

interface KPI {
  id: string
  name: string
  current: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  change: number
  period: string
}

interface ChartData {
  month: string
  actual: number
  target: number
}

export const ImpactAnalytics: React.FC = () => {
  const { setCurrentView, onboardingData } = useAppStore()
  const [selectedPeriod, setSelectedPeriod] = useState('3m')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Sample KPI data
  const [kpis] = useState<KPI[]>([
    {
      id: 'ndr',
      name: 'Net Dollar Retention',
      current: 118,
      target: 120,
      unit: '%',
      trend: 'up',
      change: 5.2,
      period: 'vs last quarter'
    },
    {
      id: 'renewal',
      name: 'Renewal Rate',
      current: 94,
      target: 95,
      unit: '%',
      trend: 'up',
      change: 2.1,
      period: 'vs last quarter'
    },
    {
      id: 'csat',
      name: 'Customer Satisfaction',
      current: 4.3,
      target: 4.5,
      unit: '/5',
      trend: 'stable',
      change: 0.1,
      period: 'vs last month'
    },
    {
      id: 'health',
      name: 'Avg Health Score',
      current: 78,
      target: 85,
      unit: '/100',
      trend: 'up',
      change: 3.5,
      period: 'vs last month'
    },
    {
      id: 'expansion',
      name: 'Expansion Revenue',
      current: 245000,
      target: 300000,
      unit: '$',
      trend: 'up',
      change: 12.3,
      period: 'vs last quarter'
    },
    {
      id: 'churn',
      name: 'Churn Rate',
      current: 3.2,
      target: 2.5,
      unit: '%',
      trend: 'down',
      change: -0.8,
      period: 'vs last quarter'
    }
  ])

  // Sample chart data
  const [chartData] = useState<ChartData[]>([
    { month: 'Oct', actual: 92, target: 95 },
    { month: 'Nov', actual: 93, target: 95 },
    { month: 'Dec', actual: 94, target: 95 },
    { month: 'Jan', actual: 94, target: 95 }
  ])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
  }

  const formatValue = (value: number, unit: string) => {
    if (unit === '$') {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `${value}${unit}`
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <BarChart3 className="w-4 h-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string, isPositive: boolean = true) => {
    if (trend === 'stable') return 'text-gray-500'
    if ((trend === 'up' && isPositive) || (trend === 'down' && !isPositive)) {
      return 'text-green-500'
    }
    return 'text-red-500'
  }

  const KPICard: React.FC<{ kpi: KPI }> = ({ kpi }) => {
    const progress = (kpi.current / kpi.target) * 100
    const isOnTrack = progress >= 90
    const isPositiveTrend = kpi.id !== 'churn' // Churn is negative metric
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">{kpi.name}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold">
                  {formatValue(kpi.current, kpi.unit)}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {formatValue(kpi.target, kpi.unit)}
                </span>
              </div>
            </div>
            <Badge 
              variant={isOnTrack ? "default" : "secondary"}
              className={isOnTrack ? "bg-green-100 text-green-700 border-green-200" : ""}
            >
              {isOnTrack ? "On Track" : "Behind"}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  isOnTrack ? 'bg-green-500' : 'bg-jungwell-orange'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {getTrendIcon(kpi.trend)}
                <span className={`text-sm font-medium ${getTrendColor(kpi.trend, isPositiveTrend)}`}>
                  {kpi.change > 0 ? '+' : ''}{kpi.change}%
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{kpi.period}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

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
                <h1 className="font-poppins text-xl font-semibold">Impact Analytics</h1>
                <p className="text-sm text-muted-foreground">Track your KPIs and measure success</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Period Selector */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Period:</span>
          </div>
          <div className="flex gap-2">
            {['1m', '3m', '6m', '1y'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className={selectedPeriod === period ? "gradient-jungwell" : ""}
              >
                {period === '1m' ? '1 Month' : 
                 period === '3m' ? '3 Months' :
                 period === '6m' ? '6 Months' : '1 Year'}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="retention">Retention</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kpis.map((kpi) => (
                <KPICard key={kpi.id} kpi={kpi} />
              ))}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    Goals on Track
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500 mb-2">4/6</div>
                  <p className="text-sm text-muted-foreground">
                    Most metrics are performing well. Focus on health score and expansion revenue.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-jungwell-orange" />
                    Biggest Win
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold mb-2">Expansion Revenue</div>
                  <div className="text-2xl font-bold text-green-500 mb-2">+12.3%</div>
                  <p className="text-sm text-muted-foreground">
                    Strong upsell performance this quarter
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Team Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold mb-2">Sprint Completion</div>
                  <div className="text-2xl font-bold text-blue-500 mb-2">73%</div>
                  <p className="text-sm text-muted-foreground">
                    Above average delivery rate
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="retention" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Renewal Rate Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-secondary/20 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Chart visualization would go here</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Showing renewal rate: 94% (↑2.1%)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Churn Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Voluntary Churn</span>
                      <span className="font-medium">2.1%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Involuntary Churn</span>
                      <span className="font-medium">1.1%</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="font-medium">Total Churn</span>
                      <span className="font-bold text-red-500">3.2%</span>
                    </div>
                    <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-700">
                        <strong>Action needed:</strong> Churn is above target of 2.5%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="growth" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Net Dollar Retention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-4xl font-bold text-green-500 mb-2">118%</div>
                    <p className="text-muted-foreground mb-4">Current NDR</p>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: '98%' }} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Target: 120%</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expansion Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Ready for Upsell</span>
                      <Badge className="bg-green-100 text-green-700">12 accounts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium">Cross-sell Potential</span>
                      <Badge className="bg-yellow-100 text-yellow-700">8 accounts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Renewal + Expand</span>
                      <Badge className="bg-blue-100 text-blue-700">5 accounts</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Health Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Healthy (80-100)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-secondary rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }} />
                        </div>
                        <span className="text-sm font-medium">60%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">At Risk (60-79)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-secondary rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }} />
                        </div>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Critical (0-59)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-secondary rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }} />
                        </div>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CSAT Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold mb-2">4.3/5</div>
                    <div className="flex justify-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`w-5 h-5 rounded-full ${
                            star <= 4 ? 'bg-yellow-400' : 'bg-secondary'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on 127 responses this month
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Response Time</span>
                      <span className="font-medium">2.3h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">First Contact Resolution</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Open Tickets</span>
                      <span className="font-medium">23</span>
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