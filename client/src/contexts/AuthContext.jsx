// client/src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/common/check-auth', {
          withCredentials: true
        })
        
        if (response.data.isAuthenticated) {
          setUser(response.data.user)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/common/login',
        { email, password },
        { withCredentials: true }
      )

      if (response.data.success) {
        setUser(response.data.user)
        setIsAuthenticated(true)
        return { success: true }
      }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, message: error.response?.data?.message || 'Login failed' }
    }
  }

  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:8080/api/common/logout',
        {},
        { withCredentials: true }
      )
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/common/register',
        userData
      )

      if (response.data.success) {
        return { success: true }
      }
    } catch (error) {
      console.error('Registration failed:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        loading, 
        login, 
        logout, 
        register 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)