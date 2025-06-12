// client/src/components/auth/RegisterForm.jsx
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import CountrySelector from '../CountrySelector'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    countryId: 'USA'
  })
  const [errors, setErrors] = useState({})
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCountryChange = (countryCode) => {
    setFormData(prev => ({
      ...prev,
      countryId: countryCode
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    
    const result = await register(formData)
    if (!result.success) {
      if (result.message) {
        setErrors({ general: result.message })
      }
      return
    }
    
    navigate('/login')
  }

  return (
    <div className="auth-form">
      <h2>Register</h2>
      {errors.general && <div className="status error">{errors.general}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            minLength="3"
          />
          {errors.firstName && <span className="error-text">{errors.firstName}</span>}
        </div>
        
        <div className="input-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            minLength="3"
          />
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}
        </div>
        
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
        
        <CountrySelector 
          value={formData.countryId}
          onChange={handleCountryChange}
        />
        
        <button type="submit" className="primary-btn auth-btn">
          Register
        </button>
      </form>
    </div>
  )
}