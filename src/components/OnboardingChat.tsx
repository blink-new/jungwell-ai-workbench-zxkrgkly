import React, { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { ChatMessage } from '../types'
import { blink } from '../blink/client'

const ONBOARDING_QUESTIONS = [
  {
    id: 'company',
    question: "Hi there! 👋 I'm your AI Scrum Master. Let's get started! Tell me about your company in one sentence.",
    field: 'companyDescription'
  },
  {
    id: 'team',
    question: "Great! Now, what's your team size and what roles do you have?",
    field: 'teamSize'
  },
  {
    id: 'goals',
    question: "What are your main Customer Success goals this quarter?",
    field: 'quarterlyGoals'
  },
  {
    id: 'systems',
    question: "Which systems does your team currently use? (SFDC, HubSpot, Gainsight, Tableau, etc.)",
    field: 'systems'
  },
  {
    id: 'docs',
    question: "Do you have any links to docs, playbooks, or roadmaps I should know about?",
    field: 'docsLinks'
  },
  {
    id: 'pain',
    question: "What are your biggest pain points today?",
    field: 'painPoints'
  }
]

export const OnboardingChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: ONBOARDING_QUESTIONS[0].question,
      sender: 'ai',
      timestamp: new Date().toISOString(),
      type: 'text'
    }
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { onboardingData, setOnboardingData, setCurrentView } = useAppStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentInput,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    
    // Store the answer
    const currentQuestion = ONBOARDING_QUESTIONS[currentQuestionIndex]
    const field = currentQuestion.field as keyof typeof onboardingData
    
    if (field === 'quarterlyGoals' || field === 'systems' || field === 'docsLinks' || field === 'painPoints') {
      setOnboardingData({
        [field]: currentInput.split(',').map(item => item.trim()).filter(Boolean)
      })
    } else {
      setOnboardingData({ [field]: currentInput })
    }

    setCurrentInput('')
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      setIsTyping(false)
      
      if (currentQuestionIndex < ONBOARDING_QUESTIONS.length - 1) {
        // Next question
        const nextQuestion = ONBOARDING_QUESTIONS[currentQuestionIndex + 1]
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: nextQuestion.question,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: 'text'
        }
        setMessages(prev => [...prev, aiMessage])
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        // Onboarding complete
        const completionMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "Perfect! 🎉 I have everything I need. Ready for lift-off? I'll draft your first backlog and invite your crew to the workbench!",
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: 'system'
        }
        setMessages(prev => [...prev, completionMessage])
        setOnboardingData({ isComplete: true })
      }
    }, 1500)
  }

  const handleComplete = async () => {
    setCurrentView('dashboard')
    
    // Generate initial tasks based on onboarding data
    try {
      const { text } = await blink.ai.generateText({
        prompt: `Based on this Customer Success team's onboarding data, generate 5-7 initial backlog tasks:
        
        Company: ${onboardingData.companyDescription}
        Team Size: ${onboardingData.teamSize}
        Goals: ${onboardingData.quarterlyGoals.join(', ')}
        Systems: ${onboardingData.systems.join(', ')}
        Pain Points: ${onboardingData.painPoints.join(', ')}
        
        Generate practical, actionable tasks that would help them achieve their quarterly goals and address their pain points. Format as a simple list with task titles only.`,
        maxTokens: 300
      })
      
      // Parse and create initial tasks (simplified for now)
      console.log('Generated initial tasks:', text)
    } catch (error) {
      console.error('Error generating initial tasks:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="p-6 border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 gradient-jungwell rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-poppins text-xl font-semibold">AI Scrum Master</h2>
            <p className="text-sm text-muted-foreground">Let's set up your workbench</p>
          </div>
          <div className="ml-auto">
            <Badge variant="secondary" className="bg-jungwell-orange/10 text-jungwell-orange border-jungwell-orange/20">
              Step {currentQuestionIndex + 1} of {ONBOARDING_QUESTIONS.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'ai' && (
              <div className="w-8 h-8 gradient-jungwell rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <Card className={`max-w-md p-4 ${
              message.sender === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : message.type === 'system'
                ? 'bg-gradient-to-r from-jungwell-red/10 to-jungwell-orange/10 border-jungwell-orange/20'
                : 'bg-card'
            }`}>
              <p className="text-sm leading-relaxed">{message.content}</p>
              {message.type === 'system' && (
                <Button 
                  onClick={handleComplete}
                  className="mt-3 w-full gradient-jungwell hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Launch Workbench
                </Button>
              )}
            </Card>
            
            {message.sender === 'user' && (
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 gradient-jungwell rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <Card className="p-4 bg-card">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!onboardingData.isComplete && (
        <div className="p-6 border-t bg-card/50 backdrop-blur-sm">
          <div className="flex gap-3">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isTyping}
              className="gradient-jungwell hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  )
}