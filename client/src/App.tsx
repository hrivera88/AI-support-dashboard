import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { AIDemo } from '@/components/ai/AIDemo'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-8">
            AI-Powered Customer Support Dashboard
          </h1>
          <AIDemo />
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App