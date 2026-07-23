import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit3, Trash2, ArrowUpDown } from 'lucide-react';

const VehicleTable = ({ vehicles, onDelete, sortBy, sortOrder, onSort, userRole }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'active' || s === 'available') {
      return <span className="badge badge-active">Active</span>;
    } else if (s === 'in service') {
      return <span className="badge badge-in-service">In Service</span>;
    } else if (s === 'maintenance') {
      return <span className="badge badge-maintenance">Maintenance</span>;
    }
    return <span className="badge badge-active">{status}</span>;
  };

  const renderSortHeader = (label, colKey) => {
    const isCurrent = sortBy === colKey;
    return (
      <th
        onClick={() => onSort(colKey)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>{label}</span>
          <ArrowUpDown size={14} color={isCurrent ? '#3b82f6' : '#64748b'} />
        </div>
      </th>
    );
  };

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No vehicle records found matching the search/filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {renderSortHeader('Vehicle Number', 'vehicle_number')}
            {renderSortHeader('Name', 'vehicle_name')}
            {renderSortHeader('Brand', 'brand')}
            {renderSortHeader('Model', 'model')}
            {renderSortHeader('Type', 'type')}
            {renderSortHeader('Fuel', 'fuel')}
            {renderSortHeader('Year', 'manufacturing_year')}
            {renderSortHeader('Status', 'status')}
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id}>
              <td>
                <span
                  onClick={() => navigate(`/vehicles/${v.id}`)}
                  style={{ fontWeight: 700, color: '#60a5fa', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {v.vehicle_number}
                </span>
              </td>
              <td style={{ fontWeight: 600 }}>{v.vehicle_name}</td>
              <td>{v.brand}</td>
              <td>{v.model}</td>
              <td>{v.type}</td>
              <td>{v.fuel}</td>
              <td>{v.manufacturing_year}</td>
              <td>{getStatusBadge(v.status)}</td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => navigate(`/vehicles/${v.id}`)}
                    className="btn btn-secondary btn-sm"
                    title="View Details"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => navigate(`/vehicles/edit/${v.id}`)}
                    className="btn btn-secondary btn-sm"
                    title="Edit Record"
                  >
                    <Edit3 size={15} color="#60a5fa" />
                  </button>
                  <button
                    onClick={() => onDelete(v)}
                    className="btn btn-danger btn-sm"
                    title="Delete Record"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
