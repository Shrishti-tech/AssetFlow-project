import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth(); const location = useLocation()
  if (loading) return <div className="page-spinner"><i /> Loading your workspace…</div>
  return user ? children : <Navigate to="/login" replace state={{ from: location }} />
}
