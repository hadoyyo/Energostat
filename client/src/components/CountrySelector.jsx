import { useState, useEffect } from 'react';
import 'flag-icons/css/flag-icons.min.css';
import axios from 'axios';

export default function CountrySelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/common/countries');
        setCountries(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) {
    return <div>Loading countries...</div>;
  }

  const selectedCountry = countries.find(c => c.countryId === value) || countries[0];

  return (
    <div className="input-group country-select-container">
      <label htmlFor="country">Country:</label>
      <div className={`custom-select ${isOpen ? 'open' : ''}`}>
        <div 
          className="selected-option" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`fi fi-${selectedCountry.flagCode.toLowerCase()}`}></span> {selectedCountry.countryName}
        </div>
        <div className="options">
          {countries.map(country => (
            <div 
              key={country.countryId}
              className="option"
              onClick={() => {
                onChange(country.countryId);
                setIsOpen(false);
              }}
            >
              <span className={`fi fi-${country.flagCode.toLowerCase()}`}></span> {country.countryName}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}