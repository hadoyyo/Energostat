export default function DataTable({ data }) {
  if (data.length === 0) {
    return (
      <div className="data-display">
        <h2>Data Table</h2>
        <div className="table-container">
          <table id="data-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Population</th>
                <th>Energy Consumption (TWh)</th>
                <th>Consumption per Capita (MWh)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="no-data">
                <td colspan="4">No data available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="data-display">
      <h3>Data Table</h3>
      <div className="table-container">
        <table id="data-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Population</th>
              <th>Energy Consumption (TWh)</th>
              <th>Consumption per Capita (MWh)</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.year}>
                <td>{item.year}</td>
                <td>{item.population ? Math.round(item.population).toLocaleString() : 'N/A'}</td>
                <td>{item.energyConsumptionTWh ? item.energyConsumptionTWh.toFixed(2) : 'N/A'}</td>
                <td>{item.energyPerCapitaMWh ? item.energyPerCapitaMWh.toFixed(2) : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}