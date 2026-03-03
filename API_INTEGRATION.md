# API Integration Guide

## Overview

The Cabin Operations Platform includes a comprehensive API integration layer that allows you to connect to your existing backend systems. The platform is designed to work offline-first, queueing requests when connectivity is lost and automatically syncing when connection is restored.

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
VITE_API_BASE_URL=https://api.cabin-operations.example.com
```

### API Client

The API client is located at `src/lib/api.ts` and provides:

- Automatic authentication header injection
- Request queueing for offline scenarios
- Configurable timeout and retry logic
- Type-safe request/response handling

## API Endpoints

### Authentication

#### Login
```typescript
POST /auth/login
Body: { email: string, password: string }
Response: { user: AuthUser, token: string, refreshToken: string, expiresAt: number, isOnboarded: boolean }
```

#### Signup
```typescript
POST /auth/signup
Body: { name: string, email: string, password: string, employeeId: string, airline: string }
Response: { user: AuthUser, token: string, refreshToken: string, expiresAt: number }
```

#### Logout
```typescript
POST /auth/logout
Headers: Authorization: Bearer {token}
Response: { success: boolean }
```

### Crew Management

#### Get Profile
```typescript
GET /crew/profile
Headers: Authorization: Bearer {token}
Response: { user: AuthUser }
```

#### List Crew Members
```typescript
GET /crew/members
Headers: Authorization: Bearer {token}
Response: { members: CrewMember[] }
```

#### Get Tasks
```typescript
GET /crew/tasks
Headers: Authorization: Bearer {token}
Response: { tasks: CrewTask[] }
```

### Passengers

#### List Passengers
```typescript
GET /passengers
Headers: Authorization: Bearer {token}
Response: { passengers: Passenger[] }
```

#### Get Passenger Details
```typescript
GET /passengers/:id
Headers: Authorization: Bearer {token}
Response: { passenger: Passenger }
```

#### Get Passenger Requests
```typescript
GET /passengers/requests
Headers: Authorization: Bearer {token}
Response: { requests: PassengerRequest[] }
```

### Inventory

#### Get Inventory Items
```typescript
GET /inventory/items
Headers: Authorization: Bearer {token}
Response: { items: InventoryItem[] }
```

#### Update Inventory
```typescript
PUT /inventory/update
Headers: Authorization: Bearer {token}
Body: { itemId: string, quantity: number }
Response: { success: boolean, item: InventoryItem }
```

#### Get Consumption Data
```typescript
GET /inventory/consumption
Headers: Authorization: Bearer {token}
Query: { startDate?: number, endDate?: number }
Response: { data: ConsumptionData[] }
```

### Incidents

#### List Incidents
```typescript
GET /incidents
Headers: Authorization: Bearer {token}
Response: { incidents: Incident[] }
```

#### Create Incident
```typescript
POST /incidents/create
Headers: Authorization: Bearer {token}
Body: { type: string, severity: string, title: string, description: string, location: string }
Response: { success: boolean, incident: Incident }
```

#### Update Incident
```typescript
PUT /incidents/:id
Headers: Authorization: Bearer {token}
Body: Partial<Incident>
Response: { success: boolean, incident: Incident }
```

### Alerts

#### Get Alerts
```typescript
GET /alerts
Headers: Authorization: Bearer {token}
Response: { alerts: CabinAlert[] }
```

#### Acknowledge Alert
```typescript
POST /alerts/:id/acknowledge
Headers: Authorization: Bearer {token}
Response: { success: boolean }
```

#### Resolve Alert
```typescript
POST /alerts/:id/resolve
Headers: Authorization: Bearer {token}
Response: { success: boolean }
```

### Security

#### Get Security Events
```typescript
GET /security/events
Headers: Authorization: Bearer {token}
Response: { events: SecurityEvent[] }
```

#### Get Security Robots
```typescript
GET /security/robots
Headers: Authorization: Bearer {token}
Response: { robots: SecurityRobot[] }
```

#### Get Threat Assessment
```typescript
GET /security/threats
Headers: Authorization: Bearer {token}
Response: { assessment: ThreatAssessment }
```

### Analytics

#### Get Consumption Analytics
```typescript
GET /analytics/consumption
Headers: Authorization: Bearer {token}
Query: { period: 'day' | 'week' | 'month' }
Response: { data: ConsumptionAnalytics }
```

#### Get Performance Metrics
```typescript
GET /analytics/performance
Headers: Authorization: Bearer {token}
Response: { metrics: PerformanceMetrics }
```

#### Get Reports
```typescript
GET /analytics/reports
Headers: Authorization: Bearer {token}
Query: { type: string, startDate: number, endDate: number }
Response: { reports: Report[] }
```

## Usage Example

```typescript
import { apiClient } from '@/lib/api'

// Set authentication token (usually done during login)
apiClient.setAuthToken('your-jwt-token')

// Make requests
const response = await apiClient.get('/crew/profile')
if (response.success) {
  console.log('User profile:', response.data)
} else {
  console.error('Error:', response.error)
}

// Create new data
const result = await apiClient.post('/incidents/create', {
  type: 'safety',
  severity: 'high',
  title: 'Smoke detector activation',
  description: 'Zone B smoke detector activated',
  location: 'Galley B'
})
```

## Offline Support

The API client automatically queues requests when offline. When connectivity is restored, queued requests are processed automatically.

```typescript
// Check queue length
const queueLength = apiClient.getQueueLength()

// Manually process queue
await apiClient.processQueue()
```

## Error Handling

All API responses follow a consistent structure:

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: number
}
```

## Security

- All requests include JWT authentication tokens in the Authorization header
- Tokens are stored securely using the Spark KV storage
- Sessions expire based on the `expiresAt` timestamp
- Refresh tokens can be used to obtain new access tokens

## Testing

For development and testing, a demo mode is available:

- Email: `demo@cabin-ops.com`
- Password: `demo123`

This creates a local session without requiring backend API calls.
