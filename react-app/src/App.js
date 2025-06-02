import { useState } from 'react';
import './App.css';
import CountrySelector from './components/CountrySelector';
import YearRangeInput from './components/YearRangeInput';
import DataChart from './components/DataChart';
import DataTable from './components/DataTable';
import ExportButtons from './components/ExportButtons';
import StatusMessage from './components/StatusMessage';
import { fetchPopulationData, fetchEnergyData } from './services/api';



function App() {
  const [country, setCountry] = useState('USA');
  const [startYear, setStartYear] = useState(2000);
  const [endYear, setEndYear] = useState(2020);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(null);
  const [hasData, setHasData] = useState(false);

  const handleFetchData = async () => {
    if (startYear > endYear) {
      setStatus({ message: 'Start year must be before end year', type: 'error' });
      return;
    }

    try {
      setStatus({ message: 'Fetching data...', type: 'info' });
      
      const populationData = await fetchPopulationData(country, startYear, endYear);
      const energyData = await fetchEnergyData(country, startYear, endYear);
      
      const combinedData = combineData(populationData, energyData);
      setData(combinedData);
      setHasData(combinedData.length > 0);
      setStatus({ message: 'Data loaded successfully!', type: 'success' });
    } catch (error) {
      console.error('Error:', error);
      setStatus({ message: `Error: ${error.message}`, type: 'error' });
      setHasData(false);
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
  );
}

export default App;