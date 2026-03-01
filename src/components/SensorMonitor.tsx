import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Thermometer, Flame, ChartLine, Drop, Power, Monitor } from '@phosphor-icons/react'
import { generateMockSensorData } from '@/lib/sensor-data'
import type { SensorReading } from '@/lib/sensor-data'

export default function SensorMonitor() {
  const [sensorData, setSensorData] = useState<SensorReading[]>([])

  useEffect(() => {
    const updateSensors = () => {
      setSensorData(generateMockSensorData())
    }

    updateSensors()
    const interval = setInterval(updateSensors, 10000)

    return () => clearInterval(interval)
  }, [])

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="w-5 h-5" weight="fill" />
      case 'smoke':
        return <Flame className="w-5 h-5" weight="fill" />
      case 'pressure':
        return <ChartLine className="w-5 h-5" weight="fill" />
      case 'oxygen':
        return <Drop className="w-5 h-5" weight="fill" />
      case 'galley':
        return <Power className="w-5 h-5" weight="fill" />
      case 'ife':
        return <Monitor className="w-5 h-5" weight="fill" />
      default:
        return <ChartLine className="w-5 h-5" weight="fill" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-success/10 text-success border-success/20'
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'critical':
        return 'bg-critical/10 text-critical border-critical/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const formatValue = (sensor: SensorReading) => {
    if (typeof sensor.value === 'boolean') {
      return sensor.value ? 'Detected' : 'Normal'
    }
    if (typeof sensor.value === 'number') {
      return `${sensor.value.toFixed(1)}${sensor.unit || ''}`
    }
    return String(sensor.value)
  }

  const temperatureSensors = sensorData.filter(s => s.type === 'temperature')
  const pressureSensors = sensorData.filter(s => s.type === 'pressure')
  const smokeSensors = sensorData.filter(s => s.type === 'smoke')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Cabin Sensors</h3>
        <p className="text-sm text-muted-foreground">Real-time monitoring of cabin environmental systems</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Temperature Zones</CardTitle>
            <Thermometer className="w-5 h-5 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {temperatureSensors.map((sensor) => (
                <div key={sensor.sensorId} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{sensor.location}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{formatValue(sensor)}</span>
                    <Badge variant="outline" className={getStatusColor(sensor.status)}>
                      {sensor.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Cabin Pressure</CardTitle>
            <ChartLine className="w-5 h-5 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pressureSensors.slice(0, 3).map((sensor) => (
                <div key={sensor.sensorId} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{sensor.location}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{formatValue(sensor)}</span>
                    <Badge variant="outline" className={getStatusColor(sensor.status)}>
                      {sensor.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Smoke Detection</CardTitle>
            <Flame className="w-5 h-5 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {smokeSensors.slice(0, 3).map((sensor) => (
                <div key={sensor.sensorId} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{sensor.location}</span>
                  <Badge variant="outline" className={getStatusColor(sensor.status)}>
                    {formatValue(sensor)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">All Sensor Readings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sensorData.map((sensor) => (
              <div
                key={sensor.sensorId}
                className="flex items-center justify-between p-3 border rounded-lg border-border bg-card"
              >
                <div className="flex items-center gap-3">
                  <div className={`${getStatusColor(sensor.status).split(' ')[0]} p-2 rounded-lg`}>
                    {getSensorIcon(sensor.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{sensor.location}</p>
                    <p className="text-xs text-muted-foreground capitalize">{sensor.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{formatValue(sensor)}</span>
                  <Badge variant="outline" className={getStatusColor(sensor.status)}>
                    {sensor.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
