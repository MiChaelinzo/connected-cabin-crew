import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Bell, BellRinging, X, Check, BellSlash, SpeakerHigh, SpeakerSlash, Warning, FirstAid, Wrench, User, ShoppingBag, Info } from '@phosphor-icons/react'
import { audioManager } from '@/lib/audio'
import type { CabinAlert } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'

export default function AlertCenter() {
  const [alerts, setAlerts] = useKV<CabinAlert[]>('cabin-alerts', [])
  const [open, setOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const unacknowledgedAlerts = alerts?.filter(a => !a.acknowledged) || []
  const criticalAlerts = unacknowledgedAlerts.filter(a => a.priority === 'critical')
  const hasUnacknowledged = unacknowledgedAlerts.length > 0
  const hasCritical = criticalAlerts.length > 0

  useEffect(() => {
    audioManager.setMuted(!soundEnabled)
  }, [soundEnabled])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safety':
        return <Warning className="w-5 h-5" weight="fill" />
      case 'medical':
        return <FirstAid className="w-5 h-5" weight="fill" />
      case 'equipment':
        return <Wrench className="w-5 h-5" weight="fill" />
      case 'passenger':
        return <User className="w-5 h-5" weight="fill" />
      case 'service':
        return <ShoppingBag className="w-5 h-5" weight="fill" />
      default:
        return <Info className="w-5 h-5" weight="fill" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-critical'
      case 'high':
        return 'text-destructive'
      case 'medium':
        return 'text-warning'
      default:
        return 'text-muted-foreground'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-critical/10 text-critical border-critical/20'
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((current) => {
      const alerts = current || []
      return alerts.map(a => 
        a.id === alertId 
          ? { ...a, acknowledged: true, acknowledgedAt: Date.now(), acknowledgedBy: 'Current User' }
          : a
      )
    })
  }

  const acknowledgeAll = () => {
    setAlerts((current) => {
      const alerts = current || []
      return alerts.map(a => 
        !a.acknowledged
          ? { ...a, acknowledged: true, acknowledgedAt: Date.now(), acknowledgedBy: 'Current User' }
          : a
      )
    })
  }

  const dismissAlert = (alertId: string) => {
    setAlerts((current) => {
      const alerts = current || []
      return alerts.filter(a => a.id !== alertId)
    })
  }

  const clearAll = () => {
    setAlerts((current) => {
      const alerts = current || []
      return alerts.filter(a => !a.acknowledged)
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative ${hasCritical ? 'animate-pulse' : ''}`}
        >
          {hasCritical ? (
            <BellRinging className="w-6 h-6 text-critical" weight="fill" />
          ) : hasUnacknowledged ? (
            <BellRinging className="w-6 h-6" weight="fill" />
          ) : (
            <Bell className="w-6 h-6" weight="fill" />
          )}
          
          <AnimatePresence>
            {hasUnacknowledged && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full ${hasCritical ? 'bg-critical' : 'bg-accent'} text-white`}
              >
                {unacknowledgedAlerts.length > 9 ? '9+' : unacknowledgedAlerts.length}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Alerts</h3>
            {hasUnacknowledged && (
              <Badge variant="outline" className={getPriorityBadge(hasCritical ? 'critical' : 'medium')}>
                {unacknowledgedAlerts.length} new
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? (
                <SpeakerHigh className="w-5 h-5" weight="fill" />
              ) : (
                <SpeakerSlash className="w-5 h-5" weight="fill" />
              )}
            </Button>
          </div>
        </div>

        {alerts && alerts.length > 0 ? (
          <>
            {hasUnacknowledged && (
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acknowledgeAll}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Acknowledge All
                </Button>
              </div>
            )}

            <ScrollArea className="h-96">
              <div className="p-2 space-y-2">
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className={`relative ${!alert.acknowledged ? 'border-l-4' : ''} ${alert.priority === 'critical' ? 'border-l-critical' : alert.priority === 'high' ? 'border-l-destructive' : alert.priority === 'medium' ? 'border-l-warning' : ''}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <div className={getPriorityColor(alert.priority)}>
                              {getCategoryIcon(alert.category)}
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-sm font-semibold">
                                {alert.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={getPriorityBadge(alert.priority)}>
                                  {alert.priority}
                                </Badge>
                                {alert.location && (
                                  <span className="text-xs text-muted-foreground">
                                    {alert.location}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => dismissAlert(alert.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0 pb-3">
                        <p className="text-sm text-foreground mb-2">{alert.message}</p>
                        
                        {alert.actionRequired && (
                          <div className="p-2 mb-2 text-xs rounded bg-accent/10 text-accent-foreground">
                            <strong>Action Required:</strong> {alert.actionRequired}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                          </span>

                          {!alert.acknowledged ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => acknowledgeAlert(alert.id)}
                              className="h-7 text-xs"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Acknowledge
                            </Button>
                          ) : (
                            <span className="text-xs text-success">
                              ✓ Acknowledged
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {alerts.some(a => a.acknowledged) && (
              <div className="p-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="w-full"
                >
                  Clear Acknowledged
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <BellSlash className="w-12 h-12 mb-3 text-muted-foreground" weight="fill" />
            <p className="text-sm font-medium text-muted-foreground">No alerts</p>
            <p className="text-xs text-muted-foreground">All clear in the cabin</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
