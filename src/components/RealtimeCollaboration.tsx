import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback } from './ui/avatar'
import { 
  Users,
  MessageSquare,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share,
  Hand,
  Volume2,
  VolumeX,
  Phone,
  PhoneOff,
  Settings,
  MoreHorizontal
} from 'lucide-react'
import { blink } from '../blink/client'

interface Participant {
  id: string
  name: string
  avatar: string
  status: 'online' | 'away' | 'busy'
  isSpeaking: boolean
  isMuted: boolean
  hasVideo: boolean
  isHandRaised: boolean
  joinedAt: string
}

interface ChatMessage {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: string
  type: 'text' | 'system' | 'reaction'
}

interface VoiceSession {
  id: string
  title: string
  participants: Participant[]
  isActive: boolean
  startedAt: string
  duration: number
}

export const RealtimeCollaboration: React.FC = () => {
  const [isInCall, setIsInCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasVideo, setHasVideo] = useState(false)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentSession, setCurrentSession] = useState<VoiceSession | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isInCall) {
      setParticipants([])
      setChatMessages([])
      setCurrentSession(null)
    } else {
      // Sample participants
      const sampleParticipants: Participant[] = [
        {
          id: '1',
          name: 'Sarah Chen',
          avatar: '👩‍💼',
          status: 'online',
          isSpeaking: false,
          isMuted: false,
          hasVideo: true,
          isHandRaised: false,
          joinedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Mike Rodriguez',
          avatar: '👨‍💻',
          status: 'online',
          isSpeaking: true,
          isMuted: false,
          hasVideo: false,
          isHandRaised: false,
          joinedAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Emma Thompson',
          avatar: '👩‍📊',
          status: 'online',
          isSpeaking: false,
          isMuted: true,
          hasVideo: true,
          isHandRaised: true,
          joinedAt: new Date().toISOString()
        }
      ]

      // Sample chat messages
      const sampleMessages: ChatMessage[] = [
        {
          id: '1',
          userId: '1',
          userName: 'Sarah Chen',
          content: 'Good morning everyone! Ready for our stand-up?',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          type: 'text'
        },
        {
          id: '2',
          userId: 'system',
          userName: 'System',
          content: 'Mike Rodriguez joined the call',
          timestamp: new Date(Date.now() - 240000).toISOString(),
          type: 'system'
        },
        {
          id: '3',
          userId: '2',
          userName: 'Mike Rodriguez',
          content: 'Hey team! Just finished the customer health score updates',
          timestamp: new Date(Date.now() - 180000).toISOString(),
          type: 'text'
        },
        {
          id: '4',
          userId: '3',
          userName: 'Emma Thompson',
          content: '👍',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          type: 'reaction'
        }
      ]

      setParticipants(sampleParticipants)
      setChatMessages(sampleMessages)
      setCurrentSession({
        id: 'session-1',
        title: 'Daily Stand-up',
        participants: sampleParticipants,
        isActive: true,
        startedAt: new Date().toISOString(),
        duration: 0
      })
    }
  }, [isInCall])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleJoinCall = async () => {
    setIsConnecting(true)
    
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Initialize realtime connection
      const channel = blink.realtime.channel('voice-session')
      await channel.subscribe({
        userId: 'current-user',
        metadata: { 
          displayName: 'You',
          status: 'online',
          isMuted: false,
          hasVideo: false
        }
      })

      // Listen for participant updates
      channel.onPresence((users) => {
        console.log('Participants updated:', users)
      })

      // Listen for chat messages
      channel.onMessage((message) => {
        if (message.type === 'chat') {
          setChatMessages(prev => [...prev, {
            id: Date.now().toString(),
            userId: message.userId,
            userName: message.metadata?.displayName || 'Unknown',
            content: message.data.content,
            timestamp: new Date().toISOString(),
            type: 'text'
          }])
        }
      })

      setIsInCall(true)
    } catch (error) {
      console.error('Failed to join call:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleLeaveCall = () => {
    setIsInCall(false)
    setIsMuted(false)
    setHasVideo(false)
    setIsHandRaised(false)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isInCall) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    }

    setChatMessages(prev => [...prev, message])
    
    // Send to realtime channel
    try {
      await blink.realtime.publish('voice-session', 'chat', {
        content: newMessage
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    }

    setNewMessage('')
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // In real implementation, this would control actual microphone
  }

  const toggleVideo = () => {
    setHasVideo(!hasVideo)
    // In real implementation, this would control actual camera
  }

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised)
  }

  const getStatusColor = (status: Participant['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isInCall) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="font-poppins text-2xl font-semibold flex items-center gap-2">
            <Users className="w-6 h-6 text-jungwell-red" />
            Voice Collaboration
          </h2>
          <p className="text-muted-foreground">
            Start voice calls for stand-ups, planning sessions, and team collaboration
          </p>
        </div>

        {/* Quick Start */}
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 gradient-jungwell rounded-full flex items-center justify-center mx-auto mb-6">
              <Mic className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-poppins text-xl font-semibold mb-2">Start Voice Session</h3>
            <p className="text-muted-foreground mb-6">
              Begin a voice call with your team for stand-ups, planning, or collaboration
            </p>
            <Button 
              onClick={handleJoinCall}
              disabled={isConnecting}
              className="gradient-jungwell hover:opacity-90 transition-opacity"
              size="lg"
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5 mr-2" />
                  Start Call
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'Daily Stand-up', date: '2 hours ago', duration: '15:32', participants: 3 },
                { title: 'Sprint Planning', date: 'Yesterday', duration: '45:18', participants: 5 },
                { title: 'Customer Review', date: '2 days ago', duration: '28:45', participants: 4 }
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{session.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {session.date} • {session.duration} • {session.participants} participants
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Main Call Area */}
      <div className="lg:col-span-2 space-y-4">
        {/* Call Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{currentSession?.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {participants.length} participants • {formatDuration(currentSession?.duration || 0)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-red-500 font-medium">LIVE</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participants Grid */}
        <Card className="flex-1">
          <CardContent className="p-4 h-full">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full">
              {participants.map((participant) => (
                <div key={participant.id} className="relative">
                  <div className={`aspect-video bg-secondary rounded-lg flex items-center justify-center relative overflow-hidden ${
                    participant.isSpeaking ? 'ring-2 ring-jungwell-red' : ''
                  }`}>
                    {participant.hasVideo ? (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-4xl">{participant.avatar}</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl mb-2">{participant.avatar}</div>
                        <p className="text-sm font-medium">{participant.name}</p>
                      </div>
                    )}
                    
                    {/* Status indicators */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {participant.isMuted && (
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <MicOff className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {participant.isHandRaised && (
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Hand className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Speaking indicator */}
                    {participant.isSpeaking && (
                      <div className="absolute bottom-2 left-2">
                        <div className="flex items-center gap-1 bg-jungwell-red text-white px-2 py-1 rounded text-xs">
                          <Volume2 className="w-3 h-3" />
                          Speaking
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium">{participant.name}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(participant.status)}`} />
                      <span className="text-xs text-muted-foreground capitalize">{participant.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="lg"
                onClick={toggleMute}
                className="rounded-full w-12 h-12"
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              
              <Button
                variant={hasVideo ? "default" : "outline"}
                size="lg"
                onClick={toggleVideo}
                className="rounded-full w-12 h-12"
              >
                {hasVideo ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>
              
              <Button
                variant={isHandRaised ? "default" : "outline"}
                size="lg"
                onClick={toggleHandRaise}
                className="rounded-full w-12 h-12"
              >
                <Hand className="w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-12 h-12"
              >
                <Share className="w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-12 h-12"
              >
                <Settings className="w-5 h-5" />
              </Button>
              
              <Button
                variant="destructive"
                size="lg"
                onClick={handleLeaveCall}
                className="rounded-full w-12 h-12"
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Sidebar */}
      <div className="flex flex-col h-full">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Chat
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-4">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`${
                  message.type === 'system' ? 'text-center' : 
                  message.userId === 'current-user' ? 'text-right' : 'text-left'
                }`}>
                  {message.type === 'system' ? (
                    <div className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded inline-block">
                      {message.content}
                    </div>
                  ) : message.type === 'reaction' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{message.userName}</span>
                      <span className="text-lg">{message.content}</span>
                    </div>
                  ) : (
                    <div className={`max-w-[80%] inline-block ${
                      message.userId === 'current-user' ? 'ml-auto' : 'mr-auto'
                    }`}>
                      <div className={`p-2 rounded-lg ${
                        message.userId === 'current-user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{message.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="sm"
                className="gradient-jungwell"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Participants List */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Participants ({participants.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">{participant.avatar}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm flex-1">{participant.name}</span>
                  <div className="flex items-center gap-1">
                    {participant.isMuted && <MicOff className="w-3 h-3 text-red-500" />}
                    {participant.hasVideo && <Video className="w-3 h-3 text-green-500" />}
                    {participant.isHandRaised && <Hand className="w-3 h-3 text-yellow-500" />}
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(participant.status)}`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}