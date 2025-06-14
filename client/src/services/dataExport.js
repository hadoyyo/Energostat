export function exportToJSON(data) {
  const jsonStr = JSON.stringify(data, null, 2);
  downloadFile(jsonStr, 'energy-data.json', 'application/json');
}

export function exportToXML(data) {
  let xmlStr = '<?xml version="1.0" encoding="UTF-8"?>\n<energyData>\n';
  
  data.forEach(item => {
    xmlStr += '  <entry>\n';
    xmlStr += `    <year>${item.year}</year>\n`;
    xmlStr += `    <country>${escapeXml(item.country)}</country>\n`;
    xmlStr += `    <population>${item.population}</population>\n`;
    xmlStr += `    <energyConsumptionTWh>${item.energyConsumptionTWh}</energyConsumptionTWh>\n`;
    xmlStr += `    <energyPerCapitaMWh>${item.energyPerCapitaMWh}</energyPerCapitaMWh>\n`;
    xmlStr += '  </entry>\n';
  });
  
  xmlStr += '</energyData>';
  
  downloadFile(xmlStr, 'energy-data.xml', 'application/xml');
}

export function importFromJSON(file, successCallback, errorCallback) {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (!Array.isArray(data)) {
        throw new Error('Invalid format: Expected an array of data entries');
      }
      
      if (data.length === 0) {
        throw new Error('File is empty');
      }
      
      if (!validateDataFormat(data)) {
        throw new Error('Invalid data structure. Required fields: year, country, population, energyConsumptionTWh, energyPerCapitaMWh');
      }
      
      successCallback(data);
    } catch (error) {
      errorCallback(error.message || 'Failed to parse JSON file');
    }
  };
  
  reader.onerror = () => {
    errorCallback('Error reading file');
  };
  
  reader.readAsText(file);
}

export function importFromXML(file, successCallback, errorCallback) {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(event.target.result, "application/xml");
      
      const errorNode = xmlDoc.querySelector('parsererror');
      if (errorNode) {
        throw new Error('Invalid XML format');
      }
      
      const entries = xmlDoc.getElementsByTagName("entry");
      if (entries.length === 0) {
        throw new Error('No valid entries found in XML');
      }
      
      const data = [];
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const year = entry.getElementsByTagName("year")[0]?.textContent;
        const country = entry.getElementsByTagName("country")[0]?.textContent;
        const population = entry.getElementsByTagName("population")[0]?.textContent;
        const energyConsumptionTWh = entry.getElementsByTagName("energyConsumptionTWh")[0]?.textContent;
        const energyPerCapitaMWh = entry.getElementsByTagName("energyPerCapitaMWh")[0]?.textContent;
        
        if (!year || !country || !population || !energyConsumptionTWh || !energyPerCapitaMWh) {
          throw new Error('Missing required fields in XML entry');
        }
        
        data.push({
          year,
          country,
          population: parseFloat(population),
          populationInMillions: parseFloat(population) / 1000000,
          energyConsumptionTWh: parseFloat(energyConsumptionTWh),
          energyPerCapitaMWh: parseFloat(energyPerCapitaMWh)
        });
      }
      
      if (!validateDataFormat(data)) {
        throw new Error('Imported data validation failed');
      }
      
      successCallback(data);
    } catch (error) {
      errorCallback(error.message || 'Failed to parse XML file');
    }
  };
  
  reader.onerror = () => {
    errorCallback('Error reading file');
  };
  
  reader.readAsText(file);
}

function validateDataFormat(data) {
  if (!Array.isArray(data)) return false;
  if (data.length === 0) return false;
  
  const requiredFields = ['year', 'country', 'population', 'energyConsumptionTWh', 'energyPerCapitaMWh'];
  const sampleItem = data[0];
  
  return requiredFields.every(field => field in sampleItem);
}

function downloadFile(content, fileName, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}