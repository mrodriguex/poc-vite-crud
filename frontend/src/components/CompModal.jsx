import React, { useEffect, useState } from 'react';

const FIELDS = [
  { key: 'PropertyName', label: 'Property Name' },
  { key: 'Address', label: 'Address' },
  { key: 'CityMunicipality', label: 'City/Municipality' },
  { key: 'County', label: 'County' },
  { key: 'State', label: 'State' },
  { key: 'ZipCode', label: 'Zip Code' },
  { key: 'ZoningDescription', label: 'Zoning Description' },
  { key: 'Seller', label: 'Seller' },
  { key: 'Buyer', label: 'Buyer' },
  { key: 'SaleDate', label: 'Sale Date', type: 'date' },
  { key: 'SalePrice', label: 'Sale Price', type: 'number' },
  { key: 'NumberOfAcres', label: 'Number of Acres', type: 'number' },
  { key: 'NumberOfUnits', label: 'Number of Units', type: 'number' },
  { key: 'PricePerAcre', label: 'Price Per Acre', type: 'number' },
  { key: 'PricePerUnit', label: 'Price Per Unit', type: 'number' },
  { key: 'SaleRemarks', label: 'Sale Remarks', type: 'textarea' },
  { key: 'PropertyRemarks', label: 'Property Remarks', type: 'textarea' },
  { key: 'Latitude', label: 'Latitude', type: 'number' },
  { key: 'Longitude', label: 'Longitude', type: 'number' },
];

function emptyForm() {
  return FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {});
}

export default function CompModal({ comp, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm());
  const isEdit = Boolean(comp);

  useEffect(() => {
    if (comp) {
      const data = { ...emptyForm() };
      FIELDS.forEach(f => {
        const val = comp[f.key];
        data[f.key] = val === null || val === undefined ? '' : String(val);
      });
      // Format date for input[type=date]
      if (data.SaleDate && data.SaleDate.includes('T')) {
        data.SaleDate = data.SaleDate.split('T')[0];
      }
      setForm(data);
    }
  }, [comp]);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Convert numeric fields to numbers / null
    const payload = { ...form };
    ['SalePrice', 'NumberOfAcres', 'NumberOfUnits', 'PricePerAcre', 'PricePerUnit', 'Latitude', 'Longitude'].forEach(k => {
      payload[k] = payload[k] !== '' ? parseFloat(payload[k]) : null;
    });
    ['SaleDate'].forEach(k => {
      payload[k] = payload[k] !== '' ? payload[k] : null;
    });
    onSave(payload);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Comp' : 'Add New Comp'}</h2>
          <button className="btn-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form className="comp-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {FIELDS.map(f => (
              <label key={f.key} className={f.type === 'textarea' ? 'full-width' : ''}>
                {f.label}
                {f.type === 'textarea' ? (
                  <textarea name={f.key} value={form[f.key]} onChange={handleChange} rows={3} />
                ) : (
                  <input
                    type={f.type || 'text'}
                    name={f.key}
                    value={form[f.key]}
                    onChange={handleChange}
                    step={f.type === 'number' ? 'any' : undefined}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{isEdit ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
