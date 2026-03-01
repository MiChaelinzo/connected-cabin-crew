import { useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { audioManager } from '@/lib/audio'
import { toast } from 'sonner'
import type { CabinAlert, AlertPriority } from '@/lib/types'

export function useAlertMonitor() {
  const [alerts] = useKV<CabinAlert[]>('cabin-alerts', [])
  const previousAlertsRef = useRef<CabinAlert[]>([])

  useEffect(() => {
    if (!alerts) return

    const previousAlerts = previousAlertsRef.current
    const newAlerts = alerts.filter(
      alert => !previousAlerts.some(prev => prev.id === alert.id)
    )

    newAlerts.forEach(alert => {
      const soundType = getPrioritySoundType(alert.priority)
      audioManager.playAlertSound(soundType)
      
      showToastNotification(alert)
    })

    previousAlertsRef.current = alerts
  }, [alerts])
}

function getPrioritySoundType(priority: AlertPriority): 'critical' | 'warning' | 'info' | 'success' {
  switch (priority) {
    case 'critical':
      return 'critical'
    case 'high':
      return 'warning'
    case 'medium':
      return 'warning'
    default:
      return 'info'
  }
}

function showToastNotification(alert: CabinAlert) {
  const duration = alert.priority === 'critical' ? 10000 : alert.priority === 'high' ? 7000 : 5000
  
  const description = alert.location 
    ? `${alert.message} (${alert.location})`
    : alert.message

  switch (alert.priority) {
    case 'critical':
      toast.error(alert.title, {
        description,
        duration,
      })
      break
    case 'high':
      toast.error(alert.title, {
        description,
        duration,
      })
      break
    case 'medium':
      toast.warning(alert.title, {
        description,
        duration,
      })
      break
    default:
      toast.info(alert.title, {
        description,
        duration,
      })
      break
  }
}
