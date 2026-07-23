import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Truck, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = ({ onToggleSidebar, isMobileOpen, isCollapsed }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Universal Menu Toggle Button (Laptops, Desktops, Tablets & Mobile) */}
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar menu"
          title="Toggle Sidebar"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="navbar-title">
          <Truck size={24} color="#60a5fa" />
          <span className="navbar-title-text">Vehicle Management System</span>
          <span className="navbar-title-short">VMS</span>
        </div>
      </div>

      <div className="navbar-user">
        {user && (
          <>
            <div className="user-badge">
              <User size={16} color="#94a3b8" />
              <span className="user-name">{user.username}</span>
              <span className={`role-pill ${user.role === 'Admin' ? 'role-admin' : 'role-staff'}`}>
                {user.role}
              </span>
            </div>

            <button onClick={logout} className="btn btn-secondary btn-sm navbar-logout" title="Log out">
              <LogOut size={16} />
              <span className="logout-text">Logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
