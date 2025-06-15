import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}