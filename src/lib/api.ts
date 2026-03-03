export interface ApiConfig {
  baseUrl: string
      login: s
      logou
      login: string
      signup: string
      logout: string
      refresh: string
      validate: string
    }
    passeng
      profile: string
      members: string
      tasks: string
     
    passengers: {
      acknowledge:
    }
      events: string
     
    analytics: {
      performance: 
    }
  timeout: number
}
export const def
  endpoints: {
      login: '/auth/
      logout: '/auth
     
    crew: {
      members: '/c
    },
      list: '/passeng
     
    inventory: 
      update: '/inve
    },
      list: '/inciden
     
    alerts: {
      acknowledge: '/aler
    },
      events: '/secur
     
   
      performance
    }
 

export interface ApiResponse<T = any> {
  data?: T
  message?: st
}
export interface QueuedRequ
  endpoint: string
  body?: any
  retries: number

  priv
  private r
  constructor(config: ApiConfig
  }
  setAuthToken(token: stri
  }
  getAuthToken():
  }
  private getHeaders(): HeadersIn
      'Content-Type': 'application/jso

      headers['A

  }
  private buildUrl(endpoint: string, params
    
      Object.key
      })

  }
  asyn
    options: 
  ): Promise<ApiRespon
    
      const controller = new AbortCo

        ...opti
          ...this.getHeaders(),
        },
      })
      
      const data
      if (!response.ok) {
          success: false,
          message: data.message,
     

        success: 
        timestamp:
 


        success: f
        ti
    }

    const queuedReq
 

      retries: 0

  }
  async processQ


      try {
 

        if (!resu
            ...request,
          })
      } catch (error) {

            retries: request.retries + 1
        }
   


    return this.requestQue



    return this.request<T
   

  put<T = any>(endpoint: string, body
      method: 'PUT',
    }, params)


      body: JSON.stringif
  }
  del


















































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
