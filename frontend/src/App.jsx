import React, { useState, useEffect, useCallback } from 'react';
import { fetchComps, fetchAllComps, createComp, updateComp, deleteComp } from './api/comps';
import FilterBar, { EMPTY_FILTERS } from './components/FilterBar';
import CompTable from './components/CompTable';
import CompModal from './components/CompModal';

const CSV_COLUMNS = [
  'id', 'PropertyName', 'Address', 'CityMunicipality', 'County', 'State',
  'ZipCode', 'ZoningDescription', 'Seller', 'Buyer', 'SaleDate', 'SalePrice',
  'NumberOfAcres', 'NumberOfUnits', 'PricePerAcre', 'PricePerUnit',
  'SaleRemarks', 'PropertyRemarks', 'Latitude', 'Longitude',
];

function escapeCsv(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function exportToCsv(comps) {
  const header = CSV_COLUMNS.join(',');
  const rows = comps.map(c => CSV_COLUMNS.map(col => escapeCsv(c[col])).join(','));
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'comps.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [comps, setComps] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadComps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, total } = await fetchComps(filters, sortBy, sortDir, page);
      setComps(data);
      setTotalCount(total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortDir, page]);

  useEffect(() => {
    loadComps();
  }, [loadComps]);

  function handleSort(col, dir) {
    setSortBy(col);
    setSortDir(dir);
    setPage(1);
  }

  function handleFiltersChange(newFilters) {
    setFilters(newFilters);
    setPage(1);
  }

  function handleFiltersReset() {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }

  async function handleExportCsv() {
    try {
      const { data } = await fetchAllComps(filters, sortBy, sortDir);
      exportToCsv(data);
    } catch (err) {
      alert(err.message);
    }
  }

  function openAdd() {
    setEditingComp(null);
    setModalOpen(true);
  }

  function openEdit(comp) {
    setEditingComp(comp);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingComp(null);
  }

  async function handleSave(data) {
    try {
      if (editingComp) {
        await updateComp(editingComp.id, data);
      } else {
        await createComp(data);
      }
      closeModal();
      loadComps();
    } catch (err) {
      alert(err.message);
    }
  }

  function confirmDelete(comp) {
    setDeleteTarget(comp);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteComp(deleteTarget.id);
      setDeleteTarget(null);
      loadComps();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Comps Manager</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={openAdd}>+ Add Comp</button>
          <button className="btn-secondary" onClick={handleExportCsv} disabled={totalCount === 0}>
            Export CSV
          </button>
        </div>
      </header>

      <main className="app-main">
        <FilterBar
          filters={filters}
          onChange={handleFiltersChange}
          onReset={handleFiltersReset}
        />

        {error && <div className="error-banner">Error: {error}</div>}

        <div className="table-meta">
          {!loading && <span>{totalCount} record{totalCount !== 1 ? 's' : ''} found</span>}
          {loading && <span className="loading">Loading…</span>}
        </div>

        <CompTable
          comps={comps}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          onEdit={openEdit}
          onDelete={confirmDelete}
          page={page}
          totalCount={totalCount}
          pageSize={5}
          onPageChange={setPage}
        />
      </main>

      {modalOpen && (
        <CompModal
          comp={editingComp}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal modal-confirm" onClick={e => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <p>
              Delete <strong>{deleteTarget.PropertyName || deleteTarget.Address || `#${deleteTarget.id}`}</strong>?
              This action cannot be undone.
            </p>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
