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
    closeMenu();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="brand" aria-label="TravelHub, accueil" onClick={closeMenu}>
          <img src={`${process.env.PUBLIC_URL || ''}/favion-transparent.png`} alt="" className="brand-logo" />
          <span className="brand-copy"><strong>TravelHub</strong><small>Le voyage en toute simplicité</small></span>
        </Link>

        <button type="button" className={`mobile-menu-toggle${menuOpen ? ' is-open' : ''}`} aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span /><span /><span />
        </button>

        <nav id="primary-navigation" className={`nav-menu${menuOpen ? ' is-open' : ''}`} aria-label="Navigation principale">
          <ul>
            <li><NavLink end to="/" onClick={closeMenu}>Accueil</NavLink></li>
            <li><NavLink to="/hotels" onClick={closeMenu}>Hôtels</NavLink></li>
            <li><NavLink to="/taxis" onClick={closeMenu}>Taxis</NavLink></li>
            <li><NavLink to="/voyages" onClick={closeMenu}>Voyages</NavLink></li>
            <li><NavLink to="/reservations" onClick={closeMenu}>Réservations</NavLink></li>
            <li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li>
            {user && <li className="mobile-only-nav"><NavLink to="/profile" onClick={closeMenu}>Mon profil</NavLink></li>}
            {!user && <li className="mobile-only-nav"><Link to="/login" onClick={closeMenu}>Connexion</Link></li>}
            {!user && <li className="mobile-only-nav"><Link to="/register" className="mobile-signup-link" onClick={closeMenu}>Créer un compte</Link></li>}
            {user && <li className="mobile-only-nav"><button type="button" className="mobile-logout-link" onClick={handleLogout}>Déconnexion</button></li>}
          </ul>
        </nav>

        <div className="auth-section">
          {user ? (
            <div className="user-info">
              <span className="avatar-circle" aria-hidden="true">{avatarLetter.toUpperCase()}</span>
              <div className="user-details"><span className="user-greeting">Bonjour</span><span className="user-name">{displayName}</span></div>
              <button type="button" onClick={handleLogout} className="logout-btn">Déconnexion</button>
            </div>
          ) : (
            <div className="auth-buttons"><Link to="/login" className="btn-login">Connexion</Link><Link to="/register" className="btn-register">Créer un compte <span aria-hidden="true">→</span></Link></div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
