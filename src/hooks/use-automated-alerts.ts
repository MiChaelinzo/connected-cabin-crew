import { useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import type { CabinAlert } from '@/lib/types'
import { simulateSensorAnomaly, generatePassengerEvent } from '@/lib/sensor-data'
import { generateAlertFromSensor, generateAlertFromPassengerEvent } from '@/lib/alert-generator'

export function useAutomatedAlerts() {
  const [, setAlerts] = useKV<CabinAlert[]>('cabin-alerts', [])
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const checkForAnomalies = () => {
      const sensorAnomaly = simulateSensorAnomaly()
      if (sensorAnomaly) {
        const alert = generateAlertFromSensor(sensorAnomaly)
        if (alert) {
          setAlerts((currentAlerts) => {
            const alerts = currentAlerts || []
            const exists = alerts.some(a => a.id === alert.id)
            if (!exists) {
              return [...alerts, alert]
            }
            return alerts
          })
        }
      }

      const passengerEvent = generatePassengerEvent()
      if (passengerEvent) {
        const alert = generateAlertFromPassengerEvent(passengerEvent)
        if (alert) {
          setAlerts((currentAlerts) => {
            const alerts = currentAlerts || []
            const exists = alerts.some(a => a.id === alert.id)
            if (!exists) {
              return [...alerts, alert]
            }
            return alerts
          })
        }
      }
    }

    intervalRef.current = window.setInterval(checkForAnomalies, 8000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [setAlerts])
}
