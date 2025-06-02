import { exportToJSON, exportToXML } from '../services/dataExport';

export default function ExportButtons({ data }) {
  const handleExportJSON = () => {
    if (data.length === 0) return;
    exportToJSON(data);
  };

  const handleExportXML = () => {
    if (data.length === 0) return;
    exportToXML(data);
  };

  return (
    <div className="export-options">
      <h2>Export Data</h2>
      <div className="export-buttons">
        <button onClick={handleExportJSON} className="export-btn">
          Export as JSON
        </button>
        <button onClick={handleExportXML} className="export-btn">
          Export as XML
        </button>
      </div>
    </div>
  );
}