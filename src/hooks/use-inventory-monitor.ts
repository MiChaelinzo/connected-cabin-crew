import { useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import type { CabinAlert, InventoryItem } from '@/lib/types'

export function useInventoryMonitor() {
  const [inventory] = useKV<InventoryItem[]>('inventory', [])
  const [, setAlerts] = useKV<CabinAlert[]>('cabin-alerts', [])
  const previousInventoryRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    if (!inventory || inventory.length === 0) return

    const currentInventoryMap = new Map<string, number>()
    
    inventory.forEach(item => {
      currentInventoryMap.set(item.id, item.current)
      
      const previousQuantity = previousInventoryRef.current.get(item.id)
      const currentQuantity = item.current
      const percentRemaining = (currentQuantity / item.capacity) * 100
      const alertThresholdPercent = item.alertThreshold

      if (percentRemaining <= alertThresholdPercent) {
        const alertId = `alert-inventory-${item.id}-${Math.floor(percentRemaining)}`
        
        if (currentQuantity === 0) {
          const alert: CabinAlert = {
            id: alertId,
            category: 'service',
            priority: 'high',
            title: 'Item Out of Stock',
            message: `${item.name} is completely depleted.`,
            location: getCategoryLocation(item.category),
            timestamp: Date.now(),
            acknowledged: false,
            resolved: false,
            actionRequired: 'Inform crew to offer alternatives. Update replenishment list for next service.',
            relatedData: { 
              itemId: item.id,
              itemName: item.name,
              current: currentQuantity, 
              capacity: item.capacity, 
              category: item.category 
            }
          }

          setAlerts((currentAlerts) => {
            const alerts = currentAlerts || []
            const exists = alerts.some(a => a.relatedData?.itemId === item.id && a.priority === 'high')
            if (!exists) {
              return [...alerts, alert]
            }
            return alerts
          })
        } else if (percentRemaining <= alertThresholdPercent && previousQuantity !== undefined && previousQuantity > 0) {
          const crossedThreshold = previousQuantity > 0 && 
            ((previousQuantity / item.capacity) * 100) > alertThresholdPercent &&
            percentRemaining <= alertThresholdPercent

          if (crossedThreshold) {
            const alert: CabinAlert = {
              id: alertId,
              category: 'service',
              priority: 'medium',
              title: 'Low Inventory Alert',
              message: `${item.name} is running low. Only ${currentQuantity} ${item.unit} remaining (${Math.round(percentRemaining)}% capacity).`,
              location: getCategoryLocation(item.category),
              timestamp: Date.now(),
              acknowledged: false,
              resolved: false,
              actionRequired: 'Adjust service strategy. Note for replenishment at next station.',
              relatedData: { 
                itemId: item.id,
                itemName: item.name,
                current: currentQuantity, 
                capacity: item.capacity, 
                category: item.category,
                percentRemaining: Math.round(percentRemaining)
              }
            }

            setAlerts((currentAlerts) => {
              const alerts = currentAlerts || []
              const exists = alerts.some(a => 
                a.relatedData?.itemId === item.id && 
                !a.acknowledged
              )
              if (!exists) {
                return [...alerts, alert]
              }
              return alerts
            })
          }
        }
      }
    })

    previousInventoryRef.current = currentInventoryMap
  }, [inventory, setAlerts])
}

function getCategoryLocation(category: string): string {
  switch (category) {
    case 'meals':
    case 'beverages':
      return 'Galley'
    case 'duty-free':
      return 'Service Cart'
    case 'supplies':
      return 'Supply Storage'
    default:
      return 'Cabin'
  }
}
