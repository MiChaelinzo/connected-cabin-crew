import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, FirstAid, Warning, Wrench, User, ShoppingBag, Package } from '@phosphor-icons/react'
import { sampleAlerts } from '@/lib/alert-utils'
import type { CabinAlert } from '@/lib/types'

export default function AlertTestPanel() {
  const [alerts, setAlerts] = useKV<CabinAlert[]>('cabin-alerts', [])

  const triggerAlert = (alertGenerator: () => CabinAlert) => {
    const newAlert = alertGenerator()
    setAlerts((current) => {
      const alerts = current || []
      return [newAlert, ...alerts]
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-accent" weight="fill" />
          <CardTitle>Alert System Demo</CardTitle>
        </div>
        <CardDescription>
          Trigger sample cabin alerts to test the real-time notification system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          <Button
            variant="outline"
            onClick={() => triggerAlert(sampleAlerts.criticalMedical)}
            className="justify-start"
          >
            <FirstAid className="w-4 h-4 mr-2 text-critical" weight="fill" />
            Medical Emergency
          </Button>

          <Button
            variant="outline"
            onClick={() => triggerAlert(sampleAlerts.criticalSafety)}
            className="justify-start"
          >
            <Warning className="w-4 h-4 mr-2 text-critical" weight="fill" />
            Safety Alert
          </Button>

          <Button
            variant="outline"
            onClick={() => triggerAlert(sampleAlerts.highEquipment)}
            className="justify-start"
          >
            <Wrench className="w-4 h-4 mr-2 text-destructive" weight="fill" />
            Equipment Issue
          </Button>

          <Button
            variant="outline"
            onClick={() => triggerAlert(sampleAlerts.highPassenger)}
            className="justify-start"
          >
            <User className="w-4 h-4 mr-2 text-destructive" weight="fill" />
            Passenger Issue
          </Button>

          <Button
            variant="outline"
            onClick={() => triggerAlert(sampleAlerts.highInventory)}
            className="justify-start"
          >
            <Package className="w-4 h-4 mr-2 text-destructive" weight="fill" />
            Out of Stock
          </Button>

          <Button
            variant="outline"
            onClick={() => triggerAlert(sampleAlerts.mediumInventory)}
            className="justify-start"
          >
            <Package className="w-4 h-4 mr-2 text-warning" weight="fill" />
            Low Inventory
          </Button>

          <Button
            variant="outline"
            onClick={() => triggerAlert(sampleAlerts.mediumService)}
            className="justify-start"
          >
            <ShoppingBag className="w-4 h-4 mr-2 text-warning" weight="fill" />
            Service Alert
          </Button>

          <Button
            variant="outline"
            onClick={() => triggerAlert(sampleAlerts.mediumPassenger)}
            className="justify-start"
          >
            <User className="w-4 h-4 mr-2 text-warning" weight="fill" />
            Connection Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
