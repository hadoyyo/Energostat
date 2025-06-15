// client/src/components/Navbar.jsx
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo flex items-center space-x-2">
          <img src={logo} alt="Logo" style={{ height: '32px', width: 'auto' }} />
          <span className="self-center">Energostat</span>
        </Link>

        <button 
          className="mobile-menu-button" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link 
                onClick={handleLogout} 
                className="nav-link"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/" 
                className="nav-link" 
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/login" 
                className="nav-link" 
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="nav-link" 
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}