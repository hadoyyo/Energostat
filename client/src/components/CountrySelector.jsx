import { useState } from 'react';
import 'flag-icons/css/flag-icons.min.css';

const countries = [
  { code: 'USA', name: 'United States', flag: 'us' },
  { code: 'CHN', name: 'China', flag: 'cn' },
  { code: 'IND', name: 'India', flag: 'in' },
  { code: 'JPN', name: 'Japan', flag: 'jp' },
  { code: 'DEU', name: 'Germany', flag: 'de' },
  { code: 'GBR', name: 'United Kingdom', flag: 'gb' },
  { code: 'FRA', name: 'France', flag: 'fr' },
  { code: 'BRA', name: 'Brazil', flag: 'br' },
  { code: 'POL', name: 'Poland', flag: 'pl' },
  { code: 'CAN', name: 'Canada', flag: 'ca' }
];

export default function CountrySelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCountry = countries.find(c => c.code === value) || countries[0];

  return (
    <div className="input-group country-select-container">
      <label htmlFor="country">Country:</label>
      <div className={`custom-select ${isOpen ? 'open' : ''}`}>
        <div 
          className="selected-option" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`fi fi-${selectedCountry.flag}`}></span> {selectedCountry.name}
        </div>
        <div className="options">
          {countries.map(country => (
            <div 
              key={country.code}
              className="option"
              onClick={() => {
                onChange(country.code);
                setIsOpen(false);
              }}
            >
              <span className={`fi fi-${country.flag}`}></span> {country.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}