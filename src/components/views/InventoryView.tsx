import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Package, ForkKnife, Coffee, ShoppingCart, WarningCircle, TrendUp, Plus, Minus } from '@phosphor-icons/react'
import type { InventoryItem } from '@/lib/types'
import ConsumptionSimulatorControls from '@/components/ConsumptionSimulatorControls'
import { useFlightConsumptionSimulator } from '@/hooks/use-flight-consumption-simulator'

export default function InventoryView() {
  const [inventory, setInventory] = useKV<InventoryItem[]>('inventory', [])
  const [simulationEnabled, setSimulationEnabled] = useState(false)
  
  useFlightConsumptionSimulator(simulationEnabled)

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

  const adjustStock = (itemId: string, amount: number) => {
    setInventory((current) => {
      const items = current || []
      return items.map(item => {
        if (item.id === itemId) {
          const newCurrent = Math.max(0, Math.min(item.capacity, item.current + amount))
          return { ...item, current: newCurrent }
        }
        return item
      })
    })
  }

  const initializeSampleInventory = () => {
    const sampleItems: InventoryItem[] = [
      { id: 'meal-chicken', category: 'meals', name: 'Chicken Meal', current: 45, capacity: 60, unit: 'units', alertThreshold: 15, predicted: 52 },
      { id: 'meal-vegetarian', category: 'meals', name: 'Vegetarian Meal', current: 18, capacity: 25, unit: 'units', alertThreshold: 15, predicted: 22 },
      { id: 'meal-fish', category: 'meals', name: 'Fish Meal', current: 22, capacity: 30, unit: 'units', alertThreshold: 15, predicted: 28 },
      { id: 'bev-water', category: 'beverages', name: 'Bottled Water', current: 85, capacity: 120, unit: 'bottles', alertThreshold: 20, predicted: 110 },
      { id: 'bev-juice-orange', category: 'beverages', name: 'Orange Juice', current: 8, capacity: 60, unit: 'cans', alertThreshold: 15, predicted: 45 },
      { id: 'bev-coffee', category: 'beverages', name: 'Coffee', current: 42, capacity: 50, unit: 'servings', alertThreshold: 15, predicted: 48 },
      { id: 'bev-tea', category: 'beverages', name: 'Tea', current: 35, capacity: 40, unit: 'bags', alertThreshold: 15, predicted: 38 },
      { id: 'duty-perfume', category: 'duty-free', name: 'Perfume Set', current: 8, capacity: 12, unit: 'items', alertThreshold: 20, predicted: 10 },
      { id: 'duty-chocolate', category: 'duty-free', name: 'Chocolate Box', current: 15, capacity: 20, unit: 'items', alertThreshold: 20, predicted: 18 },
      { id: 'supply-blankets', category: 'supplies', name: 'Blankets', current: 55, capacity: 80, unit: 'items', alertThreshold: 25, predicted: 70 },
      { id: 'supply-pillows', category: 'supplies', name: 'Pillows', current: 48, capacity: 60, unit: 'items', alertThreshold: 25, predicted: 55 },
    ]
    setInventory(sampleItems)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Inventory Management</h2>
            <p className="text-sm text-muted-foreground">Real-time stock levels and consumption tracking</p>
          </div>
          {(!inventory || inventory.length === 0) && (
            <Button onClick={initializeSampleInventory}>
              Load Sample Data
            </Button>
          )}
        </div>
      </div>

      <ConsumptionSimulatorControls 
        simulationEnabled={simulationEnabled}
        onToggleSimulation={setSimulationEnabled}
      />

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
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Occupancy</span>
                        <span className="font-medium">
                          {item.current}/{item.capacity}
                        </span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2"
                      />
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adjustStock(item.id, -1)}
                          disabled={item.current === 0}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adjustStock(item.id, -5)}
                          disabled={item.current < 5}
                          className="h-8 flex-1 text-xs"
                        >
                          -5
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adjustStock(item.id, 5)}
                          disabled={item.current >= item.capacity}
                          className="h-8 flex-1 text-xs"
                        >
                          +5
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adjustStock(item.id, 1)}
                          disabled={item.current >= item.capacity}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
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
