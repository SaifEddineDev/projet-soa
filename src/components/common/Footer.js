import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-main">
      <div className="footer-content">
        <section className="footer-brand-column">
          <Link to="/" className="footer-brand" aria-label="TravelHub++, accueil"><img src={`${process.env.PUBLIC_URL || ''}/favion-transparent.png`} alt="" /><span className="footer-brand-copy"><strong>TravelHub<span className="brand-plus">++</span></strong><small>Le voyage en toute simplicité</small></span></Link>
          <p className="footer-description">Les essentiels du voyage réunis au même endroit. Imaginez votre séjour, nous vous aidons à le préparer.</p>
          <Link to="/voyages" className="footer-cta">Préparer mon voyage <span aria-hidden="true">→</span></Link>
        </section>
        <nav className="footer-links" aria-label="Explorer TravelHub++">
          <h2>Explorer</h2>
          <Link to="/hotels">Hôtels & séjours</Link>
          <Link to="/taxis">Taxi & transport</Link>
          <Link to="/voyages">Voyages organisés</Link>
          <Link to="/reservations">Mes réservations</Link>
        </nav>
        <nav className="footer-links" aria-label="Aide et compte">
          <h2>À votre service</h2>
          <Link to="/contact">Nous contacter</Link>
          <Link to="/profile">Mon profil</Link>
          <a href="mailto:contact@travelhub.com">contact@travelhub.com</a>
          <a href="tel:+33123456789">+33 1 23 45 67 89</a>
        </nav>
        <div className="footer-note"><span className="footer-note-icon" aria-hidden="true">✦</span><p>Chaque beau voyage commence par une bonne idée.</p><small>Et si le prochain était le vôtre ?</small></div>
      </div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} TravelHub++</span><span>Fait pour vous accompagner, où que vous alliez.</span><Link to="/contact">Besoin d’aide ?</Link></div>
  </footer>
);

export default Footer;
