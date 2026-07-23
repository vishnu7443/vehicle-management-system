import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, PlusCircle, ShieldCheck, X } from 'lucide-react';

const Sidebar = ({ isMobileOpen, isCollapsed, onClose }) => {
  return (
    <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Truck size={28} color="#3b82f6" />
          <span className="logo-text">VMS Hub</span>
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
          title="Dashboard"
        >
          <LayoutDashboard size={20} className="nav-icon" />
          <span className="link-text">Dashboard</span>
        </NavLink>

        <NavLink
          to="/vehicles"
          onClick={onClose}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          title="Vehicle Module"
        >
          <Truck size={20} className="nav-icon" />
          <span className="link-text">Vehicle Module</span>
        </NavLink>

        <NavLink
          to="/add-vehicle"
          onClick={onClose}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          title="Add Vehicle"
        >
          <PlusCircle size={20} className="nav-icon" />
          <span className="link-text">Add Vehicle</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <ShieldCheck size={16} color="#10b981" className="nav-icon" />
        <span className="link-text">System Status: Online</span>
      </div>
    </aside>
  );
};

export default Sidebar;
