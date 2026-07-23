import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import VehicleTable from '../components/VehicleTable';
import Modal from '../components/Modal';
import { Truck, CheckCircle2, Wrench, Users, Plus, Search, AlertCircle, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    inServiceVehicles: 0,
    maintenanceVehicles: 0,
    totalDrivers: 0
  });
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsRes = await API.get('/vehicles/stats');
      setStats(statsRes.data.stats);

      const recentRes = await API.get('/vehicles?limit=5&sortBy=created_at&sortOrder=DESC');
      setRecentVehicles(recentRes.data.vehicles);
    } catch (err) {
      console.error('Dashboard data error:', err);
      setError('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting vehicle.');
    }
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Fleet Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Real-time overview of vehicle operational status</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchData} className="btn btn-secondary" title="Refresh Dashboard">
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
          <button onClick={() => navigate('/add-vehicle')} className="btn btn-primary">
            <Plus size={18} />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-md)', padding: '1rem', color: 'var(--danger)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
            <Truck size={28} />
          </div>
          <div>
            <div className="stat-val">{loading ? '...' : stats.totalVehicles}</div>
            <div className="stat-label">Total Vehicles</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
            <CheckCircle2 size={28} />
          </div>
          <div>
            <div className="stat-val">{loading ? '...' : stats.availableVehicles}</div>
            <div className="stat-label">Available Vehicles</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
            <Wrench size={28} />
          </div>
          <div>
            <div className="stat-val">{loading ? '...' : stats.maintenanceVehicles}</div>
            <div className="stat-label">Under Maintenance</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
            <Users size={28} />
          </div>
          <div>
            <div className="stat-val">{loading ? '...' : stats.totalDrivers}</div>
            <div className="stat-label">Assigned Drivers</div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Search Launcher */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem 1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem' }}>Quick Fleet Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/add-vehicle')} className="btn btn-secondary">
            <Plus size={18} color="#60a5fa" />
            <span>New Vehicle Entry</span>
          </button>
          <button onClick={() => navigate('/vehicles')} className="btn btn-secondary">
            <Search size={18} color="#c084fc" />
            <span>Search Fleet Database</span>
          </button>
        </div>
      </div>

      {/* Recent Vehicles Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Vehicle Registrations</h2>
        <button onClick={() => navigate('/vehicles')} className="btn btn-secondary btn-sm">
          View All Vehicles →
        </button>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading vehicle inventory...
        </div>
      ) : (
        <VehicleTable
          vehicles={recentVehicles}
          onDelete={handleDeleteTrigger}
          sortBy="created_at"
          sortOrder="DESC"
          onSort={() => {}}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Confirm Vehicle Deletion"
        message={`Are you sure you want to delete vehicle record "${vehicleToDelete?.vehicle_number} (${vehicleToDelete?.vehicle_name})"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
