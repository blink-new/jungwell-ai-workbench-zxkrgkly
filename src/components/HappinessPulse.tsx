import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { 
  Heart,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Lightbulb,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { HappinessPulse as HappinessPulseType } from '../types'

const HAPPINESS_LEVELS = [
  { value: 1, icon: Frown, color: 'text-red-500', bg: 'bg-red-100', label: 'Very Unhappy' },
  { value: 2, icon: Frown, color: 'text-orange-500', bg: 'bg-orange-100', label: 'Unhappy' },
  { value: 3, icon: Meh, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Neutral' },
  { value: 4, icon: Smile, color: 'text-green-500', bg: 'bg-green-100', label: 'Happy' },
  { value: 5, icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-100', label: 'Very Happy' }
]

export const HappinessPulse: React.FC = () => {
  const { happinessPulse, setHappinessPulse } = useAppStore()
  const [currentScore, setCurrentScore] = useState<number | null>(null)
  const [suggestion, setSuggestion] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSurvey, setShowSurvey] = useState(false)

  // Check if user has already submitted this month
  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
    const hasSubmitted = happinessPulse.some(pulse => 
      pulse.month === currentMonth && pulse.userId === 'current-user'
    )
    setIsSubmitted(hasSubmitted)
  }, [happinessPulse])

  // Sample historical data
  const [historicalData] = useState<HappinessPulseType[]>([
    { userId: 'user1', score: 4, suggestion: 'More flexible work hours', month: '2024-01', year: 2024 },
    { userId: 'user2', score: 3, suggestion: 'Better project planning', month: '2024-01', year: 2024 },
    { userId: 'user3', score: 5, suggestion: 'Keep up the great work!', month: '2024-01', year: 2024 },
    { userId: 'user1', score: 4, suggestion: 'Team building activities', month: '2024-02', year: 2024 },
    { userId: 'user2', score: 4, suggestion: 'More recognition for achievements', month: '2024-02', year: 2024 },
    { userId: 'user3', score: 4, suggestion: 'Clearer communication', month: '2024-02', year: 2024 },
  ])

  const handleSubmitPulse = () => {
    if (currentScore === null) return

    const newPulse: HappinessPulseType = {
      userId: 'current-user',
      score: currentScore,
      suggestion: suggestion.trim(),
      month: new Date().toISOString().slice(0, 7),
      year: new Date().getFullYear()
    }

    setHappinessPulse([...happinessPulse, newPulse])
    setIsSubmitted(true)
    setShowSurvey(false)
    
    // Reset form
    setCurrentScore(null)
    setSuggestion('')
  }

  const calculateAverageScore = (month?: string) => {
    const data = month 
      ? historicalData.filter(pulse => pulse.month === month)
      : historicalData

    if (data.length === 0) return 0
    return data.reduce((sum, pulse) => sum + pulse.score, 0) / data.length
  }

  const getScoreDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    historicalData.forEach(pulse => {
      distribution[pulse.score as keyof typeof distribution]++
    })
    return distribution
  }

  const getTopSuggestions = () => {
    const suggestions = historicalData
      .map(pulse => pulse.suggestion)
      .filter(Boolean)
      .reduce((acc, suggestion) => {
        acc[suggestion] = (acc[suggestion] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    return Object.entries(suggestions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([suggestion, count]) => ({ suggestion, count }))
  }

  const currentAverage = calculateAverageScore()
  const lastMonthAverage = calculateAverageScore('2024-01')
  const trend = currentAverage > lastMonthAverage ? 'up' : currentAverage < lastMonthAverage ? 'down' : 'stable'
  const distribution = getScoreDistribution()
  const topSuggestions = getTopSuggestions()

  if (showSurvey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 gradient-jungwell rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="font-poppins text-2xl">Monthly Happiness Pulse</CardTitle>
            <p className="text-muted-foreground">
              Help us make your work experience better
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-4 text-center">How happy are you from 1 to 5?</h3>
              <div className="grid grid-cols-5 gap-2">
                {HAPPINESS_LEVELS.map((level) => {
                  const Icon = level.icon
                  return (
                    <button
                      key={level.value}
                      onClick={() => setCurrentScore(level.value)}
                      className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                        currentScore === level.value
                          ? `${level.bg} border-current ${level.color}`
                          : 'border-secondary hover:border-primary/20'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mx-auto ${
                        currentScore === level.value ? level.color : 'text-muted-foreground'
                      }`} />
                      <div className="text-xs mt-2 font-medium">{level.value}</div>
                    </button>
                  )
                })}
              </div>
              {currentScore && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {HAPPINESS_LEVELS.find(l => l.value === currentScore)?.label}
                </p>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">What one change would boost that score?</h3>
              <Textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="Share your thoughts... (optional)"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSubmitPulse}
                disabled={currentScore === null}
                className="flex-1 gradient-jungwell hover:opacity-90 transition-opacity"
              >
                Submit Pulse
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowSurvey(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-poppins text-2xl font-semibold flex items-center gap-2">
            <Heart className="w-6 h-6 text-jungwell-red" />
            Team Happiness Pulse
          </h2>
          <p className="text-muted-foreground">Track and improve team satisfaction</p>
        </div>
        {!isSubmitted && (
          <Button 
            onClick={() => setShowSurvey(true)}
            className="gradient-jungwell hover:opacity-90 transition-opacity"
          >
            Take Survey
          </Button>
        )}
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-jungwell-red to-jungwell-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">
                {currentAverage.toFixed(1)}
              </span>
            </div>
            <h3 className="font-semibold mb-1">Current Average</h3>
            <p className="text-sm text-muted-foreground">Team happiness score</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : trend === 'down' ? (
                <TrendingDown className="w-4 h-4 text-red-500" />
              ) : null}
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-500' : 
                trend === 'down' ? 'text-red-500' : 
                'text-muted-foreground'
              }`}>
                {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Participation</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">This Month</span>
                <Badge className="bg-green-100 text-green-700">
                  {isSubmitted ? 'Completed' : 'Pending'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Response Rate</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Next Survey</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold">Recent Trend</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">January</span>
                <span className="font-medium">4.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">February</span>
                <span className="font-medium">4.2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">March</span>
                <span className="font-medium text-jungwell-orange">Current</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {HAPPINESS_LEVELS.map((level) => {
              const count = distribution[level.value as keyof typeof distribution]
              const percentage = historicalData.length > 0 ? (count / historicalData.length) * 100 : 0
              const Icon = level.icon
              
              return (
                <div key={level.value} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-24">
                    <Icon className={`w-4 h-4 ${level.color}`} />
                    <span className="text-sm font-medium">{level.value}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-secondary rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${level.color.replace('text-', 'bg-')}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">{count}</span>
                      <span className="text-sm text-muted-foreground w-12">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-jungwell-orange" />
            Top Improvement Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topSuggestions.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-jungwell-orange/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-jungwell-orange">{index + 1}</span>
                  </div>
                  <span className="text-sm">{item.suggestion}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{item.count} votes</Badge>
                  <Button size="sm" variant="outline" className="h-7">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Implement
                  </Button>
                </div>
              </div>
            ))}
            
            {topSuggestions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No suggestions yet. Encourage your team to share feedback!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="bg-gradient-to-r from-jungwell-red/5 to-jungwell-orange/5 border-jungwell-orange/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-jungwell-red" />
            This Month's Focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
              <div className="w-2 h-2 bg-jungwell-red rounded-full" />
              <span className="flex-1 text-sm">Implement flexible work hours based on team feedback</span>
              <Badge className="bg-jungwell-orange/10 text-jungwell-orange border-jungwell-orange/20">
                Team Joy
              </Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="flex-1 text-sm">Schedule monthly team building activities</span>
              <Badge variant="secondary">In Progress</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}