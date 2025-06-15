import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { gsap } from 'gsap';
import './App.css';
import CountrySelector from './components/CountrySelector';
import YearRangeInput from './components/YearRangeInput';
import DataChart from './components/DataChart';
import DataTable from './components/DataTable';
import DataTransferButtons from './components/DataTransferButtons';
import StatusMessage from './components/StatusMessage';
import { fetchPopulationData, fetchEnergyData } from './services/api';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRoute from './components/AuthRoute';
import axios from 'axios';
import { useAuth } from './contexts/AuthContext';
import SearchHistory from './components/SearchHistory';
import HomePage from './components/HomePage';

function AppContent() {
  const [country, setCountry] = useState('USA');
  const [startYear, setStartYear] = useState(2000);
  const [endYear, setEndYear] = useState(2020);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(null);
  const [hasData, setHasData] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [countries, setCountries] = useState([]);
  const { user } = useAuth();

  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/common/countries');
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setStatus({
          message: 'Failed to load countries list',
          type: 'error'
        });
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

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

    if (contentRef.current) {
      timeline.fromTo(contentRef.current,
        { opacity: 0, scale: 0.98 },
        { 
          opacity: 1, 
          scale: 1,
          duration: 0.5 
        }, "-=0.3");
    }

    return () => timeline.kill();
  }, []);

  useEffect(() => {
    if (triggerFetch) {
      handleFetchData();
      setTriggerFetch(false);
    }
  }, [country, startYear, endYear, triggerFetch]);

  const checkDatabaseForData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/authorized/energy-data`, {
        params: {
          countryId: country,
          startYear,
          endYear
        },
        withCredentials: true
      });
      return response.data.length > 0 ? response.data : null;
    } catch (error) {
      console.error('Error checking database:', error);
      setStatus({
        message: 'Error checking database for existing data',
        type: 'error'
      });
      return null;
    }
  };

  const saveDataToDatabase = async (dataToSave) => {
    try {
      await axios.post(
        'http://localhost:8080/api/authorized/energy-data',
        {
          countryId: country,
          startYear,
          endYear,
          data: dataToSave
        },
        { withCredentials: true }
      );
      setRefreshHistory(prev => !prev);
    } catch (error) {
      console.error('Error saving data to database:', error);
      setStatus({
        message: 'Failed to save data to database',
        type: 'error'
      });
    }
  };

  const saveSearchHistory = async () => {
    try {
      await axios.post(
        'http://localhost:8080/api/authorized/energy-data/history',
        {
          countryId: country,
          startYear,
          endYear
        },
        { withCredentials: true }
      );
      setRefreshHistory(prev => !prev);
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const handleFetchData = async (fromHistory = false) => {
    if (startYear > endYear) {
      setStatus({ message: 'Start year must be before end year', type: 'error' });
      return;
    }

    try {
      setStatus({ message: 'Checking for existing data...', type: 'info' });
      
      const existingData = await checkDatabaseForData();
      if (existingData?.length > 0) {
        setData(existingData);
        setHasData(true);
        setStatus({ message: 'Data loaded from database!', type: 'success' });
        
        if (user && !fromHistory) {
          await saveSearchHistory();
        }
        return;
      }

      setStatus({ message: 'Fetching data from external APIs...', type: 'info' });
      
      const [populationData, energyData] = await Promise.all([
        fetchPopulationData(country, startYear, endYear),
        fetchEnergyData(country, startYear, endYear)
      ]);
      
      const combinedData = combineData(populationData, energyData);
      
      if (combinedData.length > 0) {
        setData(combinedData);
        setHasData(true);
        setStatus({ 
          message: `Successfully loaded ${combinedData.length} records`, 
          type: 'success' 
        });
        
        if (user && !fromHistory) {
          await saveDataToDatabase(combinedData);
          await saveSearchHistory();
        }
      } else {
        setStatus({ 
          message: 'No data available for selected parameters', 
          type: 'warning' 
        });
        setHasData(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus({ 
        message: `Error: ${error.message || 'Failed to fetch data'}`,
        type: 'error' 
      });
      setHasData(false);
    }
  };

  const handleSelectSearch = (search) => {
    setCountry(search.country);
    setStartYear(search.startYear);
    setEndYear(search.endYear);
    setTriggerFetch(true);
  };

  const handleDataImported = (importedData) => {
    setData(importedData);
    setHasData(true);
    setStatus({ 
      message: `Successfully imported ${importedData.length} records`, 
      type: 'success' 
    });
    
    if (importedData.length > 0) {
      const years = importedData.map(item => parseInt(item.year));
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      
      setStartYear(minYear);
      setEndYear(maxYear);
      
      const firstItem = importedData[0];
      if (firstItem.country) {
        const countryMatch = countries.find(c => 
          c.countryName.toLowerCase() === firstItem.country.toLowerCase()
        );
        if (countryMatch) {
          setCountry(countryMatch.countryId);
        } else {
          setStatus({
            message: `Country ${firstItem.country} not found in database`,
            type: 'warning'
          });
        }
      }
    }
  };

  const handleImportError = (errorMessage) => {
    setStatus({
      message: `Import failed! Incorrect file format or content.`,
      type: 'error'
    });
  };

  const combineData = (populationData, energyData) => {
    const populationMap = populationData.reduce((acc, item) => {
      acc[item.year] = item.population;
      return acc;
    }, {});

    return energyData
      .map(energyItem => ({
        year: energyItem.year,
        country: energyItem.country,
        population: populationMap[energyItem.year],
        populationInMillions: populationMap[energyItem.year] ? populationMap[energyItem.year] / 1000000 : null,
        energyConsumptionTWh: energyItem.energyConsumptionTWh,
        energyPerCapitaMWh: energyItem.energyPerCapitaMWh
      }))
      .filter(item => item.population !== undefined && item.energyConsumptionTWh !== undefined);
  };

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

  return (
    <div className="container">
      <header ref={titleRef}>
        <h1>{renderSplitText("Energy Consumption vs Population Analysis")}</h1>
        <p className="subtitle">{renderSplitText("Compare energy usage with population statistics")}</p>
      </header>
      
      <div ref={contentRef} className="app-content">
        {user && (
          <SearchHistory 
            onSelectSearch={handleSelectSearch} 
            refreshTrigger={refreshHistory}
          />
        )}
        
        <div className="controls-section">
          <h3>Search Parameters</h3>
          <div className="controls">
            <CountrySelector 
              value={country} 
              onChange={setCountry} 
              countries={countries} 
            />
            <YearRangeInput 
              startYear={startYear}
              endYear={endYear}
              onStartYearChange={setStartYear}
              onEndYearChange={setEndYear}
            />
            <button 
              className="primary-btn auth-btn" 
              onClick={() => handleFetchData()}
              disabled={!countries.length}
            >
              Fetch Data
            </button>
          </div>
        </div>

        <div className="results-section">
          <StatusMessage status={status} />
          
          {hasData && (
            <>
              <DataChart data={data} />
              <DataTable data={data} />
              <DataTransferButtons 
                data={data} 
                onDataImported={handleDataImported}
                onImportError={handleImportError}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<AuthRoute><LoginForm /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><RegisterForm /></AuthRoute>} />
          <Route path="/" element={
            <>
              <HomePage />
              <ProtectedRoute><AppContent /></ProtectedRoute>
            </>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;