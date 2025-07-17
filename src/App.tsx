import React, { useEffect, useState } from 'react'
import { OnboardingChat } from './components/OnboardingChat'
import { Dashboard } from './components/Dashboard'
import { StandupMode } from './components/StandupMode'
import { KanbanBoard } from './components/KanbanBoard'
import { ImpactAnalytics } from './components/ImpactAnalytics'
import { TeamSettings } from './components/TeamSettings'
import { Integrations } from './components/Integrations'
import { RealtimeCollaboration } from './components/RealtimeCollaboration'
import { JungwellLogo } from './components/JungwellLogo'
import { useAppStore } from './store/useAppStore'
import { blink } from './blink/client'
import { Loader2 } from 'lucide-react'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const { currentView, onboardingData, showConfetti } = useAppStore()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setIsLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <JungwellLogo size="lg" />
          <div className="flex items-center gap-2 mt-6">
            <Loader2 className="w-5 h-5 animate-spin text-jungwell-red" />
            <span className="text-muted-foreground">Loading your workbench...</span>
          </div>
        </div>
      </div>
    )
  }

  // Auth required but user not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <JungwellLogo size="lg" />
          <h2 className="font-poppins text-2xl font-semibold mt-6 mb-4">
            Welcome to Jungwell.ai
          </h2>
          <p className="text-muted-foreground mb-8">
            Your AI-powered Customer Success workbench. Please sign in to continue.
          </p>
          <button
            onClick={() => blink.auth.login()}
            className="px-6 py-3 gradient-jungwell text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  // Confetti animation
  const ConfettiOverlay = () => {
    if (!showConfetti) return null
    
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
          >
            🎉
          </div>
        ))}
      </div>
    )
  }

  // Route to appropriate view
  const renderCurrentView = () => {
    // If onboarding not complete, always show onboarding
    if (!onboardingData.isComplete) {
      return <OnboardingChat />
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'standup':
        return <StandupMode />
      case 'kanban':
        return <KanbanBoard />
      case 'analytics':
        return <ImpactAnalytics />
      case 'settings':
        return <TeamSettings />
      case 'integrations':
        return <Integrations />
      case 'voice':
        return <RealtimeCollaboration />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen">
      {renderCurrentView()}
      <ConfettiOverlay />
    </div>
  )
}

export default App