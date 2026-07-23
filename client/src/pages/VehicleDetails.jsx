import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import Modal from '../components/Modal';
import { ArrowLeft, Edit3, Trash2, Truck, Calendar, Fuel, ShieldCheck, Tag } from 'lucide-react';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await API.get(`/vehicles/${id}`);
        setVehicle(res.data.vehicle);
      } catch (err) {
        setError('Vehicle record not found or server error.');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleConfirmDelete = async () => {
    try {
      await API.delete(`/vehicles/${id}`);
      navigate('/vehicles');
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting vehicle.');
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'active' || s === 'available') {
      return <span className="badge badge-active">Active / Available</span>;
    } else if (s === 'in service') {
      return <span className="badge badge-in-service">In Service</span>;
    } else if (s === 'maintenance') {
      return <span className="badge badge-maintenance">Under Maintenance</span>;
    }
    return <span className="badge badge-active">{status}</span>;
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading vehicle record profile...
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="page-wrapper">
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>
          <p>{error || 'Vehicle not found.'}</p>
          <button onClick={() => navigate('/vehicles')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Back to Vehicle List
          </button>
        </div>
      </div>
    );
  }

  const formattedRegDate = vehicle.registration_date
    ? new Date(vehicle.registration_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <div className="page-wrapper">
      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button onClick={() => navigate('/vehicles')} className="btn btn-secondary">
          <ArrowLeft size={18} />
          <span>Back to List</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)} className="btn btn-secondary">
            <Edit3 size={18} color="#60a5fa" />
            <span>Edit Vehicle</span>
          </button>
          <button onClick={() => setDeleteModalOpen(true)} className="btn btn-danger">
            <Trash2 size={18} />
            <span>Delete Vehicle</span>
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="card" style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-card-border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Truck size={32} color="#3b82f6" />
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{vehicle.vehicle_name}</h1>
            </div>
            <p style={{ color: '#60a5fa', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.05em' }}>
              {vehicle.vehicle_number}
            </p>
          </div>

          <div>{getStatusBadge(vehicle.status)}</div>
        </div>

        {/* Details Grid */}
        <div className="form-grid" style={{ gap: '2rem' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-card-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
              <Tag size={16} />
              <span>Brand / Manufacturer</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{vehicle.brand}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-card-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
              <Truck size={16} />
              <span>Model & Type</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{vehicle.model} ({vehicle.type})</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-card-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
              <Fuel size={16} />
              <span>Fuel Type</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{vehicle.fuel}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-card-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
              <Calendar size={16} />
              <span>Manufacturing Year</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{vehicle.manufacturing_year}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-card-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
              <Calendar size={16} />
              <span>Registration Date</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{formattedRegDate}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-card-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} />
              <span>Operational Status</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{vehicle.status}</div>
          </div>

        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Delete Vehicle Record"
        message={`Are you sure you want to delete vehicle record "${vehicle.vehicle_number}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default VehicleDetails;
