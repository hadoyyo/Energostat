// client/src/components/Navbar.jsx
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

// client/src/components/Navbar.jsx
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Energostat
        </Link>
        
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link onClick={handleLogout} className="nav-link">
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}