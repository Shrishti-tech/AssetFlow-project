import { createContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'
import { getErrorMessage } from '../utils/authHelpers'

export const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const notify = (message, type = 'success') => { setToast({ message, type }); window.setTimeout(() => setToast(null), 4000) }
  const logout = async (message) => { try { await authService.logout() } catch {} setUser(null); if (message) notify(message, 'error') }
  const login = async (credentials) => {
    const { data } = await authService.login(credentials)
    setUser(data.user)
    return data.user
  }
  useEffect(() => {
    const restoreSession = async () => {
      try { setUser((await authService.me()).data.user) }
      catch (error) { if (error.response?.status !== 401) logout(getErrorMessage(error)) }
      finally { setLoading(false) }
    }
    restoreSession()
  }, [])
  useEffect(() => {
    if (!user) return undefined
    const checkSession = window.setInterval(async () => {
      try { setUser((await authService.me()).data.user) }
      catch { await logout('Your session has expired. Please sign in again.') }
    }, 60_000)
    return () => window.clearInterval(checkSession)
  }, [user])
  return <AuthContext.Provider value={{ user, loading, login, logout, notify }}>
    {children}{toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
  </AuthContext.Provider>
}
