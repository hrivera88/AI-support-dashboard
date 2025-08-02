import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AIDemo } from '@/components/ai/AIDemo'
import { KnowledgeDemo } from '@/components/knowledge/KnowledgeDemo'
import { ChatDemo } from '@/components/chat/ChatDemo'
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard'
import { Bot, BookOpen, MessageSquare, BarChart3 } from 'lucide-react'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 max-w-6xl">
          <h1 className="text-3xl font-bold text-center mb-8">
            AI-Powered Customer Support Dashboard
          </h1>
          
          <Tabs defaultValue="chat" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-2xl grid-cols-4">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  AI Features
                </TabsTrigger>
                <TabsTrigger value="knowledge" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Knowledge Base
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chat">
              <ChatDemo />
            </TabsContent>
            
            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>
            
            <TabsContent value="ai">
              <AIDemo />
            </TabsContent>
            
            <TabsContent value="knowledge">
              <KnowledgeDemo />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App