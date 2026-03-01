export type CabinZoneStatus = 'normal' | 'warning' | 'critical' | 'offline'
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical'
export type IncidentType = 'safety' | 'medical' | 'passenger' | 'equipment' | 'service'
export type TaskStatus = 'pending' | 'in-progress' | 'completed'
export type ConnectivityStatus = 'online' | 'offline' | 'syncing'

export interface CabinZone {
  id: string
  name: string
  status: CabinZoneStatus
  seatRange: string
  occupancy: number
  capacity: number
  issues: number
  lastUpdated: number
}

export interface Passenger {
  id: string
  seatNumber: string
  name: string
  tier: 'economy' | 'premium' | 'business' | 'first'
  specialNeeds?: string[]
  dietaryRequirements?: string[]
  connectingFlight?: {
    flightNumber: string
    departure: string
    gate: string
    boardingTime: string
  }
  preferences?: {
    beverage?: string
    meal?: string
  }
  purchaseHistory?: string[]
}

export interface InventoryItem {
  id: string
  category: 'meals' | 'beverages' | 'duty-free' | 'supplies'
  name: string
  current: number
  capacity: number
  unit: string
  alertThreshold: number
  predicted?: number
}

export interface Incident {
  id: string
  type: IncidentType
  severity: IncidentSeverity
  title: string
  description: string
  location: string
  reportedBy: string
  timestamp: number
  status: 'open' | 'acknowledged' | 'resolved'
  images?: string[]
  actions?: string[]
}

export interface CrewTask {
  id: string
  title: string
  description: string
  assignedTo: string
  assignedBy: string
  priority: 'low' | 'medium' | 'high'
  status: TaskStatus
  dueTime?: number
  completedTime?: number
}

export interface CrewMember {
  id: string
  name: string
  role: 'lead' | 'senior' | 'crew'
  zone: string
  status: 'active' | 'break' | 'busy'
  avatar?: string
}

export interface FlightInfo {
  flightNumber: string
  departure: string
  arrival: string
  departureTime: string
  arrivalTime: string
  currentPhase: 'boarding' | 'taxi' | 'climb' | 'cruise' | 'descent' | 'landing'
}

export interface SyncStatus {
  connectivity: ConnectivityStatus
  lastSync: number
  pendingChanges: number
}

export type AlertPriority = 'low' | 'medium' | 'high' | 'critical'
export type AlertCategory = 'safety' | 'medical' | 'equipment' | 'passenger' | 'service' | 'system'

export interface CabinAlert {
  id: string
  category: AlertCategory
  priority: AlertPriority
  title: string
  message: string
  location?: string
  timestamp: number
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: number
  resolved: boolean
  resolvedBy?: string
  resolvedAt?: number
  actionRequired?: string
  relatedData?: any
}
