export type SensorType = 
  | 'temperature'
  | 'smoke'
  | 'pressure'
  | 'oxygen'
  | 'seatbelt'
  | 'callButton'
  | 'lavatory'
  | 'door'
  | 'galley'
  | 'ife'

export type SensorStatus = 'normal' | 'warning' | 'critical' | 'offline'

export interface SensorReading {
  sensorId: string
  type: SensorType
  location: string
  zone: string
  status: SensorStatus
  value: number | boolean | string
  unit?: string
  threshold?: {
    warning?: number
    critical?: number
  }
  timestamp: number
}

export interface PassengerEvent {
  eventId: string
  type: 'callButton' | 'medicalAlert' | 'seatbeltViolation' | 'lavatoryOccupied' | 'specialRequest'
  seatNumber: string
  zone: string
  timestamp: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  details?: Record<string, any>
}

export function generateMockSensorData(): SensorReading[] {
  const zones = ['Zone A', 'Zone B', 'Zone C', 'Galley 1', 'Galley 2', 'AFT']
  const sensors: SensorReading[] = []

  zones.forEach((zone, idx) => {
    sensors.push({
      sensorId: `temp-${idx}`,
      type: 'temperature',
      location: zone,
      zone,
      status: 'normal',
      value: 21 + Math.random() * 3,
      unit: '°C',
      threshold: {
        warning: 26,
        critical: 30
      },
      timestamp: Date.now()
    })

    sensors.push({
      sensorId: `smoke-${idx}`,
      type: 'smoke',
      location: zone,
      zone,
      status: 'normal',
      value: false,
      timestamp: Date.now()
    })

    sensors.push({
      sensorId: `pressure-${idx}`,
      type: 'pressure',
      location: zone,
      zone,
      status: 'normal',
      value: 1013 + Math.random() * 10,
      unit: 'hPa',
      threshold: {
        warning: 900,
        critical: 850
      },
      timestamp: Date.now()
    })
  })

  return sensors
}

export function simulateSensorAnomaly(): SensorReading | null {
  const anomalyTypes = [
    {
      type: 'smoke' as SensorType,
      location: 'Rear Lavatory (AFT)',
      zone: 'AFT',
      status: 'critical' as SensorStatus,
      value: true,
      probability: 0.02
    },
    {
      type: 'temperature' as SensorType,
      location: 'Galley 2',
      zone: 'Galley 2',
      status: 'warning' as SensorStatus,
      value: 32,
      unit: '°C',
      probability: 0.05
    },
    {
      type: 'galley' as SensorType,
      location: 'Galley 3',
      zone: 'Galley 3',
      status: 'critical' as SensorStatus,
      value: 'oven-malfunction',
      probability: 0.03
    },
    {
      type: 'ife' as SensorType,
      location: 'Zone B - Rows 15-20',
      zone: 'Zone B',
      status: 'warning' as SensorStatus,
      value: 'system-offline',
      probability: 0.04
    },
    {
      type: 'pressure' as SensorType,
      location: 'Zone A',
      zone: 'Zone A',
      status: 'warning' as SensorStatus,
      value: 890,
      unit: 'hPa',
      probability: 0.01
    },
    {
      type: 'door' as SensorType,
      location: 'Emergency Exit 2L',
      zone: 'Zone B',
      status: 'warning' as SensorStatus,
      value: 'sensor-fault',
      probability: 0.02
    }
  ]

  for (const anomaly of anomalyTypes) {
    if (Math.random() < anomaly.probability) {
      return {
        sensorId: `${anomaly.type}-anomaly-${Date.now()}`,
        type: anomaly.type,
        location: anomaly.location,
        zone: anomaly.zone,
        status: anomaly.status,
        value: anomaly.value,
        unit: anomaly.unit,
        timestamp: Date.now()
      }
    }
  }

  return null
}

export function generatePassengerEvent(): PassengerEvent | null {
  const eventTypes = [
    {
      type: 'callButton' as const,
      seatNumber: '12A',
      zone: 'Zone A',
      priority: 'medium' as const,
      probability: 0.08
    },
    {
      type: 'callButton' as const,
      seatNumber: '23B',
      zone: 'Zone B',
      priority: 'medium' as const,
      probability: 0.08
    },
    {
      type: 'medicalAlert' as const,
      seatNumber: '18C',
      zone: 'Zone B',
      priority: 'critical' as const,
      details: { type: 'chest-pain', duration: 'ongoing' },
      probability: 0.01
    },
    {
      type: 'seatbeltViolation' as const,
      seatNumber: '17C',
      zone: 'Zone B',
      priority: 'high' as const,
      probability: 0.03
    },
    {
      type: 'specialRequest' as const,
      seatNumber: '8B',
      zone: 'Zone A',
      priority: 'low' as const,
      details: { request: 'special-meal-missing' },
      probability: 0.04
    }
  ]

  for (const event of eventTypes) {
    if (Math.random() < event.probability) {
      return {
        eventId: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: event.type,
        seatNumber: event.seatNumber,
        zone: event.zone,
        priority: event.priority,
        timestamp: Date.now(),
        details: event.details
      }
    }
  }

  return null
}
