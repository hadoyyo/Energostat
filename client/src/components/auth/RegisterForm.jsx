import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { gsap } from 'gsap'
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

  const titleRef = useRef(null)
  const formRef = useRef(null)
  const errorRef = useRef(null)
  const buttonRef = useRef(null)
  const linkRef = useRef(null)
  const countrySelectorRef = useRef(null)

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Animacja tytułu
    if (titleRef.current) {
      const letters = titleRef.current.querySelectorAll('span');
      timeline.fromTo(letters,
        { opacity: 0, y: 20 },
        { 
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.03,
        });
    }

    // Animacja formularza
    if (formRef.current) {
      timeline.fromTo(formRef.current,
        { opacity: 0, scale: 0.98 },
        { 
          opacity: 1, 
          scale: 1,
          duration: 0.5 
        }, "-=0.3");
    }

    return () => timeline.kill();
  }, []);

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
  
  try {
    const result = await register(formData)
    if (!result.success) {
      setErrors({ 
        general: result.message || 'Registration failed' 
      })
      
      if (errorRef.current) {
        gsap.fromTo(errorRef.current,
          { x: -10, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4 })
      }
      return
    }
    
    navigate('/login')
  } catch (error) {
    setErrors({ 
      general: 'An unexpected error occurred. Please try again.' 
    })
    
    if (errorRef.current) {
      gsap.fromTo(errorRef.current,
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4 })
    }
  }
}

  const renderSplitText = (text) => {
    return text.split('').map((char, index) => (
      <span key={index} style={{ display: 'inline-block' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  return (
    <div className="auth-form">
      <h2 ref={titleRef} className="auth-title">
        {renderSplitText("Register")}
      </h2>
      
      {errors.general && (
        <div ref={errorRef} className="status error">
          {errors.general}
        </div>
      )}
      
      <form ref={formRef} onSubmit={handleSubmit}>
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
            autoComplete="given-name"
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
            autoComplete="family-name"
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
            autoComplete="email"
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
            autoComplete="new-password"
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
        
        <div ref={countrySelectorRef}>
          <CountrySelector 
            value={formData.countryId}
            onChange={handleCountryChange}
          />
        </div>
        
        <button 
          ref={buttonRef} 
          type="submit" 
          className="primary-btn auth-btn"
        >
          Register
        </button>
        <div ref={linkRef} className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  )
}