import { useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import type { InventoryItem, FlightInfo } from '@/lib/types'

const CONSUMPTION_INTERVAL = 15000
const BOARDING_CONSUMPTION_RATE = 0.3
const CLIMB_CONSUMPTION_RATE = 1.2
const CRUISE_CONSUMPTION_RATE = 0.8
const DESCENT_CONSUMPTION_RATE = 0.6

type ConsumptionPattern = {
  category: 'meals' | 'beverages' | 'duty-free' | 'supplies'
  minConsumption: number
  maxConsumption: number
  probability: number
}

const CONSUMPTION_PATTERNS: Record<string, ConsumptionPattern[]> = {
  boarding: [
    { category: 'beverages', minConsumption: 0, maxConsumption: 2, probability: 0.3 },
    { category: 'supplies', minConsumption: 0, maxConsumption: 1, probability: 0.4 },
  ],
  taxi: [
    { category: 'beverages', minConsumption: 0, maxConsumption: 1, probability: 0.2 },
  ],
  climb: [
    { category: 'beverages', minConsumption: 1, maxConsumption: 4, probability: 0.9 },
    { category: 'supplies', minConsumption: 1, maxConsumption: 2, probability: 0.7 },
  ],
  cruise: [
    { category: 'meals', minConsumption: 1, maxConsumption: 3, probability: 0.8 },
    { category: 'beverages', minConsumption: 1, maxConsumption: 5, probability: 0.95 },
    { category: 'duty-free', minConsumption: 0, maxConsumption: 1, probability: 0.15 },
    { category: 'supplies', minConsumption: 0, maxConsumption: 2, probability: 0.6 },
  ],
  descent: [
    { category: 'beverages', minConsumption: 0, maxConsumption: 3, probability: 0.6 },
    { category: 'supplies', minConsumption: 1, maxConsumption: 2, probability: 0.5 },
  ],
  landing: [
    { category: 'supplies', minConsumption: 0, maxConsumption: 1, probability: 0.3 },
  ],
}

function getConsumptionMultiplier(phase: string): number {
  switch (phase) {
    case 'boarding':
      return BOARDING_CONSUMPTION_RATE
    case 'climb':
      return CLIMB_CONSUMPTION_RATE
    case 'cruise':
      return CRUISE_CONSUMPTION_RATE
    case 'descent':
      return DESCENT_CONSUMPTION_RATE
    default:
      return 0.5
  }
}

function calculateConsumption(
  item: InventoryItem,
  phase: string,
  multiplier: number
): number {
  const patterns = CONSUMPTION_PATTERNS[phase] || []
  const matchingPattern = patterns.find(p => p.category === item.category)
  
  if (!matchingPattern) return 0
  
  if (Math.random() > matchingPattern.probability) return 0
  
  const baseConsumption = 
    matchingPattern.minConsumption + 
    Math.random() * (matchingPattern.maxConsumption - matchingPattern.minConsumption)
  
  const consumption = Math.floor(baseConsumption * multiplier)
  
  return Math.min(consumption, item.current)
}

export function useFlightConsumptionSimulator(enabled: boolean = true) {
  const [inventory, setInventory] = useKV<InventoryItem[]>('inventory', [])
  const [flightInfo] = useKV<FlightInfo>('flight-info', {
    flightNumber: 'AB1234',
    departure: 'SIN',
    arrival: 'LHR',
    departureTime: '14:30',
    arrivalTime: '20:45',
    currentPhase: 'cruise'
  })
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastPhaseRef = useRef<string>('')

  useEffect(() => {
    if (!enabled || !inventory || inventory.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const phase = flightInfo?.currentPhase || 'cruise'
    
    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase
      console.log(`Flight phase changed to: ${phase}`)
    }

    intervalRef.current = setInterval(() => {
      const currentPhase = flightInfo?.currentPhase || 'cruise'
      const multiplier = getConsumptionMultiplier(currentPhase)

      setInventory((current) => {
        const items = current || []
        
        return items.map(item => {
          const consumption = calculateConsumption(item, currentPhase, multiplier)
          
          if (consumption > 0) {
            const newCurrent = Math.max(0, item.current - consumption)
            console.log(
              `[${currentPhase}] ${item.name}: ${item.current} → ${newCurrent} (-${consumption} ${item.unit})`
            )
            return { ...item, current: newCurrent }
          }
          
          return item
        })
      })
    }, CONSUMPTION_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [enabled, inventory?.length, flightInfo?.currentPhase, setInventory])
}
