export default function YearRangeInput({ 
  startYear, 
  endYear, 
  onStartYearChange, 
  onEndYearChange 
}) {
  return (
    <div className="input-range">
      <div className="input-group">
        <label htmlFor="start-year">Start Year:</label>
        <input 
          type="number" 
          id="start-year" 
          min="1960" 
          max="2023" 
          value={startYear}
          onChange={(e) => onStartYearChange(parseInt(e.target.value))}
        />
      </div>
      
      <div className="input-group">
        <label htmlFor="end-year">End Year:</label>
        <input 
          type="number" 
          id="end-year" 
          min="1960" 
          max="2023" 
          value={endYear}
          onChange={(e) => onEndYearChange(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
}