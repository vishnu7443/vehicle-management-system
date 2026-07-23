import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import AddVehicle from './pages/AddVehicle';
import EditVehicle from './pages/EditVehicle';
import VehicleDetails from './pages/VehicleDetails';

const MainLayout = ({ children }) => {
  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);
  // Desktop collapsed state
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const toggleSidebar = () => {
    // On small screens, toggle mobile drawer. On desktop, toggle collapsed mode.
    if (window.innerWidth <= 992) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopCollapsed(!desktopCollapsed);
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className={`app-container ${desktopCollapsed ? 'sidebar-collapsed-layout' : ''}`}>
      {/* Mobile backdrop */}
      {mobileOpen && <div className="sidebar-backdrop" onClick={closeMobile}></div>}

      <Sidebar
        isMobileOpen={mobileOpen}
        isCollapsed={desktopCollapsed}
        onClose={closeMobile}
      />

      <div className="main-content">
        <Navbar
          onToggleSidebar={toggleSidebar}
          isMobileOpen={mobileOpen}
          isCollapsed={desktopCollapsed}
        />
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/vehicles"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Vehicles />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-vehicle"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AddVehicle />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/vehicles/edit/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <EditVehicle />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/vehicles/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <VehicleDetails />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
