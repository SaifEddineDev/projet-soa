import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogout.css';

const AdminLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Effectuer la déconnexion automatique après 2 secondes
    const timer = setTimeout(() => {
      // Supprimer toutes les données
      localStorage.removeItem('admin_user');
      localStorage.removeItem('hotel_auth_token');
      localStorage.removeItem('hotel_user_data');
      localStorage.removeItem('hotel_remember_me');
      
      // Rediriger vers la page de connexion
      navigate('/admin/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogoutNow = () => {
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="logout-container">
      <div className="logout-card">
        <div className="logout-icon-large">👋</div>
        <h2>Déconnexion en cours...</h2>
        <p className="logout-message">
          Vous allez être déconnecté de l'interface d'administration.
        </p>
        
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
        
        <div className="logout-actions">
          <button onClick={handleLogoutNow} className="logout-now-btn">
            Déconnexion immédiate
          </button>
          <button onClick={handleCancel} className="cancel-btn">
            Annuler
          </button>
        </div>
        
        <div className="logout-info">
          <p>
            <span className="info-icon">ℹ️</span>
            Vous serez redirigé vers la page de connexion dans quelques secondes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogout;