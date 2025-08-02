import { useEffect, useRef, useState, useCallback } from 'react'

interface PerformanceMetrics {
  renderTime: number
  componentMountTime: number
  memoryUsage?: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
  renderCount: number
  lastRenderTime: number
}

interface PerformanceOptions {
  trackMemory?: boolean
  sampleRate?: number
  maxSamples?: number
}

/**
 * Hook for monitoring component performance metrics
 */
export function usePerformanceMonitor(
  componentName: string,
  options: PerformanceOptions = {}
) {
  const {
    trackMemory = false,
    sampleRate = 1, // 100% by default
    maxSamples = 100
  } = options

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    componentMountTime: 0,
    renderCount: 0,
    lastRenderTime: 0
  })

  const mountTimeRef = useRef<number>(0)
  const renderStartRef = useRef<number>(0)
  const renderTimesRef = useRef<number[]>([])
  const renderCountRef = useRef<number>(0)
  const isMountedRef = useRef<boolean>(true)
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Start render timing
  const startRenderTiming = useCallback(() => {
    if (Math.random() > sampleRate) return
    renderStartRef.current = performance.now()
  }, [sampleRate])

  // End render timing
  const endRenderTiming = useCallback(() => {
    if (renderStartRef.current === 0 || !isMountedRef.current) return
    
    const renderTime = performance.now() - renderStartRef.current
    renderTimesRef.current.push(renderTime)
    
    // Keep only the last maxSamples
    if (renderTimesRef.current.length > maxSamples) {
      renderTimesRef.current.shift()
    }

    renderCountRef.current++

    const averageRenderTime = renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length

    // Only update state if component is still mounted
    if (isMountedRef.current) {
      setMetrics(prev => ({
        ...prev,
        renderTime: averageRenderTime,
        renderCount: renderCountRef.current,
        lastRenderTime: renderTime,
        ...(trackMemory && (performance as any).memory ? {
          memoryUsage: (performance as any).memory
        } : {})
      }))
    }

    renderStartRef.current = 0
  }, [maxSamples, trackMemory])

  // Track component mount time
  useEffect(() => {
    const mountTime = performance.now()
    mountTimeRef.current = mountTime

    if (isMountedRef.current) {
      setMetrics(prev => ({
        ...prev,
        componentMountTime: mountTime
      }))
    }

    // Log slow mounts in development
    if (process.env.NODE_ENV === 'development') {
      const mountDuration = mountTime - (window.performance?.timing?.navigationStart || 0)
      if (mountDuration > 100) { // Log if mount takes more than 100ms
        console.warn(`Slow component mount: ${componentName} took ${mountDuration.toFixed(2)}ms`)
      }
    }
  }, [componentName])

  // Performance timing for each render
  useEffect(() => {
    startRenderTiming()
    
    // Use a microtask to measure after DOM updates
    Promise.resolve().then(endRenderTiming)
  })

  const logMetrics = useCallback(() => {
    console.group(`Performance Metrics: ${componentName}`)
    console.log(`Average Render Time: ${metrics.renderTime.toFixed(2)}ms`)
    console.log(`Last Render Time: ${metrics.lastRenderTime.toFixed(2)}ms`)
    console.log(`Total Renders: ${metrics.renderCount}`)
    console.log(`Component Mount Time: ${metrics.componentMountTime.toFixed(2)}ms`)
    
    if (metrics.memoryUsage) {
      console.log(`Memory Usage: ${(metrics.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`)
      console.log(`Memory Limit: ${(metrics.memoryUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`)
    }
    
    console.groupEnd()
  }, [componentName, metrics])

  const resetMetrics = useCallback(() => {
    renderTimesRef.current = []
    renderCountRef.current = 0
    setMetrics({
      renderTime: 0,
      componentMountTime: performance.now(),
      renderCount: 0,
      lastRenderTime: 0,
      ...(trackMemory && (performance as any).memory ? {
        memoryUsage: (performance as any).memory
      } : {})
    })
  }, [trackMemory])

  return {
    metrics,
    logMetrics,
    resetMetrics,
    isSlowRender: metrics.lastRenderTime > 16, // Slower than 60fps
    averageRenderTime: metrics.renderTime
  }
}

/**
 * Hook for tracking Web Vitals and Core Web Vitals
 */
export function useWebVitals() {
  const [vitals, setVitals] = useState<{
    FCP?: number // First Contentful Paint
    LCP?: number // Largest Contentful Paint
    FID?: number // First Input Delay
    CLS?: number // Cumulative Layout Shift
    TTFB?: number // Time to First Byte
  }>({})
  
  const isMountedRef = useRef<boolean>(true)

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return

    // First Contentful Paint
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint' && isMountedRef.current) {
          setVitals(prev => ({ ...prev, FCP: entry.startTime }))
        }
      }
    })

    try {
      observer.observe({ entryTypes: ['paint'] })
    } catch (e) {
      // Fallback for browsers that don't support observer
    }

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      if (!isMountedRef.current) return
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      setVitals(prev => ({ ...prev, LCP: lastEntry.startTime }))
    })

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      // Fallback for browsers that don't support LCP
    }

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      if (!isMountedRef.current) return
      for (const entry of list.getEntries()) {
        setVitals(prev => ({ ...prev, FID: (entry as any).processingStart - entry.startTime }))
      }
    })

    try {
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (e) {
      // Fallback for browsers that don't support FID
    }

    // Time to First Byte
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation && isMountedRef.current) {
      setVitals(prev => ({ ...prev, TTFB: navigation.responseStart - navigation.requestStart }))
    }

    return () => {
      isMountedRef.current = false
      observer.disconnect()
      lcpObserver.disconnect()
      fidObserver.disconnect()
    }
  }, [])

  const getVitalScore = (vital: keyof typeof vitals) => {
    const value = vitals[vital]
    if (!value) return 'unknown'

    switch (vital) {
      case 'FCP':
        return value < 1800 ? 'good' : value < 3000 ? 'needs-improvement' : 'poor'
      case 'LCP':
        return value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor'
      case 'FID':
        return value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor'
      case 'CLS':
        return value < 0.1 ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor'
      case 'TTFB':
        return value < 800 ? 'good' : value < 1800 ? 'needs-improvement' : 'poor'
      default:
        return 'unknown'
    }
  }

  const logWebVitals = useCallback(() => {
    console.group('Web Vitals')
    Object.entries(vitals).forEach(([key, value]) => {
      if (value !== undefined) {
        const score = getVitalScore(key as keyof typeof vitals)
        console.log(`${key}: ${value.toFixed(2)}ms (${score})`)
      }
    })
    console.groupEnd()
  }, [vitals])

  return {
    vitals,
    getVitalScore,
    logWebVitals,
    hasGoodVitals: Object.entries(vitals).every(([key, value]) => 
      value === undefined || getVitalScore(key as keyof typeof vitals) === 'good'
    )
  }
}