const EMBER_API_KEY = 'aaaf2478-5c98-4044-ac8d-bdcf43f5ec67';

export async function fetchPopulationData(countryCode, startYear, endYear) {
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.POP.TOTL?format=json&date=${startYear}:${endYear}&per_page=100`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`World Bank API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data || data.length < 2 || !data[1]) {
    throw new Error('No population data available for this country/period');
  }
  
  return data[1]
    .filter(item => item.value !== null)
    .map(item => ({
      year: item.date,
      population: item.value,
      country: item.country.value
    }));
}

export async function fetchEnergyData(countryCode, startYear, endYear) {
  const url = `https://api.ember-energy.org/v1/electricity-demand/yearly?entity_code=${countryCode}&start_date=${startYear}&end_date=${endYear}&api_key=${EMBER_API_KEY}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ember API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data || !data.data || data.data.length === 0) {
    throw new Error('No energy data available for this country/period');
  }
  
  return data.data.map(item => ({
    year: item.date,
    energyConsumptionTWh: item.demand_twh,
    energyPerCapitaMWh: item.demand_mwh_per_capita,
    country: item.entity
  }));
}