export interface ApiConfig {
  baseUrl: string
  endpoints: {
    auth: {
      login: string
      signup: string
      logout: string
      refresh: string
      validate: string
    }
    crew: {
      profile: string
      members: string
      tasks: string
    }
    passengers: {
      list: string
      details: string
      requests: string
    }
    inventory: {
      items: string
      update: string
      consumption: string
    }
    incidents: {
      list: string
      create: string
      update: string
    }
    alerts: {
      list: string
      acknowledge: string
      resolve: string
    }
    security: {
      events: string
      robots: string
      threats: string
    }
    analytics: {
      consumption: string
      performance: string
      reports: string
    }
  }
  timeout: number
  retryAttempts: number
}

export const defaultApiConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.cabin-operations.example.com',
  endpoints: {
    auth: {
      login: '/auth/login',
      signup: '/auth/signup',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      validate: '/auth/validate'
    },
    crew: {
      profile: '/crew/profile',
      members: '/crew/members',
      tasks: '/crew/tasks'
    },
    passengers: {
      list: '/passengers',
      details: '/passengers/:id',
      requests: '/passengers/requests'
    },
    inventory: {
      items: '/inventory/items',
      update: '/inventory/update',
      consumption: '/inventory/consumption'
    },
    incidents: {
      list: '/incidents',
      create: '/incidents/create',
      update: '/incidents/:id'
    },
    alerts: {
      list: '/alerts',
      acknowledge: '/alerts/:id/acknowledge',
      resolve: '/alerts/:id/resolve'
    },
    security: {
      events: '/security/events',
      robots: '/security/robots',
      threats: '/security/threats'
    },
    analytics: {
      consumption: '/analytics/consumption',
      performance: '/analytics/performance',
      reports: '/analytics/reports'
    }
  },
  timeout: 30000,
  retryAttempts: 3
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: number
}

export interface QueuedRequest {
  id: string
  endpoint: string
  method: string
  body?: any
  timestamp: number
  retries: number
}

class ApiClient {
  private config: ApiConfig
  private authToken: string | null = null
  private requestQueue: QueuedRequest[] = []

  constructor(config: ApiConfig = defaultApiConfig) {
    this.config = config
  }

  setAuthToken(token: string | null) {
    this.authToken = token
  }

  getAuthToken(): string | null {
    return this.authToken
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    return headers
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    let url = `${this.config.baseUrl}${endpoint}`
    
    if (params) {
      Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, params[key])
      })
    }

    return url
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params)
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
          message: data.message,
          timestamp: Date.now()
        }
      }

      return {
        success: true,
        data: data,
        timestamp: Date.now()
      }
    } catch (error) {
      if (navigator.onLine === false) {
        this.queueRequest(endpoint, options.method || 'GET', options.body)
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        timestamp: Date.now()
      }
    }
  }

  private queueRequest(endpoint: string, method: string, body?: any) {
    const queuedRequest: QueuedRequest = {
      id: `${Date.now()}-${Math.random()}`,
      endpoint,
      method,
      body,
      timestamp: Date.now(),
      retries: 0
    }

    this.requestQueue.push(queuedRequest)
  }

  async processQueue(): Promise<void> {
    if (this.requestQueue.length === 0) return

    const failedRequests: QueuedRequest[] = []

    for (const request of this.requestQueue) {
      try {
        const result = await this.request(request.endpoint, {
          method: request.method,
          body: request.body ? JSON.stringify(request.body) : undefined
        })

        if (!result.success && request.retries < this.config.retryAttempts) {
          failedRequests.push({
            ...request,
            retries: request.retries + 1
          })
        }
      } catch (error) {
        if (request.retries < this.config.retryAttempts) {
          failedRequests.push({
            ...request,
            retries: request.retries + 1
          })
        }
      }
    }

    this.requestQueue = failedRequests
  }

  getQueueLength(): number {
    return this.requestQueue.length
  }

  get<T = any>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, params)
  }

  post<T = any>(endpoint: string, body: any, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    }, params)
  }

  put<T = any>(endpoint: string, body: any, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    }, params)
  }

  patch<T = any>(endpoint: string, body: any, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    }, params)
  }

  delete<T = any>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, params)
  }
}

export const apiClient = new ApiClient()
