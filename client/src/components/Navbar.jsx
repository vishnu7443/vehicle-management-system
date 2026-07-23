import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Truck, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = ({ onToggleSidebar, isMobileOpen, isCollapsed }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Sidebar Toggle Button */}
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar menu"
          title="Toggle Sidebar"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="navbar-title">
          <Truck size={22} color="#3b82f6" className="navbar-logo-icon" />
          <span className="brand-text-desktop">Vehicle Management System</span>
          <span className="brand-text-mobile">VMS</span>
        </div>
      </div>

      <div className="navbar-user">
        {user && (
          <>
            <div className="user-badge">
              <User size={15} color="#94a3b8" />
              <span className="user-name-desktop">{user.username}</span>
              <span className={`role-pill ${user.role === 'Admin' ? 'role-admin' : 'role-staff'}`}>
                {user.role}
              </span>
            </div>

            <button onClick={logout} className="btn btn-secondary btn-sm navbar-logout" title="Log out">
              <LogOut size={15} />
              <span className="logout-text-desktop">Logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
