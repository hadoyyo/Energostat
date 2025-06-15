import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { FiBarChart2, FiDatabase, FiClock, FiUser } from 'react-icons/fi'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)
  const featuresTitleRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    if (isAuthenticated) return

    const timeline = gsap.timeline({ defaults: { ease: "power2.out" } })

    if (titleRef.current) {
      const letters = titleRef.current.querySelectorAll('span')
      timeline.fromTo(letters,
        { opacity: 0, y: 20 },
        { 
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
        })
    }

    if (descriptionRef.current) {
      timeline.fromTo(descriptionRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1,
          y: 0,
          duration: 0.5
        }, "-=0.3")
    }

    if (featuresTitleRef.current) {
      timeline.fromTo(featuresTitleRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1,
          y: 0,
          duration: 0.5
        }, "+=0.3")
    }

    if (cardsRef.current.length > 0) {
      timeline.fromTo(cardsRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.15
        }, "-=0.2")
    }

    return () => timeline.kill()
  }, [isAuthenticated])

  if (isAuthenticated) return null

  const renderSplitText = (text) => {
  return text.split(' ').map((word, wordIndex) => (
    <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
      {word.split('').map((char, charIndex) => (
        <span key={charIndex} style={{ display: 'inline-block' }}>
          {char}
        </span>
      ))}
      {wordIndex < text.split(' ').length - 1 ? '\u00A0' : ''}
    </span>
  ))
}

  const features = [
    {
      icon: <FiBarChart2 size={24} />,
      title: "Interactive Charts",
      description: "Dynamic data visualization"
    },
    {
      icon: <FiDatabase size={24} />,
      title: "Data Transfer",
      description: "Export and import JSON and XML data easily",
    },
    {
      icon: <FiClock size={24} />,
      title: "Search History",
      description: "Track your previous searches and results"
    },
    {
      icon: <FiUser size={24} />,
      title: "User Accounts",
      description: "Save your data with secure authentication"
    }
  ]

  const addToCardsRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el)
    }
  }

  return (
    <div className="home-page">
      <div className="home-content">
        <h1 ref={titleRef} className="home-title">
          {renderSplitText("Welcome to Energostat!")}
        </h1>
        
        <p ref={descriptionRef} className="description">
          Energostat is a simple service providing information about energy consumption in different countries.
        </p>
        
        <div className="features">
          <h2 ref={featuresTitleRef}>Key Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <SpotlightCard 
                key={index} 
                className="feature-card"
                ref={addToCardsRef}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const SpotlightCard = React.forwardRef(({ children, className = "" }, ref) => {
  const cardRef = useRef(null)

  useEffect(() => {
    if (typeof ref === 'function') {
      ref(cardRef.current)
    } else if (ref) {
      ref.current = cardRef.current
    }
  }, [ref])

  const handleMouseMove = (e) => {
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  )
})