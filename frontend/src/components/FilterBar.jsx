import React from 'react';

const EMPTY_FILTERS = {
  address: '',
  city: '',
  county: '',
  state: '',
  zipCode: '',
  saleDateFrom: '',
  saleDateTo: '',
  salePriceMin: '',
  salePriceMax: '',
};

export default function FilterBar({ filters, onChange, onReset }) {
  function handleChange(e) {
    onChange({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <label>
          Address
          <input name="address" value={filters.address} onChange={handleChange} placeholder="Filter by address" />
        </label>
        <label>
          City
          <input name="city" value={filters.city} onChange={handleChange} placeholder="Filter by city" />
        </label>
        <label>
          County
          <input name="county" value={filters.county} onChange={handleChange} placeholder="Filter by county" />
        </label>
        <label>
          State
          <input name="state" value={filters.state} onChange={handleChange} placeholder="e.g. TX" maxLength={2} />
        </label>
        <label>
          Zip Code
          <input name="zipCode" value={filters.zipCode} onChange={handleChange} placeholder="Filter by zip" />
        </label>
      </div>
      <div className="filter-row">
        <label>
          Sale Date From
          <input type="date" name="saleDateFrom" value={filters.saleDateFrom} onChange={handleChange} />
        </label>
        <label>
          Sale Date To
          <input type="date" name="saleDateTo" value={filters.saleDateTo} onChange={handleChange} />
        </label>
        <label>
          Sale Price Min
          <input type="number" name="salePriceMin" value={filters.salePriceMin} onChange={handleChange} placeholder="0" min="0" />
        </label>
        <label>
          Sale Price Max
          <input type="number" name="salePriceMax" value={filters.salePriceMax} onChange={handleChange} placeholder="∞" min="0" />
        </label>
      </div>
      <div className="filter-actions">
        <button className="btn-secondary" onClick={onReset}>Reset Filters</button>
      </div>
    </div>
  );
}

export { EMPTY_FILTERS };
