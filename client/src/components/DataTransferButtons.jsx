import { exportToJSON, exportToXML, importFromJSON, importFromXML } from '../services/dataExport';

export default function DataTransferButtons({ data, onDataImported, onImportError }) {
  const handleExportJSON = () => {
    if (data.length === 0) return;
    exportToJSON(data);
  };

  const handleExportXML = () => {
    if (data.length === 0) return;
    exportToXML(data);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      importFromJSON(file, (importedData) => {
        onDataImported(importedData);
      }, (error) => {
        onImportError(error.message);
      });
    } catch (error) {
      onImportError(error.message);
    }
    e.target.value = '';
  };

  const handleImportXML = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      importFromXML(file, (importedData) => {
        onDataImported(importedData);
      }, (error) => {
        onImportError(error.message);
      });
    } catch (error) {
      onImportError(error.message);
    }
    e.target.value = '';
  };

  return (
    <div className="data-transfer-options">
      <h3>Data Transfer</h3>
      <div className="transfer-buttons">
        <div className="export-section">
          <h4>Export</h4>
          <div className="export-buttons">
            <button onClick={handleExportJSON} className="export-btn">
              Export JSON
            </button>
            <button onClick={handleExportXML} className="export-btn">
              Export XML
            </button>
          </div>
        </div>
        
        <div className="import-section">
          <h4>Import</h4>
          <div className="import-buttons">
            <label htmlFor="import-json" className="import-btn">
              Import JSON
              <input 
                id="import-json" 
                type="file" 
                accept=".json,application/json" 
                onChange={handleImportJSON}
                style={{ display: 'none' }}
              />
            </label>
            
            <label htmlFor="import-xml" className="import-btn">
              Import XML
              <input 
                id="import-xml" 
                type="file" 
                accept=".xml,application/xml" 
                onChange={handleImportXML}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}