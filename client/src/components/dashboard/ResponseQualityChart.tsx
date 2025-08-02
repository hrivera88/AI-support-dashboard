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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { Star, TrendingUp, Target, Award } from 'lucide-react'

interface ResponseQualityChartProps {
  data: Array<{ date: string; score: number }>
  timeRange: string
  className?: string
}

export function ResponseQualityChart({ data, timeRange, className = '' }: ResponseQualityChartProps) {
  // Mock detailed quality data
  const qualityBreakdownData = data.map((item) => ({
    ...item,
    clarity: item.score - 0.5 + Math.random() * 0.3,
    completeness: item.score - 0.3 + Math.random() * 0.4,
    tone: item.score - 0.2 + Math.random() * 0.2,
    accuracy: item.score - 0.1 + Math.random() * 0.2,
    actionability: item.score - 0.4 + Math.random() * 0.3,
    aiAssisted: Math.random() > 0.3
  }))

  const criteriaData = [
    { criteria: 'Clarity', score: 8.7, target: 8.0, improvement: '+0.3' },
    { criteria: 'Completeness', score: 8.9, target: 8.5, improvement: '+0.5' },
    { criteria: 'Tone', score: 8.4, target: 8.0, improvement: '+0.2' },
    { criteria: 'Accuracy', score: 9.1, target: 9.0, improvement: '+0.1' },
    { criteria: 'Actionability', score: 8.3, target: 8.0, improvement: '+0.4' }
  ]

  const radarData = [
    { subject: 'Clarity', A: 8.7, B: 8.0, fullMark: 10 },
    { subject: 'Completeness', A: 8.9, B: 8.0, fullMark: 10 },
    { subject: 'Tone', A: 8.4, B: 8.0, fullMark: 10 },
    { subject: 'Accuracy', A: 9.1, B: 8.0, fullMark: 10 },
    { subject: 'Actionability', A: 8.3, B: 8.0, fullMark: 10 }
  ]

  const qualityDistributionData = [
    { range: '9.0-10.0', count: 45, percentage: 23 },
    { range: '8.0-8.9', count: 87, percentage: 44 },
    { range: '7.0-7.9', count: 52, percentage: 26 },
    { range: '6.0-6.9', count: 12, percentage: 6 },
    { range: '< 6.0', count: 2, percentage: 1 }
  ]

  const aiImpactData = data.map((item, index) => ({
    ...item,
    withAI: item.score + 0.8 + Math.random() * 0.4,
    withoutAI: item.score + 0.2 + Math.random() * 0.3
  }))

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getQualityColor = (score: number) => {
    if (score >= 9) return 'text-green-600 bg-green-100'
    if (score >= 8) return 'text-blue-600 bg-blue-100'
    if (score >= 7) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const currentQuality = data[data.length - 1]?.score || 0
  const previousQuality = data[data.length - 2]?.score || 0
  const qualityChange = currentQuality - previousQuality

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Overall Quality</p>
                <p className="text-xl font-bold">{currentQuality.toFixed(1)}/10</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">
                    +{Math.abs(qualityChange).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Target Achievement</p>
                <p className="text-xl font-bold">108%</p>
                <p className="text-xs text-green-600">Above target</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">High Quality Rate</p>
                <p className="text-xl font-bold">67%</p>
                <p className="text-xs text-green-600">Score ≥ 8.0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">AI Improvement</p>
                <p className="text-xl font-bold">+1.2</p>
                <p className="text-xs text-green-600">AI vs manual</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Response Quality Trend</CardTitle>
            <CardDescription>
              Overall response quality scores over time ({timeRange})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis 
                  domain={[6, 10]}
                  label={{ value: 'Quality Score', angle: -90, position: 'insideLeft' }}
                  fontSize={12}
                />
                <Tooltip 
                  labelFormatter={(label) => formatDate(label)}
                  formatter={(value: number) => [value.toFixed(1), 'Quality Score']}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quality Criteria Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Quality Criteria Analysis</CardTitle>
            <CardDescription>
              Performance across different quality dimensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 10]} />
                <Radar
                  name="Current"
                  dataKey="A"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Target"
                  dataKey="B"
                  stroke="#ef4444"
                  fill="transparent"
                  strokeDasharray="5 5"
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Impact Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>AI Impact on Quality</CardTitle>
            <CardDescription>
              Comparison of AI-assisted vs manual responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={aiImpactData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis 
                  domain={[6, 10]}
                  fontSize={12}
                />
                <Tooltip 
                  labelFormatter={(label) => formatDate(label)}
                  formatter={(value: number, name: string) => [
                    value.toFixed(1),
                    name === 'withAI' ? 'With AI' : 'Manual Only'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="withAI" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="withAI"
                />
                <Line 
                  type="monotone" 
                  dataKey="withoutAI" 
                  stroke="#6b7280" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="withoutAI"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quality Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Quality Score Distribution</CardTitle>
            <CardDescription>
              Distribution of response quality scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={qualityDistributionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="range" type="category" fontSize={12} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'count' ? value : `${value}%`,
                    name === 'count' ? 'Responses' : 'Percentage'
                  ]}
                />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quality Criteria Details */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Criteria Performance</CardTitle>
          <CardDescription>
            Detailed breakdown of quality metrics and targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criteriaData.map((criterion) => (
              <div key={criterion.criteria} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium">{criterion.criteria}</h4>
                    <p className="text-sm text-muted-foreground">
                      Target: {criterion.target}/10
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge className={`${getQualityColor(criterion.score)}`}>
                      {criterion.score}/10
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">
                      {criterion.improvement}
                    </span>
                  </div>
                  
                  <div className="w-20">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(criterion.score / 10) * 100}%` }}
                      />
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