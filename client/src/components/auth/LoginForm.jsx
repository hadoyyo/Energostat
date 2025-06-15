import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { FiLogIn } from 'react-icons/fi'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const titleRef = useRef(null)
  const formRef = useRef(null)
  const errorRef = useRef(null)
  const buttonRef = useRef(null)
  const linkRef = useRef(null)

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power2.out" } })

    // Animacja tytułu
    if (titleRef.current) {
      const letters = titleRef.current.querySelectorAll('span')
      timeline.fromTo(letters,
        { opacity: 0, y: 20 },
        { 
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.03,
        })
    }

    // Animacja fomularza
    if (formRef.current) {
      timeline.fromTo(formRef.current,
        { opacity: 0, scale: 0.98 },
        { 
          opacity: 1, 
          scale: 1,
          duration: 0.5 
        }, "-=0.3")
    }

    return () => timeline.kill()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const result = await login(email, password)
    if (!result.success) {
      setError(result.message || 'Login failed')
      
      if (errorRef.current) {
        gsap.fromTo(errorRef.current,
          { x: -10, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4 })
      }
      return
    }
    
    navigate('/')
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
        {renderSplitText("Login")}
      </h2>
      
      {error && (
        <div ref={errorRef} className="status error">
          {error}
        </div>
      )}
      
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="primary-btn auth-btn"
        >
          Sign In
        </button>
        <div ref={linkRef} className="auth-link">
        Don't have an account? <Link to="/register">Register</Link>
      </div>
      </form>
    </div>
  )
}