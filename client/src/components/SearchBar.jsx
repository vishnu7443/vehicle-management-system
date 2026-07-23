import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

const SearchBar = ({ search, setSearch, type, setType, fuel, setFuel, status, setStatus, onReset }) => {
  return (
    <div className="filter-bar card" style={{ padding: '1rem' }}>
      {/* Search Input */}
      <div className="search-input-wrapper">
        <Search size={18} color="#94a3b8" />
        <input
          type="text"
          placeholder="Search by Vehicle Number, Brand, or Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Type Filter */}
      <div style={{ minWidth: '150px' }}>
        <select
          className="form-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Truck">Truck</option>
          <option value="Pickup">Pickup</option>
          <option value="Van">Van</option>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Bus">Bus</option>
        </select>
      </div>

      {/* Fuel Filter */}
      <div style={{ minWidth: '150px' }}>
        <select
          className="form-select"
          value={fuel}
          onChange={(e) => setFuel(e.target.value)}
        >
          <option value="">All Fuel Types</option>
          <option value="Diesel">Diesel</option>
          <option value="Petrol">Petrol</option>
          <option value="Electric">Electric</option>
          <option value="CNG">CNG</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      {/* Status Filter */}
      <div style={{ minWidth: '160px' }}>
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active / Available</option>
          <option value="In Service">In Service</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>

      {/* Reset Filters */}
      <button onClick={onReset} className="btn btn-secondary btn-sm" title="Reset Filters">
        <RotateCcw size={16} />
        <span>Reset</span>
      </button>
    </div>
  );
};

export default SearchBar;
