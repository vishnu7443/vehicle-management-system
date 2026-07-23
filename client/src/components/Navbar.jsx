import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Truck, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = ({ onToggleMobile, isMobileOpen }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Mobile menu toggle button */}
        <button
          className="mobile-menu-btn"
          onClick={onToggleMobile}
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
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
