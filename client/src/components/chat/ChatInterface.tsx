import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageThread } from './MessageThread'
import { AIResponsePanel } from './AIResponsePanel'
import { SentimentIndicator } from './SentimentIndicator'
import { ConversationList } from './ConversationList'
import { MessageSquare, Send, Bot, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { ConversationContext, Message, SentimentData, CustomerProfile } from '@/types/types'

interface ChatInterfaceProps {
  conversationId?: string
  onSentimentChange?: (sentiment: SentimentData) => void
  className?: string
}

export function ChatInterface({ 
  conversationId, 
  onSentimentChange,
  className = '' 
}: ChatInterfaceProps) {
  const [selectedConversation, setSelectedConversation] = useState<ConversationContext | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(true)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  // Mock conversations for demo
  const [conversations] = useState<ConversationContext[]>([
    {
      id: 'conv-1',
      customerId: 'cust-1',
      category: 'Billing Issue',
      priority: 'high',
      status: 'in_progress',
      assignedAgent: 'agent-1',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      messages: [
        {
          id: 'msg-1',
          content: "I've been charged twice for my subscription this month! This is unacceptable. I want a refund immediately.",
          sender: 'customer',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          sentiment: {
            score: -0.8,
            label: 'negative',
            confidence: 0.92,
            emotions: { anger: 0.85, joy: 0.05, fear: 0.15, sadness: 0.25, surprise: 0.65 }
          }
        },
        {
          id: 'msg-2',
          content: "I understand your frustration regarding the duplicate charge. Let me investigate this immediately and ensure we resolve this for you today.",
          sender: 'agent',
          timestamp: new Date(Date.now() - 90 * 60 * 1000)
        }
      ]
    },
    {
      id: 'conv-2', 
      customerId: 'cust-2',
      category: 'Technical Support',
      priority: 'medium',
      status: 'open',
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
      updatedAt: new Date(Date.now() - 15 * 60 * 1000),
      messages: [
        {
          id: 'msg-3',
          content: "Hi! I'm having trouble setting up the API integration. The documentation says to use the v2 endpoint, but I keep getting 404 errors.",
          sender: 'customer',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          sentiment: {
            score: -0.2,
            label: 'neutral',
            confidence: 0.78,
            emotions: { anger: 0.1, joy: 0.2, fear: 0.3, sadness: 0.1, surprise: 0.4 }
          }
        }
      ]
    },
    {
      id: 'conv-3',
      customerId: 'cust-3', 
      category: 'Sales Inquiry',
      priority: 'low',
      status: 'open',
      createdAt: new Date(Date.now() - 20 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 60 * 1000),
      messages: [
        {
          id: 'msg-4',
          content: "Hello! I'm interested in upgrading to your premium plan. Could you tell me more about the features and pricing?",
          sender: 'customer',
          timestamp: new Date(Date.now() - 20 * 60 * 1000),
          sentiment: {
            score: 0.6,
            label: 'positive',
            confidence: 0.85,
            emotions: { anger: 0.05, joy: 0.7, fear: 0.1, sadness: 0.05, surprise: 0.3 }
          }
        }
      ]
    }
  ])

  // Mock customer profiles
  const customerProfiles: Record<string, CustomerProfile> = {
    'cust-1': {
      id: 'cust-1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      tier: 'premium',
      previousInteractions: 8,
      averageSentiment: -0.2,
      preferredTone: 'empathetic'
    },
    'cust-2': {
      id: 'cust-2', 
      name: 'Mike Chen',
      email: 'mike.chen@devcompany.com',
      tier: 'enterprise',
      previousInteractions: 3,
      averageSentiment: 0.1,
      preferredTone: 'technical'
    },
    'cust-3': {
      id: 'cust-3',
      name: 'Emma Davis',
      email: 'emma.davis@startup.io',
      tier: 'basic',
      previousInteractions: 1,
      averageSentiment: 0.5,
      preferredTone: 'professional'
    }
  }

  useEffect(() => {
    if (conversationId) {
      const conversation = conversations.find(c => c.id === conversationId)
      setSelectedConversation(conversation || null)
    } else if (conversations.length > 0) {
      setSelectedConversation(conversations[0])
    }
  }, [conversationId, conversations])

  useEffect(() => {
    if (selectedConversation) {
      const lastMessage = selectedConversation.messages[selectedConversation.messages.length - 1]
      if (lastMessage?.sentiment && onSentimentChange) {
        onSentimentChange(lastMessage.sentiment)
      }
    }
  }, [selectedConversation, onSentimentChange])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: 'agent',
      timestamp: new Date(),
    }

    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message],
      updatedAt: new Date()
    } : null)

    setNewMessage('')
    setIsTyping(false)

    toast({
      title: "Message sent",
      description: "Your response has been sent to the customer.",
    })
  }

  const handleApplyAIResponse = (response: string) => {
    setNewMessage(response)
    messageInputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const currentCustomer = selectedConversation ? customerProfiles[selectedConversation.customerId] : null
  const currentSentiment = selectedConversation?.messages
    .filter(m => m.sender === 'customer')
    .slice(-1)[0]?.sentiment

  return (
    <div className={`flex h-full gap-4 ${className}`}>
      {/* Conversation List */}
      <div className="w-80 flex-shrink-0">
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversation?.id}
          onSelect={setSelectedConversation}
          customerProfiles={customerProfiles}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">
                        {currentCustomer?.name || 'Unknown Customer'}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Category: {selectedConversation.category}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedConversation.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          selectedConversation.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          selectedConversation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {selectedConversation.priority} priority
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedConversation.status === 'open' ? 'bg-blue-100 text-blue-800' :
                          selectedConversation.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {selectedConversation.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {currentSentiment && (
                    <SentimentIndicator 
                      score={currentSentiment.score}
                      trend="stable"
                      emotions={currentSentiment.emotions}
                    />
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Message Thread */}
            <div className="flex-1 mb-4 min-h-0">
              <MessageThread
                messages={selectedConversation.messages}
                customerProfile={currentCustomer}
                isTyping={isTyping}
              />
            </div>

            {/* Message Input */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <textarea
                      ref={messageInputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your response..."
                      className="w-full min-h-[80px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={selectedConversation.status === 'closed'}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || selectedConversation.status === 'closed'}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAIPanel(!showAIPanel)}
                      className="flex items-center gap-2"
                    >
                      <Bot className="h-4 w-4" />
                      AI
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <CardContent className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Conversation Selected</h3>
              <p className="text-muted-foreground">
                Select a conversation from the list to start helping customers
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI Response Panel */}
      {showAIPanel && selectedConversation && currentCustomer && (
        <div className="w-80 flex-shrink-0">
          <AIResponsePanel
            context={selectedConversation}
            customerProfile={currentCustomer}
            onApplyResponse={handleApplyAIResponse}
          />
        </div>
      )}
    </div>
  )
}