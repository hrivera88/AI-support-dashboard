import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Users, MessageSquare, Clock, TrendingUp, AlertTriangle } from 'lucide-react'

interface RealtimeStatsProps {
  timeRange: string
  className?: string
}

export function RealtimeStats({ timeRange, className = '' }: RealtimeStatsProps) {
  const [activeAgents, setActiveAgents] = useState(8)
  const [queuedConversations, setQueuedConversations] = useState(12)
  const [avgWaitTime, setAvgWaitTime] = useState(45)
  const [currentLoad, setCurrentLoad] = useState(73)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgents(prev => Math.max(5, prev + Math.floor(Math.random() * 3) - 1))
      setQueuedConversations(prev => Math.max(0, prev + Math.floor(Math.random() * 5) - 2))
      setAvgWaitTime(prev => Math.max(15, prev + Math.floor(Math.random() * 20) - 10))
      setCurrentLoad(prev => Math.max(20, Math.min(95, prev + Math.floor(Math.random() * 10) - 5)))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getLoadColor = (load: number) => {
    if (load >= 80) return 'text-red-600 bg-red-100'
    if (load >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const getWaitTimeColor = (time: number) => {
    if (time >= 60) return 'text-red-600'
    if (time >= 30) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Real-time Operations
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Live • {timeRange}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Active Agents */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-lg font-semibold">{activeAgents}</div>
              <div className="text-xs text-muted-foreground">Active Agents</div>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600">Online</span>
              </div>
            </div>
          </div>

          {/* Queue Status */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <MessageSquare className="h-8 w-8 text-orange-600" />
            <div>
              <div className="text-lg font-semibold">{queuedConversations}</div>
              <div className="text-xs text-muted-foreground">In Queue</div>
              <div className="flex items-center gap-1 mt-1">
                {queuedConversations > 15 ? (
                  <>
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-red-600">High</span>
                  </>
                ) : queuedConversations > 8 ? (
                  <>
                    <TrendingUp className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-yellow-600">Medium</span>
                  </>
                ) : (
                  <>
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Normal</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Average Wait Time */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Clock className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-lg font-semibold">{avgWaitTime}s</div>
              <div className="text-xs text-muted-foreground">Avg Wait</div>
              <div className="flex items-center gap-1 mt-1">
                <div className={`w-1 h-1 rounded-full ${
                  avgWaitTime >= 60 ? 'bg-red-500' :
                  avgWaitTime >= 30 ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span className={`text-xs ${getWaitTimeColor(avgWaitTime)}`}>
                  {avgWaitTime >= 60 ? 'Slow' : avgWaitTime >= 30 ? 'Fair' : 'Fast'}
                </span>
              </div>
            </div>
          </div>

          {/* System Load */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Activity className="h-8 w-8 text-green-600" />
            <div className="flex-1">
              <div className="text-lg font-semibold">{currentLoad}%</div>
              <div className="text-xs text-muted-foreground">System Load</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-gray-200 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      currentLoad >= 80 ? 'bg-red-500' :
                      currentLoad >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${currentLoad}%` }}
                  />
                </div>
                <Badge variant="secondary" className={`text-xs px-1 py-0 ${getLoadColor(currentLoad)}`}>
                  {currentLoad >= 80 ? 'High' : currentLoad >= 60 ? 'Med' : 'Low'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions/Alerts */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {queuedConversations > 15 && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                High queue volume
              </Badge>
            )}
            {avgWaitTime > 90 && (
              <Badge variant="destructive" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Long wait times
              </Badge>
            )}
            {currentLoad > 85 && (
              <Badge variant="destructive" className="text-xs">
                <Activity className="w-3 h-3 mr-1" />
                System overload
              </Badge>
            )}
            {activeAgents < 6 && (
              <Badge variant="destructive" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                Low agent availability
              </Badge>
            )}
            {queuedConversations <= 5 && avgWaitTime <= 30 && currentLoad <= 60 && (
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                All systems optimal
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}