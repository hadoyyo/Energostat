// client/src/App.js
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import './App.css'
import CountrySelector from './components/CountrySelector'
import YearRangeInput from './components/YearRangeInput'
import DataChart from './components/DataChart'
import DataTable from './components/DataTable'
import ExportButtons from './components/ExportButtons'
import StatusMessage from './components/StatusMessage'
import { fetchPopulationData, fetchEnergyData } from './services/api'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AuthRoute from './components/AuthRoute'
import axios from 'axios'
import { useAuth } from './contexts/AuthContext'

function AppContent() {
  const [country, setCountry] = useState('USA')
  const [startYear, setStartYear] = useState(2000)
  const [endYear, setEndYear] = useState(2020)
  const [data, setData] = useState([])
  const [status, setStatus] = useState(null)
  const [hasData, setHasData] = useState(false)
  const { user } = useAuth()

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
      
      if (response.data.length > 0) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error checking database:', error);
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
    } catch (error) {
      console.error('Error saving data to database:', error);
    }
  };

  const handleFetchData = async () => {
    if (startYear > endYear) {
      setStatus({ message: 'Start year must be before end year', type: 'error' })
      return
    }

    try {
      setStatus({ message: 'Checking for existing data...', type: 'info' })
      
      // First check if data exists in our database
      const existingData = await checkDatabaseForData();
      if (existingData) {
        setData(existingData);
        setHasData(existingData.length > 0);
        setStatus({ message: 'Data loaded from database!', type: 'success' });
        return;
      }

      setStatus({ message: 'Fetching data from external APIs...', type: 'info' })
      
      // If not in database, fetch from external APIs
      const populationData = await fetchPopulationData(country, startYear, endYear)
      const energyData = await fetchEnergyData(country, startYear, endYear)
      
      const combinedData = combineData(populationData, energyData)
      
      // Save to database
      if (combinedData.length > 0 && user) {
        await saveDataToDatabase(combinedData);
      }
      
      setData(combinedData)
      setHasData(combinedData.length > 0)
      setStatus({ message: 'Data loaded successfully!', type: 'success' })
    } catch (error) {
      console.error('Error:', error)
      setStatus({ message: `Error: ${error.message}`, type: 'error' })
      setHasData(false)
    }
  };

  const combineData = (populationData, energyData) => {
    const populationMap = {};
    populationData.forEach(item => {
      populationMap[item.year] = item.population;
    });
    
    return energyData.map(energyItem => {
      const year = energyItem.year;
      const population = populationMap[year];
      const populationInMillions = population ? population / 1000000 : null;
      
      return {
        year: year,
        country: energyItem.country,
        population: population,
        populationInMillions: populationInMillions,
        energyConsumptionTWh: energyItem.energyConsumptionTWh,
        energyPerCapitaMWh: energyItem.energyPerCapitaMWh
      };
    }).filter(item => item.population !== undefined && item.energyConsumptionTWh !== undefined);
  };

  return (
    <div className="container">
      <header>
        <h1>Energy Consumption vs Population Analysis</h1>
        <p className="subtitle">Compare energy usage with population statistics across countries and years</p>
      </header>
      
      <div className="controls">
        <CountrySelector 
          value={country} 
          onChange={setCountry} 
        />
        
        <YearRangeInput 
          startYear={startYear}
          endYear={endYear}
          onStartYearChange={setStartYear}
          onEndYearChange={setEndYear}
        />
        
        <button 
          className="primary-btn" 
          onClick={handleFetchData}
        >
          Fetch Data
        </button>
      </div>

      <StatusMessage status={status} />
      
      {hasData && (
        <>
          <DataChart data={data} />
          <DataTable data={data} />
          <ExportButtons data={data} />
        </>
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={
            <AuthRoute>
              <LoginForm />
            </AuthRoute>
          } />
          <Route path="/register" element={
            <AuthRoute>
              <RegisterForm />
            </AuthRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App