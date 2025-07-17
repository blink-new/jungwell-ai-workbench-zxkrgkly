import React, { useState, useEffect } from 'react'

interface EasterEggProps {
  trigger: string
  children: React.ReactNode
}

export const EasterEgg: React.FC<EasterEggProps> = ({ trigger, children }) => {
  const [isActive, setIsActive] = useState(false)
  const [inputSequence, setInputSequence] = useState('')

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newSequence = (inputSequence + e.key).slice(-trigger.length)
      setInputSequence(newSequence)
      
      if (newSequence === trigger) {
        setIsActive(true)
        setTimeout(() => setIsActive(false), 3000) // Hide after 3 seconds
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [inputSequence, trigger])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {children}
    </div>
  )
}

export const DiscoMode: React.FC = () => {
  const colors = ['#FF4B4B', '#FF9642', '#4F46E5', '#10B981', '#F59E0B', '#EF4444']
  const [colorIndex, setColorIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex(prev => (prev + 1) % colors.length)
    }, 200)

    return () => clearInterval(interval)
  }, [colors.length])

  return (
    <div 
      className="w-full h-full animate-pulse"
      style={{ 
        background: `linear-gradient(45deg, ${colors[colorIndex]}, ${colors[(colorIndex + 1) % colors.length]})`,
        opacity: 0.3
      }}
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-6xl animate-bounce">🕺💃🎉</div>
      </div>
    </div>
  )
}

export const ConfettiAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(100)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            fontSize: `${Math.random() * 20 + 10}px`,
          }}
        >
          {['🎉', '🎊', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}
        </div>
      ))}
    </div>
  )
}