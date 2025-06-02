// src/services/dataExport.js
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