import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  SkipForward,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { EasterEgg, DiscoMode } from './EasterEggs'

const TEAM_MEMBERS = [
  { id: '1', name: 'Sarah Chen', role: 'CS Manager', avatar: '👩‍💼' },
  { id: '2', name: 'Mike Rodriguez', role: 'CS Specialist', avatar: '👨‍💻' },
  { id: '3', name: 'Emma Thompson', role: 'CS Analyst', avatar: '👩‍📊' }
]

export const StandupMode: React.FC = () => {
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [standupPhase, setStandupPhase] = useState<'yesterday' | 'today' | 'blockers'>('yesterday')
  const [responses, setResponses] = useState<Record<string, Record<string, string>>>({})
  const [isComplete, setIsComplete] = useState(false)
  
  const { setCurrentView, setStandupMode } = useAppStore()

  const currentMember = TEAM_MEMBERS[currentMemberIndex]
  
  const phaseQuestions = {
    yesterday: "What did you accomplish yesterday?",
    today: "What are you planning to work on today?",
    blockers: "Do you have any blockers or need help with anything?"
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    // In a real app, this would start Web Speech API recording
    console.log('Starting voice recording...')
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    // Simulate voice-to-text response
    const mockResponse = "Completed customer health score updates and prepared Q4 renewal materials."
    
    setResponses(prev => ({
      ...prev,
      [currentMember.id]: {
        ...prev[currentMember.id],
        [standupPhase]: mockResponse
      }
    }))
    
    // Auto-advance to next phase or member
    setTimeout(() => {
      handleNext()
    }, 1000)
  }

  const handleNext = () => {
    if (standupPhase === 'yesterday') {
      setStandupPhase('today')
    } else if (standupPhase === 'today') {
      setStandupPhase('blockers')
    } else {
      // Move to next member
      if (currentMemberIndex < TEAM_MEMBERS.length - 1) {
        setCurrentMemberIndex(prev => prev + 1)
        setStandupPhase('yesterday')
      } else {
        setIsComplete(true)
      }
    }
  }

  const handleComplete = () => {
    setStandupMode(false)
    setCurrentView('dashboard')
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'yesterday': return 'bg-blue-500'
      case 'today': return 'bg-jungwell-red'
      case 'blockers': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 gradient-jungwell rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-poppins text-2xl font-semibold mb-2">Stand-up Complete! 🎉</h2>
            <p className="text-muted-foreground mb-6">
              Great session! I've logged all updates and identified 2 potential blockers to address.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Voice notes transcribed and tagged</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Kanban board updated automatically</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span>2 blockers flagged for follow-up</span>
              </div>
            </div>
            <Button 
              onClick={handleComplete}
              className="w-full gradient-jungwell hover:opacity-90 transition-opacity"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <EasterEgg trigger="/dance">
        <DiscoMode />
      </EasterEgg>
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setStandupMode(false)
                  setCurrentView('dashboard')
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="font-poppins text-xl font-semibold">Daily Stand-up</h1>
                <p className="text-sm text-muted-foreground">Voice-powered team check-in</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-jungwell-orange/10 text-jungwell-orange border-jungwell-orange/20">
              {currentMemberIndex + 1} of {TEAM_MEMBERS.length}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {TEAM_MEMBERS.map((member, index) => (
              <div
                key={member.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  index === currentMemberIndex 
                    ? 'bg-primary text-primary-foreground' 
                    : index < currentMemberIndex 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                <span className="text-lg">{member.avatar}</span>
                <span className="text-sm font-medium">{member.name}</span>
                {index < currentMemberIndex && <CheckCircle2 className="w-4 h-4" />}
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            {['yesterday', 'today', 'blockers'].map((phase) => (
              <div
                key={phase}
                className={`h-2 flex-1 rounded-full ${
                  phase === standupPhase ? getPhaseColor(phase) : 'bg-secondary'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current Question */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="text-2xl">{currentMember.avatar}</div>
              <div>
                <h2 className="font-poppins text-xl">{currentMember.name}</h2>
                <p className="text-sm text-muted-foreground font-normal">{currentMember.role}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <h3 className="font-poppins text-2xl font-semibold mb-4">
                {phaseQuestions[standupPhase]}
              </h3>
              
              {/* Voice Recording Interface */}
              <div className="flex flex-col items-center gap-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording 
                    ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
                    : 'gradient-jungwell hover:shadow-lg hover:shadow-primary/50'
                }`}>
                  {isRecording ? (
                    <MicOff className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </div>
                
                <div className="space-y-4">
                  {isRecording ? (
                    <Button 
                      onClick={handleStopRecording}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Stop Recording
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleStartRecording}
                      className="gradient-jungwell hover:opacity-90 transition-opacity"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Recording
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    onClick={handleNext}
                    className="text-muted-foreground"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Previous Responses */}
        {responses[currentMember.id] && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Responses So Far</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(responses[currentMember.id]).map(([phase, response]) => (
                  <div key={phase} className="flex gap-3">
                    <div className={`w-3 h-3 rounded-full mt-2 ${getPhaseColor(phase)}`} />
                    <div>
                      <h4 className="font-medium capitalize">{phase === 'blockers' ? 'Blockers' : phase}</h4>
                      <p className="text-sm text-muted-foreground">{response}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}