import { useKV } from '@github/spark/hooks'
import { apiClient } from '@/lib/api'
import type { AuthSession, AuthUser } from '@/lib/types'

export function useAuth() {
  const [session, setSession] = useKV<AuthSession | null>('auth-session', null)

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await apiClient.post('/auth/login', { email, password })

      if (result.success && result.data) {
        const authSession: AuthSession = {
          user: result.data.user,
          token: result.data.token,
          refreshToken: result.data.refreshToken,
          expiresAt: result.data.expiresAt || Date.now() + (24 * 60 * 60 * 1000),
          isOnboarded: result.data.isOnboarded || false
        }

        apiClient.setAuthToken(authSession.token)
        setSession(authSession)

        return { success: true }
      }

      return {
        success: false,
        error: result.error || 'Login failed'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  const signup = async (
    name: string,
    email: string,
    password: string,
    employeeId: string,
    airline: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await apiClient.post('/auth/signup', {
        name,
        email,
        password,
        employeeId,
        airline
      })

      if (result.success && result.data) {
        const authSession: AuthSession = {
          user: result.data.user,
          token: result.data.token,
          refreshToken: result.data.refreshToken,
          expiresAt: result.data.expiresAt || Date.now() + (24 * 60 * 60 * 1000),
          isOnboarded: false
        }

        apiClient.setAuthToken(authSession.token)
        setSession(authSession)

        return { success: true }
      }

      return {
        success: false,
        error: result.error || 'Signup failed'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout', {})
    } catch (error) {
    }

    apiClient.setAuthToken(null)
    setSession(null)
  }

  const updateUser = (updates: Partial<AuthUser>) => {
    if (!session) return

    setSession({
      ...session,
      user: {
        ...session.user,
        ...updates
      }
    })
  }

  const completeOnboarding = () => {
    if (!session) return

    setSession({
      ...session,
      isOnboarded: true
    })
  }

  const isAuthenticated = !!session
  const user = session?.user || null
  const isOnboarded = session?.isOnboarded || false

  return {
    session,
    user,
    isAuthenticated,
    isOnboarded,
    login,
    signup,
    logout,
    updateUser,
    completeOnboarding
  }
}
