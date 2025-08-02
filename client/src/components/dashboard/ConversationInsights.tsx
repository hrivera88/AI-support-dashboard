import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import { 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Target
} from 'lucide-react'
import type { AnalyticsData } from '@/types/types'

interface ConversationInsightsProps {
  data: AnalyticsData
  timeRange: string
  className?: string
}

export function ConversationInsights({ data, timeRange, className = '' }: ConversationInsightsProps) {
  // Mock additional insights data
  const resolutionTimeData = [
    { timeRange: '< 5min', count: 432, percentage: 35 },
    { timeRange: '5-15min', count: 521, percentage: 42 },
    { timeRange: '15-30min', count: 198, percentage: 16 },
    { timeRange: '30-60min', count: 74, percentage: 6 },
    { timeRange: '> 1hr', count: 22, percentage: 1 }
  ]

  const escalationData = [
    { reason: 'Complex Technical', count: 45, trend: 'up' },
    { reason: 'Billing Dispute', count: 38, trend: 'down' },
    { reason: 'Policy Exception', count: 32, trend: 'stable' },
    { reason: 'Refund Request', count: 28, trend: 'down' },
    { reason: 'Account Security', count: 19, trend: 'up' }
  ]

  const peakHoursData = [
    { hour: '9AM', conversations: 89, avgWait: 45 },
    { hour: '10AM', conversations: 124, avgWait: 67 },
    { hour: '11AM', conversations: 156, avgWait: 89 },
    { hour: '12PM', conversations: 134, avgWait: 78 },
    { hour: '1PM', conversations: 98, avgWait: 56 },
    { hour: '2PM', conversations: 145, avgWait: 82 },
    { hour: '3PM', conversations: 167, avgWait: 94 },
    { hour: '4PM', conversations: 189, avgWait: 112 },
    { hour: '5PM', conversations: 134, avgWait: 76 }
  ]

  const customerJourneyData = [
    { stage: 'Initial Contact', count: 1247, dropoff: 0 },
    { stage: 'Problem Identified', count: 1198, dropoff: 49 },
    { stage: 'Solution Proposed', count: 1145, dropoff: 53 },
    { stage: 'Solution Accepted', count: 1067, dropoff: 78 },
    { stage: 'Issue Resolved', count: 1034, dropoff: 33 },
    { stage: 'Follow-up Complete', count: 987, dropoff: 47 }
  ]

  const aiInsightsData = [
    { metric: 'AI Suggestion Acceptance', value: 78, change: '+12%' },
    { metric: 'Response Time Improvement', value: 34, change: '+8%' },
    { metric: 'Quality Score Boost', value: 1.2, change: '+0.3' },
    { metric: 'Agent Productivity Gain', value: 23, change: '+5%' }
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-3 w-3 text-red-500" />
      case 'down': return <ArrowDownRight className="h-3 w-3 text-green-500" />
      default: return <Target className="h-3 w-3 text-gray-400" />
    }
  }

  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-green-600'
    if (change.startsWith('-')) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Key Insights Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
                <p className="text-xl font-bold">91.2%</p>
                <p className="text-xs text-green-600">+3.2% improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Resolution Time</p>
                <p className="text-xl font-bold">18.5m</p>
                <p className="text-xs text-green-600">-4.2m faster</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">First Contact Resolution</p>
                <p className="text-xl font-bold">76%</p>
                <p className="text-xs text-green-600">+8.1% increase</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Escalation Rate</p>
                <p className="text-xl font-bold">8.8%</p>
                <p className="text-xs text-green-600">-2.1% reduction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Conversation Categories</CardTitle>
            <CardDescription>
              Most common support topics ({timeRange})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topCategories} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="category" type="category" width={100} fontSize={12} />
                <Tooltip 
                  formatter={(value: number) => [value, 'Conversations']}
                />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resolution Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Resolution Time Distribution</CardTitle>
            <CardDescription>
              How quickly issues are being resolved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resolutionTimeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {resolutionTimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, 'Conversations']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Peak Hours Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours Analysis</CardTitle>
            <CardDescription>
              Conversation volume and wait times by hour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" fontSize={12} />
                <YAxis yAxisId="left" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" fontSize={12} />
                <Tooltip />
                <Bar yAxisId="right" dataKey="conversations" fill="#8884d8" opacity={0.3} />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="avgWait" 
                  stroke="#ff7300" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Journey */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Journey Funnel</CardTitle>
            <CardDescription>
              Conversation flow from initial contact to resolution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={customerJourneyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="stage" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={10}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    value,
                    name === 'count' ? 'Conversations' : 'Dropoff'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Impact Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI Impact Analysis</CardTitle>
          <CardDescription>
            How AI assistance is improving support operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiInsightsData.map((insight) => (
              <div key={insight.metric} className="p-4 border rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">
                    {typeof insight.value === 'number' && insight.value < 10 
                      ? insight.value.toFixed(1) 
                      : insight.value}
                    {insight.metric.includes('Rate') || insight.metric.includes('Gain') ? '%' : ''}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {insight.metric}
                  </div>
                  <Badge variant="outline" className={`text-xs ${getChangeColor(insight.change)}`}>
                    {insight.change}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Escalation Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Escalation Analysis</CardTitle>
          <CardDescription>
            Common reasons for escalations and their trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {escalationData.map((escalation, index) => (
              <div key={escalation.reason} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium">{escalation.reason}</h4>
                    <p className="text-sm text-muted-foreground">
                      {escalation.count} escalations this period
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xl font-bold">{escalation.count}</div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {getTrendIcon(escalation.trend)}
                    <span className="text-xs text-muted-foreground capitalize">
                      {escalation.trend}
                    </span>
                  </div>
                  
                  <div className="w-16">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(escalation.count / 45) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Insights & Recommendations</CardTitle>
          <CardDescription>
            Actionable insights based on conversation analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Optimal Performance Window</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Response quality peaks between 10-11 AM. Consider scheduling complex cases during this time for better outcomes.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">AI Adoption Impact</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Agents using AI suggestions show 23% faster resolution times. Consider expanding AI training to all team members.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800">Escalation Prevention</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Technical support escalations increased 15% this week. Consider adding more detailed knowledge base articles for common API issues.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-800">Customer Satisfaction Driver</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Conversations with empathetic tone scoring show 40% higher satisfaction rates. Consider tone training for the team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}