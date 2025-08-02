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
  ScatterChart,
  Scatter
} from 'recharts'
import { User, Star, Clock, MessageSquare, TrendingUp } from 'lucide-react'

interface AgentPerformanceData {
  agentId: string
  name: string
  avgQuality: number
  responseTime: number
  conversationsHandled: number
}

interface AgentPerformanceProps {
  data: AgentPerformanceData[]
  timeRange: string
  className?: string
}

export function AgentPerformance({ data, timeRange, className = '' }: AgentPerformanceProps) {
  // Mock additional agent metrics
  const extendedAgentData = data.map((agent) => ({
    ...agent,
    satisfactionScore: agent.avgQuality - 0.5 + Math.random() * 0.3,
    resolutionRate: 85 + Math.random() * 10,
    escalationRate: 5 + Math.random() * 8,
    aiUsageRate: 70 + Math.random() * 25,
    weeklyTrend: [
      { day: 'Mon', quality: agent.avgQuality - 0.3 + Math.random() * 0.6 },
      { day: 'Tue', quality: agent.avgQuality - 0.2 + Math.random() * 0.4 },
      { day: 'Wed', quality: agent.avgQuality - 0.1 + Math.random() * 0.2 },
      { day: 'Thu', quality: agent.avgQuality + Math.random() * 0.3 },
      { day: 'Fri', quality: agent.avgQuality - 0.2 + Math.random() * 0.4 },
      { day: 'Sat', quality: agent.avgQuality - 0.4 + Math.random() * 0.5 },
      { day: 'Sun', quality: agent.avgQuality - 0.3 + Math.random() * 0.4 }
    ]
  }))

  const teamPerformanceData = [
    { metric: 'Avg Quality', team: 8.6, target: 8.0, best: 8.9 },
    { metric: 'Response Time', team: 2.2, target: 3.0, best: 1.8 },
    { metric: 'Resolution Rate', team: 89, target: 85, best: 94 },
    { metric: 'Customer Satisfaction', team: 4.7, target: 4.5, best: 4.9 }
  ]

  // Sort agents by performance score (composite of quality and response time)
  const sortedAgents = [...extendedAgentData].sort((a, b) => {
    const scoreA = a.avgQuality * 0.7 + (4 - a.responseTime) * 0.3
    const scoreB = b.avgQuality * 0.7 + (4 - b.responseTime) * 0.3
    return scoreB - scoreA
  })

  const getPerformanceColor = (score: number, type: 'quality' | 'time' | 'rate') => {
    if (type === 'quality') {
      if (score >= 8.5) return 'text-green-600 bg-green-100'
      if (score >= 8.0) return 'text-blue-600 bg-blue-100'
      if (score >= 7.5) return 'text-yellow-600 bg-yellow-100'
      return 'text-red-600 bg-red-100'
    } else if (type === 'time') {
      if (score <= 2.0) return 'text-green-600 bg-green-100'
      if (score <= 2.5) return 'text-blue-600 bg-blue-100'
      if (score <= 3.0) return 'text-yellow-600 bg-yellow-100'
      return 'text-red-600 bg-red-100'
    } else {
      if (score >= 90) return 'text-green-600 bg-green-100'
      if (score >= 85) return 'text-blue-600 bg-blue-100'
      if (score >= 80) return 'text-yellow-600 bg-yellow-100'
      return 'text-red-600 bg-red-100'
    }
  }

  const getAgentRank = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Team Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <p className="text-xl font-bold">{data.length}</p>
                <p className="text-xs text-green-600">All online</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Team Avg Quality</p>
                <p className="text-xl font-bold">8.6/10</p>
                <p className="text-xs text-green-600">+0.3 vs target</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Team Avg Response</p>
                <p className="text-xl font-bold">2.2m</p>
                <p className="text-xs text-green-600">26% faster</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Conversations</p>
                <p className="text-xl font-bold">{data.reduce((sum, agent) => sum + agent.conversationsHandled, 0)}</p>
                <p className="text-xs text-green-600">This period</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Performance Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Performance Comparison</CardTitle>
            <CardDescription>
              Quality scores and response times by agent ({timeRange})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'avgQuality' ? value.toFixed(1) : 
                    name === 'responseTime' ? `${value.toFixed(1)}m` : value,
                    name === 'avgQuality' ? 'Quality Score' :
                    name === 'responseTime' ? 'Response Time' : 'Conversations'
                  ]}
                />
                <Bar dataKey="avgQuality" fill="#8b5cf6" />
                <Bar dataKey="responseTime" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quality vs Response Time Scatter */}
        <Card>
          <CardHeader>
            <CardTitle>Quality vs Response Time</CardTitle>
            <CardDescription>
              Agent positioning by quality and speed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="responseTime" 
                  name="Response Time"
                  unit="m"
                  fontSize={12}
                />
                <YAxis 
                  type="number" 
                  dataKey="avgQuality" 
                  name="Quality"
                  domain={[7, 10]}
                  fontSize={12}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length > 0) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white p-3 border rounded shadow">
                          <p className="font-medium">{data.name}</p>
                          <p>Quality: {data.avgQuality.toFixed(1)}/10</p>
                          <p>Response Time: {data.responseTime.toFixed(1)}m</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Scatter 
                  dataKey="avgQuality" 
                  fill="#8b5cf6"
                  r={8}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Agent Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance Leaderboard</CardTitle>
          <CardDescription>
            Ranked by overall performance score (quality + speed + volume)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedAgents.map((agent, index) => (
              <div key={agent.agentId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-2xl min-w-[3rem] text-center">
                    {getAgentRank(index)}
                  </div>
                  <User className="h-10 w-10 text-blue-600" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium">{agent.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {agent.conversationsHandled} conversations handled
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <Badge className={`${getPerformanceColor(agent.avgQuality, 'quality')}`}>
                      {agent.avgQuality.toFixed(1)}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">Quality</p>
                  </div>
                  
                  <div className="text-center">
                    <Badge className={`${getPerformanceColor(agent.responseTime, 'time')}`}>
                      {agent.responseTime.toFixed(1)}m
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">Response</p>
                  </div>
                  
                  <div className="text-center">
                    <Badge className={`${getPerformanceColor(agent.resolutionRate, 'rate')}`}>
                      {agent.resolutionRate.toFixed(0)}%
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">Resolution</p>
                  </div>
                  
                  <div className="text-center">
                    <Badge variant="outline">
                      {agent.aiUsageRate.toFixed(0)}%
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">AI Usage</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Metrics Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance Metrics</CardTitle>
          <CardDescription>
            Current team performance vs targets and best performers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamPerformanceData.map((metric) => (
              <div key={metric.metric} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium">{metric.metric}</h4>
                    <p className="text-sm text-muted-foreground">
                      Target: {metric.target} • Best: {metric.best}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xl font-bold">
                      {metric.metric === 'Response Time' ? `${metric.team}m` : 
                       metric.metric === 'Customer Satisfaction' ? `${metric.team}/5` :
                       metric.metric.includes('Rate') ? `${metric.team}%` : metric.team}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">
                        {metric.team > metric.target ? 'Above target' : 'Below target'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-32">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, (metric.team / metric.best) * 100)}%` 
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {((metric.team / metric.best) * 100).toFixed(0)}% of best
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}