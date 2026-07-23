import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, PlusCircle, ShieldCheck } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Truck size={28} color="#3b82f6" />
        <span>VMS Hub</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/vehicles"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Truck size={20} />
          <span>Vehicle Module</span>
        </NavLink>

        <NavLink
          to="/add-vehicle"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <PlusCircle size={20} />
          <span>Add Vehicle</span>
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem 0.5rem', borderTop: '1px solid var(--bg-card-border)', fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldCheck size={16} color="#10b981" />
        <span>System Status: Online</span>
      </div>
    </aside>
  );
};

export default Sidebar;
