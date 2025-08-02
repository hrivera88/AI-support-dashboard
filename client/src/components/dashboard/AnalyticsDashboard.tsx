import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PerformanceMetrics } from './PerformanceMetrics'
import { SentimentTrends } from './SentimentTrends'
import { ResponseQualityChart } from './ResponseQualityChart'
import { AgentPerformance } from './AgentPerformance'
import { ConversationInsights } from './ConversationInsights'
import { RealtimeStats } from './RealtimeStats'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Clock, 
  Star,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react'
import type { AnalyticsData } from '@/types/types'

interface AnalyticsDashboardProps {
  className?: string
}

export function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock analytics data - in a real app, this would come from an API
  const analyticsData: AnalyticsData = useMemo(() => ({
    totalConversations: 1247,
    averageResponseTime: 2.3,
    sentimentTrend: [
      { date: '2025-01-26', score: 0.2 },
      { date: '2025-01-27', score: 0.1 },
      { date: '2025-01-28', score: -0.1 },
      { date: '2025-01-29', score: 0.3 },
      { date: '2025-01-30', score: 0.4 },
      { date: '2025-01-31', score: 0.2 },
      { date: '2025-02-01', score: 0.5 }
    ],
    responseQualityTrend: [
      { date: '2025-01-26', score: 7.8 },
      { date: '2025-01-27', score: 8.1 },
      { date: '2025-01-28', score: 7.9 },
      { date: '2025-01-29', score: 8.4 },
      { date: '2025-01-30', score: 8.6 },
      { date: '2025-01-31', score: 8.2 },
      { date: '2025-02-01', score: 8.8 }
    ],
    topCategories: [
      { category: 'Billing Issues', count: 324 },
      { category: 'Technical Support', count: 298 },
      { category: 'Sales Inquiries', count: 267 },
      { category: 'Account Management', count: 198 },
      { category: 'Product Questions', count: 160 }
    ],
    agentPerformance: [
      { agentId: 'agent-1', name: 'Sarah Johnson', avgQuality: 8.7, responseTime: 1.8, conversationsHandled: 145 },
      { agentId: 'agent-2', name: 'Mike Chen', avgQuality: 8.9, responseTime: 2.1, conversationsHandled: 132 },
      { agentId: 'agent-3', name: 'Emma Davis', avgQuality: 8.4, responseTime: 2.5, conversationsHandled: 128 },
      { agentId: 'agent-4', name: 'James Wilson', avgQuality: 8.2, responseTime: 2.8, conversationsHandled: 119 },
      { agentId: 'agent-5', name: 'Lisa Rodriguez', avgQuality: 8.6, responseTime: 2.0, conversationsHandled: 141 }
    ]
  }), [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleExport = () => {
    // In a real app, this would generate and download a report
    console.log('Exporting analytics data...')
  }

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '24h': return 'Last 24 Hours'
      case '7d': return 'Last 7 Days'
      case '30d': return 'Last 30 Days'
      case '90d': return 'Last 90 Days'
      default: return 'Last 7 Days'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into customer support performance and AI assistance effectiveness
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            {(['24h', '7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="text-xs"
              >
                {range.toUpperCase()}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Real-time Stats */}
      <RealtimeStats timeRange={getTimeRangeLabel(timeRange)} />

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Conversations</p>
                <p className="text-2xl font-bold">{analyticsData.totalConversations.toLocaleString()}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">+12.5%</span>
              <span className="text-muted-foreground ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{analyticsData.averageResponseTime}m</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">-18.2%</span>
              <span className="text-muted-foreground ml-1">faster response</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer Satisfaction</p>
                <p className="text-2xl font-bold">4.8/5</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">+5.2%</span>
              <span className="text-muted-foreground ml-1">satisfaction increase</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Usage Rate</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">+23.1%</span>
              <span className="text-muted-foreground ml-1">AI adoption</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <PerformanceMetrics 
            data={analyticsData}
            timeRange={timeRange}
          />
        </TabsContent>

        <TabsContent value="sentiment">
          <SentimentTrends 
            data={analyticsData.sentimentTrend}
            timeRange={timeRange}
          />
        </TabsContent>

        <TabsContent value="quality">
          <ResponseQualityChart 
            data={analyticsData.responseQualityTrend}
            timeRange={timeRange}
          />
        </TabsContent>

        <TabsContent value="agents">
          <AgentPerformance 
            data={analyticsData.agentPerformance}
            timeRange={timeRange}
          />
        </TabsContent>

        <TabsContent value="insights">
          <ConversationInsights 
            data={analyticsData}
            timeRange={timeRange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}