import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img 
              src="\logo1.png" 
              alt="TravelHub Logo" 
              className="logo-image"
            />
            <h1>TravelHub++</h1>
          </Link>
        </div>
        
        <nav className="nav-menu">
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/hotels">Hôtels</Link></li>
            <li><Link to="/taxis">Taxis</Link></li>
            <li><Link to="/voyages">Voyages</Link></li>
            <li><Link to="/reservations">MesRéservations</Link></li>
            {user && <li><Link to="/profile">MonProfil</Link></li>}
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <div className="auth-section">
          {user ? (
            <div className="user-info">
              <span>Bonjour, {user.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Connexion</Link>
              <Link to="/register" className="btn-register">Inscription</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;