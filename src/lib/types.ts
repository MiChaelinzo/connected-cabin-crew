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
  requests?: PassengerRequest[]
}

export type RequestStatus = 'pending' | 'in-progress' | 'completed' | 'declined'
export type RequestType = 'beverage' | 'meal' | 'blanket' | 'assistance' | 'temperature' | 'entertainment' | 'other'

export interface PassengerRequest {
  id: string
  passengerId: string
  type: RequestType
  description: string
  status: RequestStatus
  timestamp: number
  respondedBy?: string
  respondedAt?: number
  response?: string
  completedAt?: number
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

export type ThreatLevel = 'none' | 'low' | 'medium' | 'high' | 'critical'
export type SecurityEventType = 'suspicious-behavior' | 'unattended-item' | 'restricted-access' | 'aggression' | 'unauthorized-device' | 'biohazard' | 'weapon-detection' | 'cyber-threat'
export type RobotStatus = 'idle' | 'patrolling' | 'investigating' | 'responding' | 'charging' | 'offline'
export type RobotType = 'patrol' | 'inspection' | 'medical' | 'security' | 'decontamination'

export interface SecurityEvent {
  id: string
  type: SecurityEventType
  threatLevel: ThreatLevel
  title: string
  description: string
  location: string
  timestamp: number
  detectedBy: 'ai' | 'crew' | 'sensor' | 'passenger'
  status: 'active' | 'investigating' | 'contained' | 'resolved' | 'false-alarm'
  assignedRobots?: string[]
  evidence?: {
    images?: string[]
    video?: string[]
    sensorData?: any
  }
  response?: {
    actions: string[]
    respondedBy: string[]
    resolvedAt?: number
  }
}

export interface SecurityRobot {
  id: string
  name: string
  type: RobotType
  status: RobotStatus
  battery: number
  location: string
  currentTask?: string
  capabilities: string[]
  lastMaintenance: number
  coordinates?: {
    x: number
    y: number
    z: number
  }
  speed?: number
  assignedZone?: string
}

export interface ThreatAssessment {
  overallThreatLevel: ThreatLevel
  activeThreats: number
  containedThreats: number
  falseAlarms: number
  aiConfidence: number
  lastUpdated: number
  recommendations: string[]
}

export interface BiometricScan {
  passengerId: string
  timestamp: number
  temperature: number
  heartRate?: number
  stressLevel?: 'normal' | 'elevated' | 'high'
  behaviorFlags?: string[]
  riskScore: number
}
