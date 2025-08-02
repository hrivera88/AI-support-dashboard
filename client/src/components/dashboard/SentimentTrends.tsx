import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  Cell,
  ComposedChart
} from 'recharts'
import { Smile, Frown, Meh, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'

interface SentimentTrendsProps {
  data: Array<{ date: string; score: number }>
  timeRange: string
  className?: string
}

export function SentimentTrends({ data, timeRange, className = '' }: SentimentTrendsProps) {
  // Mock detailed sentiment data
  const detailedSentimentData = data.map((item, index) => ({
    ...item,
    positive: Math.max(0, item.score * 100 + 50 + Math.random() * 20),
    negative: Math.max(0, -item.score * 100 + 30 + Math.random() * 15),
    neutral: 100 - Math.abs(item.score * 100) + Math.random() * 10,
    volume: 120 + Math.random() * 80
  }))

  const emotionBreakdownData = [
    { emotion: 'Joy', value: 35, color: '#10b981' },
    { emotion: 'Satisfaction', value: 28, color: '#3b82f6' },
    { emotion: 'Neutral', value: 20, color: '#6b7280' },
    { emotion: 'Frustration', value: 12, color: '#f59e0b' },
    { emotion: 'Anger', value: 5, color: '#ef4444' }
  ]

  const categorysentimentData = [
    { category: 'Billing', avgSentiment: 0.2, volume: 324, trend: 'improving' },
    { category: 'Technical', avgSentiment: 0.4, volume: 298, trend: 'stable' },
    { category: 'Sales', avgSentiment: 0.7, volume: 267, trend: 'improving' },
    { category: 'Account', avgSentiment: 0.1, volume: 198, trend: 'declining' },
    { category: 'Product', avgSentiment: 0.5, volume: 160, trend: 'improving' }
  ]

  const hourlyPatternData = [
    { hour: '00', sentiment: 0.3, volume: 12 },
    { hour: '02', sentiment: 0.1, volume: 8 },
    { hour: '04', sentiment: 0.2, volume: 5 },
    { hour: '06', sentiment: 0.4, volume: 15 },
    { hour: '08', sentiment: 0.1, volume: 45 },
    { hour: '10', sentiment: 0.3, volume: 67 },
    { hour: '12', sentiment: 0.2, volume: 89 },
    { hour: '14', sentiment: 0.4, volume: 78 },
    { hour: '16', sentiment: 0.1, volume: 92 },
    { hour: '18', sentiment: 0.3, volume: 76 },
    { hour: '20', sentiment: 0.5, volume: 54 },
    { hour: '22', sentiment: 0.4, volume: 32 }
  ]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getSentimentColor = (score: number) => {
    if (score >= 0.2) return 'text-green-600 bg-green-100'
    if (score <= -0.2) return 'text-red-600 bg-red-100'
    return 'text-yellow-600 bg-yellow-100'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-3 w-3 text-green-500" />
      case 'declining': return <TrendingDown className="h-3 w-3 text-red-500" />
      default: return <AlertTriangle className="h-3 w-3 text-gray-400" />
    }
  }

  const currentSentiment = data[data.length - 1]?.score || 0
  const previousSentiment = data[data.length - 2]?.score || 0
  const sentimentChange = currentSentiment - previousSentiment

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Smile className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Current Sentiment</p>
                <p className="text-xl font-bold">{(currentSentiment * 100).toFixed(1)}%</p>
                <div className="flex items-center gap-1">
                  {sentimentChange > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs ${sentimentChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(sentimentChange * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Smile className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Positive</p>
                <p className="text-xl font-bold">68%</p>
                <p className="text-xs text-green-600">+5.2% vs last period</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Meh className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Neutral</p>
                <p className="text-xl font-bold">20%</p>
                <p className="text-xs text-yellow-600">-1.8% vs last period</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Frown className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Negative</p>
                <p className="text-xl font-bold">12%</p>
                <p className="text-xs text-red-600">-3.4% vs last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trend</CardTitle>
            <CardDescription>
              Overall customer sentiment over time ({timeRange})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={detailedSentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis 
                  label={{ value: 'Sentiment Score', angle: -90, position: 'insideLeft' }}
                  fontSize={12}
                  domain={[-100, 100]}
                />
                <Tooltip 
                  labelFormatter={(label) => formatDate(label)}
                  formatter={(value: number) => [value.toFixed(1), 'Sentiment Score']}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sentiment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>
              Positive vs negative vs neutral sentiment breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={detailedSentimentData}>
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
                    `${value.toFixed(1)}%`,
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                />
                <Bar dataKey="positive" stackId="a" fill="#10b981" />
                <Bar dataKey="neutral" stackId="a" fill="#6b7280" />
                <Bar dataKey="negative" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Emotion Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Emotion Analysis</CardTitle>
            <CardDescription>
              Detailed emotional state breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emotionBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {emotionBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Patterns */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Sentiment Patterns</CardTitle>
            <CardDescription>
              Sentiment and volume by time of day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={hourlyPatternData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" fontSize={12} />
                <YAxis yAxisId="left" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" fontSize={12} />
                <Tooltip />
                <Bar yAxisId="right" dataKey="volume" fill="#8884d8" opacity={0.3} />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="sentiment" 
                  stroke="#ff7300" 
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Sentiment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment by Category</CardTitle>
          <CardDescription>
            Average sentiment scores across different support categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categorysentimentData.map((category) => (
              <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium">{category.category}</h4>
                    <p className="text-sm text-muted-foreground">
                      {category.volume} conversations
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge className={`${getSentimentColor(category.avgSentiment)}`}>
                      {(category.avgSentiment * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {getTrendIcon(category.trend)}
                    <span className="text-xs text-muted-foreground capitalize">
                      {category.trend}
                    </span>
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