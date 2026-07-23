import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, PlusCircle, ShieldCheck, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Truck size={28} color="#3b82f6" />
          <span>VMS Hub</span>
        </div>
        
        {/* Mobile close button */}
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          onClick={onClose}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/vehicles"
          onClick={onClose}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Truck size={20} />
          <span>Vehicle Module</span>
        </NavLink>

        <NavLink
          to="/add-vehicle"
          onClick={onClose}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <PlusCircle size={20} />
          <span>Add Vehicle</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <ShieldCheck size={16} color="#10b981" />
        <span>System Status: Online</span>
      </div>
    </aside>
  );
};

export default Sidebar;
