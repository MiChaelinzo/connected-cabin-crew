import { useMemo, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  ChartBarHorizontal, 
  TrendUp, 
  Lightbulb, 
  Clock, 
  Package,
  ForkKnife,
  Coffee,
  ShoppingCart,
  Warning,
  DownloadSimple,
  FileCsv,
  FilePdf
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { InventoryItem, FlightInfo } from '@/lib/types'
import type { ConsumptionDataPoint } from '@/lib/consumption-analytics'
import {
  calculateTrends,
  calculateCategoryAnalytics,
  calculatePhaseAnalytics,
  generatePredictiveInsights,
  formatRate
} from '@/lib/consumption-analytics'
import { exportToCSV, exportToPDF, type ConsumptionReportData } from '@/lib/export-utils'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const CATEGORY_COLORS = {
  meals: 'oklch(0.646 0.222 41.116)',
  beverages: 'oklch(0.6 0.118 184.704)',
  'duty-free': 'oklch(0.398 0.07 227.392)',
  supplies: 'oklch(0.828 0.189 84.429)'
}

const PHASE_COLORS = {
  boarding: 'oklch(0.75 0.20 250)',
  taxi: 'oklch(0.70 0.15 230)',
  climb: 'oklch(0.65 0.18 200)',
  cruise: 'oklch(0.60 0.12 180)',
  descent: 'oklch(0.70 0.15 160)',
  landing: 'oklch(0.75 0.18 140)'
}

export default function AnalyticsView() {
  const [inventory] = useKV<InventoryItem[]>('inventory', [])
  const [consumptionData] = useKV<ConsumptionDataPoint[]>('consumption-data', [])
  const [flightInfo] = useKV<FlightInfo>('flight-info', {
    flightNumber: 'AB1234',
    departure: 'SIN',
    arrival: 'LHR',
    departureTime: '14:30',
    arrivalTime: '20:45',
    currentPhase: 'cruise'
  })
  const [isExporting, setIsExporting] = useState(false)

  const trends = useMemo(() => {
    if (!consumptionData || !inventory) return []
    return calculateTrends(consumptionData, inventory)
  }, [consumptionData, inventory])

  const categoryAnalytics = useMemo(() => {
    if (!consumptionData) return []
    return calculateCategoryAnalytics(consumptionData)
  }, [consumptionData])

  const phaseAnalytics = useMemo(() => {
    if (!consumptionData) return []
    return calculatePhaseAnalytics(consumptionData)
  }, [consumptionData])

  const insights = useMemo(() => {
    if (!trends || !inventory || !flightInfo) return []
    const remainingTime = 7200000
    return generatePredictiveInsights(trends, inventory, flightInfo.currentPhase, remainingTime)
  }, [trends, inventory, flightInfo])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'meals':
        return <ForkKnife className="w-4 h-4" weight="fill" />
      case 'beverages':
        return <Coffee className="w-4 h-4" weight="fill" />
      case 'duty-free':
        return <ShoppingCart className="w-4 h-4" weight="fill" />
      default:
        return <Package className="w-4 h-4" weight="fill" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-critical'
      case 'medium':
        return 'text-warning'
      default:
        return 'text-accent'
    }
  }

  const totalConsumption = consumptionData?.reduce((sum, d) => sum + d.quantity, 0) || 0

  const trendChartData = useMemo(() => {
    const topTrends = trends.slice(0, 5)
    const maxDataPoints = Math.max(...topTrends.map(t => t.dataPoints.length))
    
    return Array.from({ length: maxDataPoints }, (_, i) => {
      const point: any = { index: i }
      topTrends.forEach(trend => {
        if (trend.dataPoints[i]) {
          point[trend.itemName] = trend.dataPoints[i].quantity
        }
      })
      return point
    })
  }, [trends])

  const categoryPieData = categoryAnalytics.map(cat => ({
    name: cat.category,
    value: cat.totalConsumed
  }))

  const phaseBarData = phaseAnalytics.map(phase => ({
    name: phase.phase,
    consumed: phase.totalConsumed
  }))

  const hasData = consumptionData && consumptionData.length > 0

  const handleExportCSV = () => {
    if (!hasData) {
      toast.error('No data available to export')
      return
    }

    try {
      setIsExporting(true)
      const reportData: ConsumptionReportData = {
        flightInfo: flightInfo || {
          flightNumber: 'AB1234',
          departure: 'SIN',
          arrival: 'LHR',
          departureTime: '14:30',
          arrivalTime: '20:45',
          currentPhase: 'cruise'
        },
        generatedAt: Date.now(),
        consumptionData: consumptionData || [],
        trends,
        categoryAnalytics,
        phaseAnalytics,
        insights,
        inventory: inventory || []
      }
      
      exportToCSV(reportData)
      toast.success('CSV report downloaded successfully')
    } catch (error) {
      toast.error('Failed to export CSV report')
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPDF = async () => {
    if (!hasData) {
      toast.error('No data available to export')
      return
    }

    try {
      setIsExporting(true)
      const reportData: ConsumptionReportData = {
        flightInfo: flightInfo || {
          flightNumber: 'AB1234',
          departure: 'SIN',
          arrival: 'LHR',
          departureTime: '14:30',
          arrivalTime: '20:45',
          currentPhase: 'cruise'
        },
        generatedAt: Date.now(),
        consumptionData: consumptionData || [],
        trends,
        categoryAnalytics,
        phaseAnalytics,
        insights,
        inventory: inventory || []
      }
      
      await exportToPDF(reportData)
      toast.success('PDF report opened for printing')
    } catch (error) {
      toast.error('Failed to export PDF report')
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Consumption Analytics</h2>
          <p className="text-sm text-muted-foreground">Track usage patterns and optimize inventory</p>
        </div>
        {hasData && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <FileCsv className="w-4 h-4" weight="fill" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <FilePdf className="w-4 h-4" weight="fill" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
          </div>
        )}
      </div>

      {!hasData ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center max-w-md">
              <ChartBarHorizontal className="w-12 h-12 mx-auto mb-3 text-muted-foreground" weight="light" />
              <p className="text-sm text-muted-foreground mb-2">No consumption data available yet</p>
              <p className="text-xs text-muted-foreground">
                Enable the inventory simulator or manually adjust stock levels to start tracking consumption patterns
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Consumed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{totalConsumption}</div>
                <p className="text-xs text-muted-foreground mt-1">items tracked</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{categoryAnalytics.length}</div>
                <p className="text-xs text-muted-foreground mt-1">active categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Items Tracked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{trends.length}</div>
                <p className="text-xs text-muted-foreground mt-1">unique items</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Phase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold capitalize">{flightInfo?.currentPhase}</div>
                <p className="text-xs text-muted-foreground mt-1">flight status</p>
              </CardContent>
            </Card>
          </div>

          {insights.length > 0 && (
            <Card className="border-accent/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" weight="fill" />
                  <CardTitle>Predictive Insights</CardTitle>
                </div>
                <CardDescription>AI-powered recommendations based on consumption patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Warning className={`w-5 h-5 mt-0.5 ${getSeverityColor(insight.severity)}`} weight="fill" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{insight.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {insight.type}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getSeverityColor(insight.severity)}`}>
                          {insight.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="trends" className="space-y-4">
            <TabsList>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendUp className="w-4 h-4" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="phases" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Flight Phases
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Consumption Over Time</CardTitle>
                  <CardDescription>Cumulative consumption trends for top items</CardDescription>
                </CardHeader>
                <CardContent>
                  {trendChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trendChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 250)" />
                        <XAxis dataKey="index" stroke="oklch(0.50 0.02 250)" />
                        <YAxis stroke="oklch(0.50 0.02 250)" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'oklch(1 0 0)', 
                            border: '1px solid oklch(0.88 0.02 250)',
                            borderRadius: '0.5rem'
                          }} 
                        />
                        <Legend />
                        {trends.slice(0, 5).map((trend, idx) => (
                          <Line 
                            key={trend.itemId}
                            type="monotone" 
                            dataKey={trend.itemName}
                            stroke={Object.values(CATEGORY_COLORS)[idx % 4]}
                            strokeWidth={2}
                            dot={false}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                      No trend data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                {trends.slice(0, 6).map(trend => (
                  <Card key={trend.itemId}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{trend.itemName}</CardTitle>
                        <Badge variant="outline" className="capitalize">
                          {trend.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Consumed</span>
                        <span className="font-medium">{trend.totalConsumed} units</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Avg Rate</span>
                        <span className="font-medium">{formatRate(trend.averageRate)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Peak Phase</span>
                        <span className="font-medium capitalize">{trend.peakPhase}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                    <CardDescription>Consumption breakdown by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {categoryPieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={categoryPieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={(entry) => `${entry.name}: ${entry.value}`}
                          >
                            {categoryPieData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || 'oklch(0.5 0.1 200)'} 
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'oklch(1 0 0)', 
                              border: '1px solid oklch(0.88 0.02 250)',
                              borderRadius: '0.5rem'
                            }} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                        No category data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {categoryAnalytics.map(cat => (
                    <Card key={cat.category}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(cat.category)}
                          <CardTitle className="text-base capitalize">{cat.category}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Consumed</span>
                          <span className="font-medium">{cat.totalConsumed} units</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Items Tracked</span>
                          <span className="font-medium">{cat.itemsTracked}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avg Rate</span>
                          <span className="font-medium">{formatRate(cat.averageConsumptionRate)}</span>
                        </div>
                        {cat.topItems.length > 0 && (
                          <div className="pt-2 border-t">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Top Items</p>
                            <div className="space-y-1">
                              {cat.topItems.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="flex justify-between text-xs">
                                  <span>{item.name}</span>
                                  <span className="text-muted-foreground">{item.consumed}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="phases" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Consumption by Flight Phase</CardTitle>
                  <CardDescription>Usage patterns across different flight phases</CardDescription>
                </CardHeader>
                <CardContent>
                  {phaseBarData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={phaseBarData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 250)" />
                        <XAxis dataKey="name" stroke="oklch(0.50 0.02 250)" />
                        <YAxis stroke="oklch(0.50 0.02 250)" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'oklch(1 0 0)', 
                            border: '1px solid oklch(0.88 0.02 250)',
                            borderRadius: '0.5rem'
                          }} 
                        />
                        <Bar dataKey="consumed" fill="oklch(0.75 0.20 145)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                      No phase data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {phaseAnalytics.map(phase => (
                  <Card key={phase.phase}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base capitalize">{phase.phase}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Consumed</span>
                        <span className="font-medium">{phase.totalConsumed} units</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{Math.round(phase.duration / 60000)}m</span>
                      </div>
                      {phase.itemBreakdown.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Category Breakdown</p>
                          <div className="space-y-1">
                            {phase.itemBreakdown.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                  {getCategoryIcon(item.category)}
                                  <span className="capitalize">{item.category}</span>
                                </div>
                                <span className="text-muted-foreground">{item.consumed}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
