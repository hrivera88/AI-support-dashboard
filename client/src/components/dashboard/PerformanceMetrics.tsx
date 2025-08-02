import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts'
import { TrendingUp, Clock, MessageSquare, CheckCircle } from 'lucide-react'
import type { AnalyticsData } from '@/types/types'

interface PerformanceMetricsProps {
  data: AnalyticsData
  timeRange: string
  className?: string
}

export function PerformanceMetrics({ data, timeRange, className = '' }: PerformanceMetricsProps) {
  // Mock performance data for charts
  const responseTimeData = [
    { date: '2025-01-26', responseTime: 2.8, target: 3.0 },
    { date: '2025-01-27', responseTime: 2.5, target: 3.0 },
    { date: '2025-01-28', responseTime: 3.2, target: 3.0 },
    { date: '2025-01-29', responseTime: 2.1, target: 3.0 },
    { date: '2025-01-30', responseTime: 1.9, target: 3.0 },
    { date: '2025-01-31', responseTime: 2.3, target: 3.0 },
    { date: '2025-02-01', responseTime: 2.0, target: 3.0 }
  ]

  const conversationVolumeData = [
    { date: '2025-01-26', conversations: 156, resolved: 142, escalations: 14 },
    { date: '2025-01-27', conversations: 178, resolved: 165, escalations: 13 },
    { date: '2025-01-28', conversations: 143, resolved: 128, escalations: 15 },
    { date: '2025-01-29', conversations: 189, resolved: 175, escalations: 14 },
    { date: '2025-01-30', conversations: 167, resolved: 156, escalations: 11 },
    { date: '2025-01-31', conversations: 198, resolved: 185, escalations: 13 },
    { date: '2025-02-01', conversations: 216, resolved: 201, escalations: 15 }
  ]

  const resolutionRateData = [
    { category: 'First Contact', value: 76, color: '#10b981' },
    { category: 'Second Contact', value: 18, color: '#f59e0b' },
    { category: 'Escalated', value: 6, color: '#ef4444' }
  ]

  const channelData = [
    { date: '2025-01-26', chat: 89, email: 45, phone: 22 },
    { date: '2025-01-27', chat: 98, email: 52, phone: 28 },
    { date: '2025-01-28', chat: 76, email: 39, phone: 28 },
    { date: '2025-01-29', chat: 105, email: 58, phone: 26 },
    { date: '2025-01-30', chat: 92, email: 48, phone: 27 },
    { date: '2025-01-31', chat: 109, email: 61, phone: 28 },
    { date: '2025-02-01', chat: 118, email: 68, phone: 30 }
  ]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-xl font-bold">{data.averageResponseTime}m</p>
                <p className="text-xs text-green-600">18% improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
                <p className="text-xl font-bold">91.2%</p>
                <p className="text-xs text-green-600">5.3% increase</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">First Contact Resolution</p>
                <p className="text-xl font-bold">76%</p>
                <p className="text-xs text-green-600">8.1% better</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                <p className="text-xl font-bold">4.8/5</p>
                <p className="text-xs text-green-600">0.3 point gain</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time Trend</CardTitle>
            <CardDescription>
              Average response time vs target ({timeRange})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis 
                  label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
                  fontSize={12}
                />
                <Tooltip 
                  labelFormatter={(label) => formatDate(label)}
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)}m`,
                    name === 'responseTime' ? 'Response Time' : 'Target'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#ef4444" 
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversation Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Conversation Volume</CardTitle>
            <CardDescription>
              Total conversations and resolution rates ({timeRange})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={conversationVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  labelFormatter={(label) => formatDate(label)}
                  formatter={(value: number, name: string) => [
                    value,
                    name === 'conversations' ? 'Total' :
                    name === 'resolved' ? 'Resolved' : 'Escalated'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="conversations" 
                  stackId="1" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="resolved" 
                  stackId="2" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resolution Rate Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Resolution Rate Breakdown</CardTitle>
            <CardDescription>
              First contact vs escalation rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resolutionRateData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {resolutionRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Channel Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Performance</CardTitle>
            <CardDescription>
              Conversation volume by channel ({timeRange})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  labelFormatter={(label) => formatDate(label)}
                  formatter={(value: number, name: string) => [
                    value,
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                />
                <Bar dataKey="chat" stackId="a" fill="#3b82f6" />
                <Bar dataKey="email" stackId="a" fill="#10b981" />
                <Bar dataKey="phone" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}