import { useState, useEffect } from 'react'
import axios from 'axios'
import 'flag-icons/css/flag-icons.min.css'
import { useAuth } from '../contexts/AuthContext'

export default function SearchHistory({ onSelectSearch, refreshTrigger }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setHistory([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const { data } = await axios.get(
          'http://localhost:8080/api/authorized/search-history', 
          { withCredentials: true }
        )
        setHistory(data)
      } catch (error) {
        console.error('Error fetching history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [user, refreshTrigger])

  const handleClick = (item) => {
    onSelectSearch({
      country: item.countryId,
      startYear: item.startYear,
      endYear: item.endYear
    })
  }

  if (!user) return null

  return (
    <div className="search-history">
      <h3>Recent Searches</h3>
      {loading ? (
        <div>Loading...</div>
      ) : history.length === 0 ? (
        <div>No searches yet</div>
      ) : (
        <div className="history-capsules">
          {history.map(item => (
            <div
              key={item.searchId}
              className="search-capsule"
              onClick={() => handleClick(item)}
            >
              <div className="flag-container">
                <span className={`fi fi-${item.country.flagCode.toLowerCase()}`} />
              </div>
              <div className="capsule-content">
                <span className="country-name">{item.country.countryName}</span>
                <span className="years">{item.startYear} - {item.endYear}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}