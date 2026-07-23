import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import SearchBar from '../components/SearchBar';
import VehicleTable from '../components/VehicleTable';
import Modal from '../components/Modal';
import { Plus, RefreshCw } from 'lucide-react';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [fuel, setFuel] = useState('');
  const [status, setStatus] = useState('');

  // Sorting & Pagination State
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const navigate = useNavigate();

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (type) params.append('type', type);
      if (fuel) params.append('fuel', fuel);
      if (status) params.append('status', status);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('page', page);
      params.append('limit', 8);

      const res = await API.get(`/vehicles?${params.toString()}`);
      setVehicles(res.data.vehicles);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to fetch vehicle records.');
    } finally {
      setLoading(false);
    }
  }, [search, type, fuel, status, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleResetFilters = () => {
    setSearch('');
    setType('');
    setFuel('');
    setStatus('');
    setPage(1);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
    setPage(1);
  };

  const handleDeleteTrigger = (vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;
    try {
      await API.delete(`/vehicles/${vehicleToDelete.id}`);
      setDeleteModalOpen(false);
      setVehicleToDelete(null);
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting vehicle.');
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Vehicle Fleet Inventory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Manage, search, and edit vehicle records</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchVehicles} className="btn btn-secondary" title="Refresh list">
            <RefreshCw size={18} />
          </button>
          <button onClick={() => navigate('/add-vehicle')} className="btn btn-primary">
            <Plus size={18} />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <SearchBar
        search={search}
        setSearch={(val) => { setSearch(val); setPage(1); }}
        type={type}
        setType={(val) => { setType(val); setPage(1); }}
        fuel={fuel}
        setFuel={(val) => { setFuel(val); setPage(1); }}
        status={status}
        setStatus={(val) => { setStatus(val); setPage(1); }}
        onReset={handleResetFilters}
      />

      {/* Main Table */}
      {loading ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading inventory records...
        </div>
      ) : error ? (
        <div className="card" style={{ padding: '2rem', color: 'var(--danger)', textAlign: 'center' }}>
          {error}
        </div>
      ) : (
        <>
          <VehicleTable
            vehicles={vehicles}
            onDelete={handleDeleteTrigger}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

          {/* Pagination Controls */}
          <div className="pagination card" style={{ padding: '0.85rem 1.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Showing {vehicles.length} of {pagination.totalItems} vehicles (Page {pagination.currentPage} of {pagination.totalPages})
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="page-btn"
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="page-btn"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Confirm Delete Vehicle"
        message={`Are you sure you want to delete vehicle record "${vehicleToDelete?.vehicle_number} (${vehicleToDelete?.vehicle_name})"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Vehicles;
