import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>TravelHub++</h3>
          <p>Votre plateforme de réservation unifiée</p>
        </div>
        
        <div className="footer-section">
          <h4>Services</h4>
          <ul>
            <li><Link to="/hotels">Hôtels</Link></li>
            <li><Link to="/taxis">Taxis</Link></li>
            <li><Link to="/voyages">Voyages</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>contact@travelhub.com</p>
          <p>+216 29 058 322</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TravelHub. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
