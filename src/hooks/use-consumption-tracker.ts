import { useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import type { InventoryItem, FlightInfo } from '@/lib/types'
import type { ConsumptionDataPoint } from '@/lib/consumption-analytics'

const MAX_DATA_POINTS = 500

export function useConsumptionTracker() {
  const [inventory] = useKV<InventoryItem[]>('inventory', [])
  const [flightInfo] = useKV<FlightInfo>('flight-info', {
    flightNumber: 'AB1234',
    departure: 'SIN',
    arrival: 'LHR',
    departureTime: '14:30',
    arrivalTime: '20:45',
    currentPhase: 'cruise'
  })
  const [consumptionData, setConsumptionData] = useKV<ConsumptionDataPoint[]>('consumption-data', [])
  
  const previousInventoryRef = useRef<InventoryItem[]>([])

  useEffect(() => {
    if (!inventory || inventory.length === 0) {
      previousInventoryRef.current = []
      return
    }

    const previousInventory = previousInventoryRef.current
    
    if (previousInventory.length === 0) {
      previousInventoryRef.current = inventory
      return
    }

    const changes: ConsumptionDataPoint[] = []
    const currentPhase = flightInfo?.currentPhase || 'cruise'

    inventory.forEach(currentItem => {
      const previousItem = previousInventory.find(p => p.id === currentItem.id)
      
      if (previousItem && previousItem.current > currentItem.current) {
        const consumed = previousItem.current - currentItem.current
        
        changes.push({
          timestamp: Date.now(),
          itemId: currentItem.id,
          itemName: currentItem.name,
          category: currentItem.category,
          quantity: consumed,
          phase: currentPhase
        })
      }
    })

    if (changes.length > 0) {
      setConsumptionData(current => {
        const updated = [...(current || []), ...changes]
        return updated.slice(-MAX_DATA_POINTS)
      })
    }

    previousInventoryRef.current = inventory
  }, [inventory, flightInfo?.currentPhase, setConsumptionData])

  return consumptionData
}
