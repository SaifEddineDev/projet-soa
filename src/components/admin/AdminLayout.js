// src/admin/components/AdminLayout.js
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: '📊', path: '/admin' },
    { id: 'hotels', label: 'Hôtels', icon: '🏨', path: '/admin/hotels' },
    { id: 'reservations', label: 'Réservations', icon: '📅', path: '/admin/reservations' },
    { id: 'users', label: 'Utilisateurs', icon: '👥', path: '/admin/users' },
    { id: 'reviews', label: 'Avis', icon: '⭐', path: '/admin/reviews' },
    { id: 'analytics', label: 'Analytique', icon: '📈', path: '/admin/analytics' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️', path: '/admin/settings' },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <h2>🏨 Admin</h2>
            <span className="version">v2.0</span>
          </div>
          <button 
            className="sidebar-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            <span>{user?.firstName?.charAt(0) || 'A'}</span>
          </div>
          <div className="user-info">
            <h4>{user?.firstName} {user?.lastName}</h4>
            <span className="user-role">Administrateur</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="nav-item"
              activeclassname="active"
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="icon">🚪</span>
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <h1>Tableau de bord Admin</h1>
            <p className="welcome-text">Bonjour, {user?.firstName} ! 👋</p>
          </div>
          
          <div className="header-right">
            <div className="header-actions">
              <button className="notification-btn">
                <span className="icon">🔔</span>
                <span className="badge">3</span>
              </button>
              <div className="date-display">
                {new Date().toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;