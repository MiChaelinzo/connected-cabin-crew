import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Passenger, CabinZone } from '@/lib/types'

export function useInitializeData() {
  const [passengers, setPassengers] = useKV<Passenger[]>('passengers', [])
  const [cabinZones, setCabinZones] = useKV<CabinZone[]>('cabin-zones', [])

  useEffect(() => {
    if (!passengers || passengers.length === 0) {
      const samplePassengers: Passenger[] = [
        {
          id: 'pass-001',
          name: 'Sarah Johnson',
          seatNumber: '1A',
          tier: 'first',
          specialNeeds: ['Wheelchair assistance'],
          dietaryRequirements: ['Vegetarian'],
          preferences: {
            beverage: 'Champagne',
            meal: 'Vegetarian option'
          }
        },
        {
          id: 'pass-002',
          name: 'Michael Chen',
          seatNumber: '2B',
          tier: 'business',
          dietaryRequirements: ['Gluten-free'],
          preferences: {
            beverage: 'Green tea',
            meal: 'Asian cuisine'
          }
        },
        {
          id: 'pass-003',
          name: 'Emma Williams',
          seatNumber: '3C',
          tier: 'business',
          specialNeeds: ['Traveling with infant'],
          preferences: {
            beverage: 'Water',
            meal: 'Fish option'
          }
        },
        {
          id: 'pass-004',
          name: 'David Martinez',
          seatNumber: '12A',
          tier: 'premium',
          connectingFlight: {
            flightNumber: 'BA456',
            departure: 'JFK',
            gate: 'B24',
            boardingTime: '21:15'
          },
          preferences: {
            beverage: 'Coffee',
            meal: 'Chicken'
          }
        },
        {
          id: 'pass-005',
          name: 'Olivia Brown',
          seatNumber: '15D',
          tier: 'economy',
          dietaryRequirements: ['Vegan'],
          preferences: {
            beverage: 'Orange juice'
          }
        },
        {
          id: 'pass-006',
          name: 'James Wilson',
          seatNumber: '18F',
          tier: 'economy',
          specialNeeds: ['Extra legroom'],
          preferences: {
            beverage: 'Cola',
            meal: 'Beef option'
          }
        },
        {
          id: 'pass-007',
          name: 'Sophia Anderson',
          seatNumber: '22C',
          tier: 'economy',
          connectingFlight: {
            flightNumber: 'LH789',
            departure: 'FRA',
            gate: 'A12',
            boardingTime: '20:45'
          }
        },
        {
          id: 'pass-008',
          name: 'Liam Taylor',
          seatNumber: '25A',
          tier: 'economy',
          preferences: {
            beverage: 'Beer',
            meal: 'Pasta'
          }
        }
      ]
      setPassengers(samplePassengers)
    }

    if (!cabinZones || cabinZones.length === 0) {
      const sampleZones: CabinZone[] = [
        {
          id: 'zone-1',
          name: 'First Class',
          status: 'normal',
          seatRange: '1A-2F',
          occupancy: 8,
          capacity: 12,
          issues: 0,
          lastUpdated: Date.now()
        },
        {
          id: 'zone-2',
          name: 'Business Class',
          status: 'normal',
          seatRange: '3A-10F',
          occupancy: 28,
          capacity: 32,
          issues: 0,
          lastUpdated: Date.now()
        },
        {
          id: 'zone-3',
          name: 'Premium Economy',
          status: 'normal',
          seatRange: '11A-15F',
          occupancy: 24,
          capacity: 30,
          issues: 0,
          lastUpdated: Date.now()
        },
        {
          id: 'zone-4',
          name: 'Economy',
          status: 'normal',
          seatRange: '16A-35F',
          occupancy: 95,
          capacity: 120,
          issues: 0,
          lastUpdated: Date.now()
        }
      ]
      setCabinZones(sampleZones)
    }
  }, [passengers, setPassengers, cabinZones, setCabinZones])
}
