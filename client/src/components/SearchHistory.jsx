// client/src/components/SearchHistory.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'flag-icons/css/flag-icons.min.css';
import { useAuth } from '../contexts/AuthContext';

export default function SearchHistory({ onSelectSearch, refreshTrigger }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/authorized/search-history', {
          withCredentials: true
        });
        setHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search history:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchSearchHistory();
    }
  }, [user, refreshTrigger]);

  if (loading) {
    return <div>Loading search history...</div>;
  }

  return (
    <div className="search-history">
      {history.length > 0 && (
        <>
          <h3>Recent Searches</h3>
          <div className="history-capsules">
            {history.map((item) => (
              <div 
                key={item.searchId}
                className="search-capsule"
                onClick={() => onSelectSearch({
                  country: item.countryId,
                  startYear: item.startYear,
                  endYear: item.endYear
                })}
              >
                <div className="flag-container">
                  <span className={`fi fi-${item.country.flagCode.toLowerCase()}`}></span>
                </div>
                <div className="capsule-content">
                  <span className="country-name">{item.country.countryName}</span>
                  <span className="years">{item.startYear} - {item.endYear}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
  
}
