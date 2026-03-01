import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Package, ForkKnife, Coffee, ShoppingCart, WarningCircle, TrendUp } from '@phosphor-icons/react'
import type { InventoryItem } from '@/lib/types'

export default function InventoryView() {
  const [inventory] = useKV<InventoryItem[]>('inventory', [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'meals':
        return <ForkKnife className="w-5 h-5" weight="fill" />
      case 'beverages':
        return <Coffee className="w-5 h-5" weight="fill" />
      case 'duty-free':
        return <ShoppingCart className="w-5 h-5" weight="fill" />
      default:
        return <Package className="w-5 h-5" weight="fill" />
    }
  }

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.current / item.capacity) * 100
    if (percentage <= item.alertThreshold) return 'critical'
    if (percentage <= item.alertThreshold * 1.5) return 'warning'
    return 'normal'
  }

  const getStockColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-critical'
      case 'warning':
        return 'text-warning'
      default:
        return 'text-success'
    }
  }

  const groupedInventory = inventory?.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, InventoryItem[]>) || {}

  const categories = Object.keys(groupedInventory)
  const lowStockCount = inventory?.filter(item => getStockStatus(item) === 'critical').length || 0

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Inventory Management</h2>
        <p className="text-sm text-muted-foreground">Real-time stock levels and consumption tracking</p>
      </div>

      {lowStockCount > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="flex items-center gap-3 p-4">
            <WarningCircle className="w-6 h-6 text-warning" weight="fill" />
            <div>
              <p className="font-medium text-warning">Low Stock Alert</p>
              <p className="text-sm text-muted-foreground">
                {lowStockCount} item{lowStockCount > 1 ? 's' : ''} running low
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {categories.length > 0 ? (
        categories.map((category) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              {getCategoryIcon(category)}
              <h3 className="text-lg font-semibold capitalize">{category}</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groupedInventory[category].map((item) => {
                const status = getStockStatus(item)
                const percentage = (item.current / item.capacity) * 100
                
                return (
                  <Card key={item.id} className={status === 'critical' ? 'border-critical/50' : status === 'warning' ? 'border-warning/50' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        <Badge variant="outline" className={getStockColor(status)}>
                          {status === 'critical' ? 'Low' : status === 'warning' ? 'Medium' : 'Good'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className={`text-2xl font-semibold ${getStockColor(status)}`}>
                          {item.current}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          of {item.capacity} {item.unit}
                        </span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2"
                      />
                      {item.predicted !== undefined && (
                        <div className="flex items-center gap-2 pt-2 text-sm border-t">
                          <TrendUp className="w-4 h-4 text-accent" />
                          <span className="text-muted-foreground">
                            Predicted: {item.predicted} {item.unit} needed
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground" weight="light" />
              <p className="text-sm text-muted-foreground">No inventory data available</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
