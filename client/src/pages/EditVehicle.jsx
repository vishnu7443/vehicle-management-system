import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicle_number: '',
    vehicle_name: '',
    brand: '',
    model: '',
    type: 'Truck',
    fuel: 'Diesel',
    manufacturing_year: '',
    registration_date: '',
    status: 'Active'
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const res = await API.get(`/vehicles/${id}`);
        const v = res.data.vehicle;
        
        // Format date string for HTML date input (YYYY-MM-DD)
        let formattedDate = '';
        if (v.registration_date) {
          formattedDate = new Date(v.registration_date).toISOString().split('T')[0];
        }

        setFormData({
          vehicle_number: v.vehicle_number || '',
          vehicle_name: v.vehicle_name || '',
          brand: v.brand || '',
          model: v.model || '',
          type: v.type || 'Truck',
          fuel: v.fuel || 'Diesel',
          manufacturing_year: v.manufacturing_year || '',
          registration_date: formattedDate,
          status: v.status || 'Active'
        });
      } catch (err) {
        setErrorMsg('Failed to load vehicle record details.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      await API.put(`/vehicles/${id}`, formData);
      navigate('/vehicles');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update vehicle record.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading vehicle record details...
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/vehicles')} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Inventory</span>
        </button>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Edit Vehicle #{formData.vehicle_number}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Update vehicle specifications or operational status</p>
        </div>
      </div>

      {errorMsg && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-md)', padding: '1rem', color: 'var(--danger)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="card" style={{ maxWidth: '900px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            {/* Vehicle Number */}
            <div className="form-group">
              <label className="form-label">Vehicle Number / License Plate *</label>
              <input
                type="text"
                name="vehicle_number"
                value={formData.vehicle_number}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Vehicle Name */}
            <div className="form-group">
              <label className="form-label">Vehicle Display Name *</label>
              <input
                type="text"
                name="vehicle_name"
                value={formData.vehicle_name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Brand */}
            <div className="form-group">
              <label className="form-label">Brand / Manufacturer *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Model */}
            <div className="form-group">
              <label className="form-label">Model Name *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Vehicle Type */}
            <div className="form-group">
              <label className="form-label">Vehicle Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Truck">Truck</option>
                <option value="Pickup">Pickup</option>
                <option value="Van">Van</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Bus">Bus</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div className="form-group">
              <label className="form-label">Fuel Type *</label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="Electric">Electric</option>
                <option value="CNG">CNG</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Manufacturing Year */}
            <div className="form-group">
              <label className="form-label">Manufacturing Year *</label>
              <input
                type="number"
                name="manufacturing_year"
                value={formData.manufacturing_year}
                onChange={handleChange}
                className="form-input"
                min="1900"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            {/* Registration Date */}
            <div className="form-group">
              <label className="form-label">Registration Date *</label>
              <input
                type="date"
                name="registration_date"
                value={formData.registration_date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Operational Status */}
            <div className="form-group">
              <label className="form-label">Operational Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Active">Active / Available</option>
                <option value="In Service">In Service</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--bg-card-border)' }}>
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              <Save size={18} />
              <span>{submitting ? 'Updating...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicle;
