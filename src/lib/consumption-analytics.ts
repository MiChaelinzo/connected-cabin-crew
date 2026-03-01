import type { InventoryItem } from './types'

export interface ConsumptionDataPoint {
  timestamp: number
  itemId: string
  itemName: string
  category: string
  quantity: number
  phase: string
}

export interface ConsumptionTrend {
  itemId: string
  itemName: string
  category: string
  dataPoints: { timestamp: number; quantity: number }[]
  totalConsumed: number
  averageRate: number
  peakPhase: string
}

export interface CategoryAnalytics {
  category: string
  totalConsumed: number
  itemsTracked: number
  averageConsumptionRate: number
  topItems: { name: string; consumed: number }[]
}

export interface PhaseAnalytics {
  phase: string
  totalConsumed: number
  duration: number
  itemBreakdown: { category: string; consumed: number }[]
}

export interface PredictiveInsight {
  type: 'depletion' | 'surplus' | 'optimization'
  itemId: string
  itemName: string
  message: string
  severity: 'low' | 'medium' | 'high'
  estimatedTime?: number
}

export function recordConsumption(
  itemId: string,
  itemName: string,
  category: string,
  quantity: number,
  phase: string,
  existingData: ConsumptionDataPoint[]
): ConsumptionDataPoint[] {
  const dataPoint: ConsumptionDataPoint = {
    timestamp: Date.now(),
    itemId,
    itemName,
    category,
    quantity,
    phase
  }
  
  return [...existingData, dataPoint]
}

export function calculateTrends(
  consumptionData: ConsumptionDataPoint[],
  inventory: InventoryItem[]
): ConsumptionTrend[] {
  const itemGroups = consumptionData.reduce((acc, point) => {
    if (!acc[point.itemId]) {
      acc[point.itemId] = []
    }
    acc[point.itemId].push(point)
    return acc
  }, {} as Record<string, ConsumptionDataPoint[]>)

  return Object.entries(itemGroups).map(([itemId, points]) => {
    const item = inventory.find(i => i.id === itemId)
    const sortedPoints = points.sort((a, b) => a.timestamp - b.timestamp)
    
    const aggregatedData = sortedPoints.reduce((acc, point) => {
      const lastPoint = acc[acc.length - 1]
      if (!lastPoint) {
        acc.push({ timestamp: point.timestamp, quantity: point.quantity })
      } else {
        acc.push({
          timestamp: point.timestamp,
          quantity: lastPoint.quantity + point.quantity
        })
      }
      return acc
    }, [] as { timestamp: number; quantity: number }[])

    const totalConsumed = points.reduce((sum, p) => sum + p.quantity, 0)
    const timeSpan = (sortedPoints[sortedPoints.length - 1]?.timestamp || 0) - (sortedPoints[0]?.timestamp || 0)
    const averageRate = timeSpan > 0 ? (totalConsumed / timeSpan) * 60000 : 0

    const phaseConsumption = points.reduce((acc, p) => {
      acc[p.phase] = (acc[p.phase] || 0) + p.quantity
      return acc
    }, {} as Record<string, number>)
    
    const peakPhase = Object.entries(phaseConsumption)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown'

    return {
      itemId,
      itemName: points[0]?.itemName || item?.name || 'Unknown',
      category: points[0]?.category || item?.category || 'supplies',
      dataPoints: aggregatedData,
      totalConsumed,
      averageRate,
      peakPhase
    }
  })
}

export function calculateCategoryAnalytics(
  consumptionData: ConsumptionDataPoint[]
): CategoryAnalytics[] {
  const categoryGroups = consumptionData.reduce((acc, point) => {
    if (!acc[point.category]) {
      acc[point.category] = []
    }
    acc[point.category].push(point)
    return acc
  }, {} as Record<string, ConsumptionDataPoint[]>)

  return Object.entries(categoryGroups).map(([category, points]) => {
    const totalConsumed = points.reduce((sum, p) => sum + p.quantity, 0)
    const uniqueItems = new Set(points.map(p => p.itemId))
    
    const itemConsumption = points.reduce((acc, p) => {
      acc[p.itemName] = (acc[p.itemName] || 0) + p.quantity
      return acc
    }, {} as Record<string, number>)

    const topItems = Object.entries(itemConsumption)
      .map(([name, consumed]) => ({ name, consumed }))
      .sort((a, b) => b.consumed - a.consumed)
      .slice(0, 5)

    const timeSpan = (points[points.length - 1]?.timestamp || 0) - (points[0]?.timestamp || 0)
    const averageConsumptionRate = timeSpan > 0 ? (totalConsumed / timeSpan) * 60000 : 0

    return {
      category,
      totalConsumed,
      itemsTracked: uniqueItems.size,
      averageConsumptionRate,
      topItems
    }
  })
}

export function calculatePhaseAnalytics(
  consumptionData: ConsumptionDataPoint[]
): PhaseAnalytics[] {
  const phaseGroups = consumptionData.reduce((acc, point) => {
    if (!acc[point.phase]) {
      acc[point.phase] = []
    }
    acc[point.phase].push(point)
    return acc
  }, {} as Record<string, ConsumptionDataPoint[]>)

  return Object.entries(phaseGroups).map(([phase, points]) => {
    const totalConsumed = points.reduce((sum, p) => sum + p.quantity, 0)
    const sortedPoints = points.sort((a, b) => a.timestamp - b.timestamp)
    const duration = (sortedPoints[sortedPoints.length - 1]?.timestamp || 0) - (sortedPoints[0]?.timestamp || 0)

    const categoryBreakdown = points.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + p.quantity
      return acc
    }, {} as Record<string, number>)

    const itemBreakdown = Object.entries(categoryBreakdown)
      .map(([category, consumed]) => ({ category, consumed }))
      .sort((a, b) => b.consumed - a.consumed)

    return {
      phase,
      totalConsumed,
      duration,
      itemBreakdown
    }
  })
}

export function generatePredictiveInsights(
  trends: ConsumptionTrend[],
  inventory: InventoryItem[],
  currentPhase: string,
  remainingFlightTime: number
): PredictiveInsight[] {
  const insights: PredictiveInsight[] = []

  trends.forEach(trend => {
    const item = inventory.find(i => i.id === trend.itemId)
    if (!item) return

    const projectedConsumption = trend.averageRate * remainingFlightTime

    if (item.current < projectedConsumption && item.current > 0) {
      const timeToDepletion = item.current / trend.averageRate
      insights.push({
        type: 'depletion',
        itemId: item.id,
        itemName: item.name,
        message: `${item.name} projected to run out in ${Math.round(timeToDepletion / 60000)} minutes at current consumption rate`,
        severity: timeToDepletion < 1800000 ? 'high' : 'medium',
        estimatedTime: Date.now() + timeToDepletion
      })
    }

    if (item.current === 0 && trend.averageRate > 0) {
      insights.push({
        type: 'depletion',
        itemId: item.id,
        itemName: item.name,
        message: `${item.name} is depleted. Consider alternatives or notify passengers.`,
        severity: 'high'
      })
    }

    const projectedRemaining = item.current - projectedConsumption
    const surplusPercentage = (projectedRemaining / item.capacity) * 100

    if (surplusPercentage > 40 && trend.totalConsumed > 0) {
      insights.push({
        type: 'surplus',
        itemId: item.id,
        itemName: item.name,
        message: `${item.name} has ${Math.round(surplusPercentage)}% surplus. Consider reducing load for future flights.`,
        severity: 'low'
      })
    }

    if (trend.peakPhase === currentPhase && item.current < item.capacity * 0.3) {
      insights.push({
        type: 'optimization',
        itemId: item.id,
        itemName: item.name,
        message: `${item.name} consumption peaks during ${currentPhase} phase. Stock running low during peak demand.`,
        severity: 'medium'
      })
    }
  })

  return insights.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 }
    return severityOrder[b.severity] - severityOrder[a.severity]
  })
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ago`
  }
  return `${minutes}m ago`
}

export function formatRate(rate: number): string {
  if (rate < 1) {
    return `${(rate * 60).toFixed(1)}/hr`
  }
  return `${rate.toFixed(1)}/min`
}
