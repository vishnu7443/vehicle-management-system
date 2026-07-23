import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Truck, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="navbar">
      <div className="navbar-title">
        <Truck size={24} color="#60a5fa" />
        <span>Vehicle Management System</span>
      </div>

      <div className="navbar-user">
        {user && (
          <>
            <div className="user-badge">
              <User size={16} color="#94a3b8" />
              <span>{user.username}</span>
              <span className={`role-pill ${user.role === 'Admin' ? 'role-admin' : 'role-staff'}`}>
                {user.role}
              </span>
            </div>

            <button onClick={logout} className="btn btn-secondary btn-sm" title="Log out">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
