export default function YearRangeInput({
  startYear,
  endYear,
  onStartYearChange,
  onEndYearChange
}) {
  return (
    <div className="input-range">
      <div className="input-group">
        <label htmlFor="start-year">From:</label>
        <input
          type="number"
          id="start-year"
          min="2000"
          max="2023"
          onKeyDown={(e) => e.preventDefault()}
          value={startYear}
          onChange={(e) => onStartYearChange(parseInt(e.target.value))}
        />
      </div>

      <div className="input-group">
        <label htmlFor="end-year">To:</label>
        <input
          type="number"
          id="end-year"
          min="2000"
          max="2023"
          onKeyDown={(e) => e.preventDefault()}
          value={endYear}
          onChange={(e) => onEndYearChange(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
}