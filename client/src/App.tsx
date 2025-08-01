import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold text-center mb-8">
            AI-Powered Customer Support Dashboard
          </h1>
          <div className="text-center text-muted-foreground">
            Welcome to your AI support dashboard. The project structure has been set up successfully!
          </div>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App