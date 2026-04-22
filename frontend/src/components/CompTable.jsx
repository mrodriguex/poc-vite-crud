import React from 'react';

const COLUMNS = [
  { key: 'PropertyName', label: 'Property Name' },
  { key: 'Address', label: 'Address' },
  { key: 'CityMunicipality', label: 'City' },
  { key: 'County', label: 'County' },
  { key: 'State', label: 'State' },
  { key: 'ZipCode', label: 'Zip' },
  { key: 'SaleDate', label: 'Sale Date' },
  { key: 'SalePrice', label: 'Sale Price' },
  { key: 'NumberOfAcres', label: 'Acres' },
  { key: 'NumberOfUnits', label: 'Units' },
  { key: 'Seller', label: 'Seller' },
  { key: 'Buyer', label: 'Buyer' },
];

const SORTABLE = new Set(COLUMNS.map(c => c.key));

function formatValue(key, val) {
  if (val === null || val === undefined || val === '') return '—';
  if (key === 'SaleDate') return val.split('T')[0];
  if (key === 'SalePrice' || key === 'PricePerAcre' || key === 'PricePerUnit') {
    return Number(val).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  }
  return val;
}

export default function CompTable({ comps, sortBy, sortDir, onSort, onEdit, onDelete }) {
  function handleSort(key) {
    if (!SORTABLE.has(key)) return;
    if (sortBy === key) {
      onSort(key, sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(key, 'asc');
    }
  }

  function sortIndicator(key) {
    if (sortBy !== key) return null;
    return <span className="sort-indicator">{sortDir === 'asc' ? ' ▲' : ' ▼'}</span>;
  }

  if (comps.length === 0) {
    return <p className="empty-state">No records found. Try adjusting your filters or add a new comp.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="comp-table">
        <thead>
          <tr>
            {COLUMNS.map(col => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className={SORTABLE.has(col.key) ? 'sortable' : ''}
              >
                {col.label}{sortIndicator(col.key)}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comps.map(comp => (
            <tr key={comp.id}>
              {COLUMNS.map(col => (
                <td key={col.key}>{formatValue(col.key, comp[col.key])}</td>
              ))}
              <td className="actions-cell">
                <button className="btn-edit" onClick={() => onEdit(comp)}>Edit</button>
                <button className="btn-delete" onClick={() => onDelete(comp)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
