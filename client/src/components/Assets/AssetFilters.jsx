export default function AssetFilters({
  filters = {},
  onFilterChange,
  categories = [],
  statuses = [],
  departments = [],
  locations = [],
  conditions = [],
}) {
  const update = (key, value) => {
    onFilterChange?.(key, value);
  };

  const renderSelect = (label, key, options, placeholder = "All") => (
    <label className="asset-filter-field">
      <span>{label}</span>
      <select
        value={filters[key] || ""}
        onChange={(event) => update(key, event.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="asset-filters-card">
      <div className="asset-filters-head">
        <h3>Filters</h3>
        <button
          type="button"
          className="asset-link-btn"
          onClick={() => onFilterChange?.("reset", null)}
        >
          Reset
        </button>
      </div>

      <div className="asset-filters-grid">
        {renderSelect("Category", "category", categories)}
        {renderSelect("Status", "status", statuses)}
        {renderSelect("Department", "department", departments)}
        {renderSelect("Location", "location", locations)}
        {renderSelect("Condition", "condition", conditions)}
      </div>
    </div>
  );
}
