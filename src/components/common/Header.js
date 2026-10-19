import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const displayName = user?.firstName || user?.name || user?.email?.split('@')[0] || 'Voyageur';
  const avatarLetter = user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'V';

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
              src={`${process.env.PUBLIC_URL || ''}/logo1.png`}
              alt="TravelHub Logo" 
              className="logo-image"
            />
            <h1>TravelHub++</h1>
          </Link>
        </div>
        
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? '×' : '☰'}
        </button>

        <nav id="primary-navigation" className={`nav-menu${menuOpen ? ' is-open' : ''}`} aria-label="Navigation principale">
          <ul>
            <li><NavLink end to="/" onClick={closeMenu}>Accueil</NavLink></li>
            <li><NavLink to="/hotels" onClick={closeMenu}>Hôtels</NavLink></li>
            <li><NavLink to="/taxis" onClick={closeMenu}>Taxis</NavLink></li>
            <li><NavLink to="/voyages" onClick={closeMenu}>Voyages</NavLink></li>
            <li><NavLink to="/reservations" onClick={closeMenu}>Mes réservations</NavLink></li>
            {user && <li><NavLink to="/profile" onClick={closeMenu}>Mon profil</NavLink></li>}
            <li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li>
          </ul>
        </nav>

        <div className="auth-section">
          {user ? (
            <div className="user-info">
              <div className="user-avatar">
                <span className="avatar-circle">
                  {avatarLetter.toUpperCase()}
                </span>
              </div>
              <div className="user-details">
                <span className="user-greeting">Bonjour,</span>
                <span className="user-name">{displayName}</span>
              </div>
              <button onClick={handleLogout} className='logout-btn'>Déconnexion</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login" onClick={closeMenu}>Connexion</Link>
              <Link to="/register" className="btn-register" onClick={closeMenu}>Inscription</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

