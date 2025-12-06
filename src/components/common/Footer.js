import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>TravelHub</h3>
          <p>Votre plateforme de réservation unifiée</p>
        </div>
        
        <div className="footer-section">
          <h4>Services</h4>
          <ul>
            <li><a href="/hotels">Hôtels</a></li>
            <li><a href="/taxis">Taxis</a></li>
            <li><a href="/voyages">Voyages</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>contact@travelhub.com</p>
          <p>+33 1 23 45 67 89</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 TravelHub. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
