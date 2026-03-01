import type { CabinAlert, AlertPriority, AlertCategory } from '@/lib/types'
import type { SensorReading, PassengerEvent, SensorStatus } from '@/lib/sensor-data'

export function generateAlertFromSensor(sensor: SensorReading): CabinAlert | null {
  if (sensor.status === 'normal') {
    return null
  }

  switch (sensor.type) {
    case 'smoke':
      if (sensor.value === true) {
        return {
          id: `alert-${sensor.sensorId}-${Date.now()}`,
          category: 'safety',
          priority: 'critical',
          title: 'Smoke Detected',
          message: `Smoke alarm triggered in ${sensor.location}. Potential fire hazard detected.`,
          location: sensor.location,
          timestamp: Date.now(),
          acknowledged: false,
          resolved: false,
          actionRequired: 'Investigate immediately with fire extinguisher. Notify flight deck.',
          relatedData: { sensorId: sensor.sensorId, sensorType: sensor.type }
        }
      }
      break

    case 'temperature':
      if (typeof sensor.value === 'number') {
        if (sensor.status === 'critical') {
          return {
            id: `alert-${sensor.sensorId}-${Date.now()}`,
            category: 'safety',
            priority: 'high',
            title: 'Critical Temperature',
            message: `Temperature in ${sensor.location} has reached ${sensor.value.toFixed(1)}${sensor.unit || '°C'}. Equipment may be at risk.`,
            location: sensor.location,
            timestamp: Date.now(),
            acknowledged: false,
            resolved: false,
            actionRequired: 'Check for equipment malfunction. Adjust climate controls.',
            relatedData: { sensorId: sensor.sensorId, value: sensor.value }
          }
        } else if (sensor.status === 'warning') {
          return {
            id: `alert-${sensor.sensorId}-${Date.now()}`,
            category: 'equipment',
            priority: 'medium',
            title: 'Temperature Warning',
            message: `Temperature in ${sensor.location} is elevated at ${sensor.value.toFixed(1)}${sensor.unit || '°C'}.`,
            location: sensor.location,
            timestamp: Date.now(),
            acknowledged: false,
            resolved: false,
            actionRequired: 'Monitor situation and adjust climate controls if needed.',
            relatedData: { sensorId: sensor.sensorId, value: sensor.value }
          }
        }
      }
      break

    case 'pressure':
      if (typeof sensor.value === 'number' && sensor.status === 'critical') {
        return {
          id: `alert-${sensor.sensorId}-${Date.now()}`,
          category: 'safety',
          priority: 'critical',
          title: 'Cabin Pressure Alert',
          message: `Abnormal pressure reading in ${sensor.location}: ${sensor.value.toFixed(0)}${sensor.unit || 'hPa'}`,
          location: sensor.location,
          timestamp: Date.now(),
          acknowledged: false,
          resolved: false,
          actionRequired: 'Notify flight deck immediately. Prepare oxygen masks.',
          relatedData: { sensorId: sensor.sensorId, value: sensor.value }
        }
      }
      break

    case 'galley':
      if (sensor.value === 'oven-malfunction') {
        return {
          id: `alert-${sensor.sensorId}-${Date.now()}`,
          category: 'equipment',
          priority: 'high',
          title: 'Galley Equipment Malfunction',
          message: `Oven malfunction detected in ${sensor.location}. Unable to heat meal service items.`,
          location: sensor.location,
          timestamp: Date.now(),
          acknowledged: false,
          resolved: false,
          actionRequired: 'Adjust meal service plan and notify catering for next leg.',
          relatedData: { sensorId: sensor.sensorId, equipment: 'oven' }
        }
      }
      break

    case 'ife':
      if (sensor.value === 'system-offline') {
        return {
          id: `alert-${sensor.sensorId}-${Date.now()}`,
          category: 'equipment',
          priority: 'medium',
          title: 'IFE System Error',
          message: `In-flight entertainment system offline in ${sensor.location}.`,
          location: sensor.location,
          timestamp: Date.now(),
          acknowledged: false,
          resolved: false,
          actionRequired: 'Reset system. Offer compensation if issue persists.',
          relatedData: { sensorId: sensor.sensorId, system: 'ife' }
        }
      }
      break

    case 'door':
      if (sensor.value === 'sensor-fault') {
        return {
          id: `alert-${sensor.sensorId}-${Date.now()}`,
          category: 'safety',
          priority: 'high',
          title: 'Door Sensor Warning',
          message: `Door sensor fault detected at ${sensor.location}.`,
          location: sensor.location,
          timestamp: Date.now(),
          acknowledged: false,
          resolved: false,
          actionRequired: 'Visually inspect door. Notify maintenance.',
          relatedData: { sensorId: sensor.sensorId, door: sensor.location }
        }
      }
      break

    case 'oxygen':
      if (sensor.status === 'critical') {
        return {
          id: `alert-${sensor.sensorId}-${Date.now()}`,
          category: 'safety',
          priority: 'critical',
          title: 'Oxygen System Alert',
          message: `Oxygen system issue detected in ${sensor.location}.`,
          location: sensor.location,
          timestamp: Date.now(),
          acknowledged: false,
          resolved: false,
          actionRequired: 'Check oxygen system. Notify flight deck.',
          relatedData: { sensorId: sensor.sensorId }
        }
      }
      break
  }

  return null
}

export function generateAlertFromPassengerEvent(event: PassengerEvent): CabinAlert | null {
  switch (event.type) {
    case 'medicalAlert':
      return {
        id: `alert-${event.eventId}`,
        category: 'medical',
        priority: 'critical',
        title: 'Medical Emergency',
        message: `Passenger in seat ${event.seatNumber} requires medical attention. ${event.details?.type ? `Reported: ${event.details.type}` : ''}`,
        location: `Seat ${event.seatNumber} - ${event.zone}`,
        timestamp: event.timestamp,
        acknowledged: false,
        resolved: false,
        actionRequired: 'Assess passenger condition. Administer first aid. Check for medical professionals on board.',
        relatedData: event.details
      }

    case 'callButton':
      return {
        id: `alert-${event.eventId}`,
        category: 'service',
        priority: 'medium',
        title: 'Passenger Call',
        message: `Passenger in seat ${event.seatNumber} has requested assistance.`,
        location: `Seat ${event.seatNumber} - ${event.zone}`,
        timestamp: event.timestamp,
        acknowledged: false,
        resolved: false,
        relatedData: event.details
      }

    case 'seatbeltViolation':
      return {
        id: `alert-${event.eventId}`,
        category: 'passenger',
        priority: 'high',
        title: 'Seatbelt Compliance Issue',
        message: `Passenger in seat ${event.seatNumber} not complying with seatbelt sign.`,
        location: `Seat ${event.seatNumber} - ${event.zone}`,
        timestamp: event.timestamp,
        acknowledged: false,
        resolved: false,
        actionRequired: 'Remind passenger to fasten seatbelt. Issue verbal warning if needed.',
        relatedData: event.details
      }

    case 'specialRequest':
      if (event.details?.request === 'special-meal-missing') {
        return {
          id: `alert-${event.eventId}`,
          category: 'service',
          priority: 'medium',
          title: 'Special Meal Request',
          message: `Special meal not available for passenger in seat ${event.seatNumber}.`,
          location: `Seat ${event.seatNumber} - ${event.zone}`,
          timestamp: event.timestamp,
          acknowledged: false,
          resolved: false,
          actionRequired: 'Offer alternative meal options and apologize for inconvenience.',
          relatedData: event.details
        }
      }
      return {
        id: `alert-${event.eventId}`,
        category: 'service',
        priority: 'low',
        title: 'Passenger Request',
        message: `Special request from passenger in seat ${event.seatNumber}.`,
        location: `Seat ${event.seatNumber} - ${event.zone}`,
        timestamp: event.timestamp,
        acknowledged: false,
        resolved: false,
        relatedData: event.details
      }

    case 'lavatoryOccupied':
      return null

    default:
      return null
  }
}

export function shouldGenerateInventoryAlert(
  itemName: string,
  current: number,
  capacity: number,
  category: string
): CabinAlert | null {
  const percentRemaining = (current / capacity) * 100

  if (percentRemaining <= 10 && current > 0) {
    return {
      id: `alert-inventory-${itemName}-${Date.now()}`,
      category: 'service',
      priority: 'medium',
      title: 'Low Inventory Alert',
      message: `${itemName} is running low. Only ${current} ${category === 'beverages' || category === 'meals' ? 'units' : 'items'} remaining.`,
      location: category === 'meals' || category === 'beverages' ? 'Galley' : 'Service Cart',
      timestamp: Date.now(),
      acknowledged: false,
      resolved: false,
      actionRequired: 'Adjust service strategy. Note for replenishment at next station.',
      relatedData: { itemName, current, capacity, category }
    }
  } else if (percentRemaining === 0) {
    return {
      id: `alert-inventory-${itemName}-${Date.now()}`,
      category: 'service',
      priority: 'high',
      title: 'Item Out of Stock',
      message: `${itemName} is completely out of stock.`,
      location: category === 'meals' || category === 'beverages' ? 'Galley' : 'Service Cart',
      timestamp: Date.now(),
      acknowledged: false,
      resolved: false,
      actionRequired: 'Inform crew to offer alternatives. Update replenishment list.',
      relatedData: { itemName, current, capacity, category }
    }
  }

  return null
}
