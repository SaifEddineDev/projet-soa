import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message envoyé avec succès! Nous vous répondrons dans les 24h.');
    setFormData({ nom: '', email: '', sujet: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Contactez-nous</h1>
        <p>Nous sommes là pour vous aider 24h/24 et 7j/7</p>
      </div>

      <div className="contact-container">
        {/* Informations de contact */}
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>Téléphone</h3>
            <p>+33 1 23 45 67 89</p>
            <p className="info-sub">Lun-Ven: 8h-20h</p>
          </div>

          <div className="info-card">
            <div className="info-icon">✉️</div>
            <h3>Email</h3>
            <p>contact@travelhub.com</p>
            <p className="info-sub">Réponse sous 24h</p>
          </div>

          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Adresse</h3>
            <p>123 Avenue des Champs-Élysées</p>
            <p className="info-sub">75008 Paris, France</p>
          </div>

          <div className="info-card">
            <div className="info-icon">🕒</div>
            <h3>Horaires</h3>
            <p>Lundi - Vendredi: 8h-20h</p>
            <p className="info-sub">Samedi: 9h-18h</p>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="contact-form-section">
          <h2>Envoyez-nous un message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="nom">Nom complet *</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                placeholder="Votre nom"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="votre@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sujet">Sujet *</label>
              <select
                id="sujet"
                name="sujet"
                value={formData.sujet}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="reservation">Problème de réservation</option>
                <option value="annulation">Annulation/modification</option>
                <option value="paiement">Problème de paiement</option>
                <option value="reclamation">Réclamation</option>
                <option value="partenariat">Partenariat</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Décrivez votre demande..."
                rows="6"
              />
            </div>

            <button type="submit" className="btn-submit">
              Envoyer le message
            </button>
          </form>
        </div>

        {/* Carte de localisation */}
        <div className="map-section">
          <h2>Notre emplacement</h2>
          <div className="map-container">
            <iframe
              title="Notre emplacement"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.292292615509614!3d48.85837007928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fe4235b0b8f%3A0x9d3aa3d2d5b4e1c5!2sChamps-%C3%89lys%C3%A9es%2C%20Paris!5e0!3m2!1sfr!2sfr!4v1648231121234!5m2!1sfr!2sfr"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h2>Questions fréquentes</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>Comment annuler une réservation ?</h3>
              <p>Connectez-vous à votre compte, allez dans "Mes réservations" et cliquez sur "Annuler".</p>
            </div>
            <div className="faq-item">
              <h3>Quels sont les modes de paiement acceptés ?</h3>
              <p>Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal et les virements bancaires.</p>
            </div>
            <div className="faq-item">
              <h3>Puis-je modifier ma réservation ?</h3>
              <p>Oui, vous pouvez modifier votre réservation jusqu'à 24h avant la date d'arrivée.</p>
            </div>
            <div className="faq-item">
              <h3>Comment obtenir un remboursement ?</h3>
              <p>Les remboursements sont traités sous 5-7 jours ouvrés après l'annulation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;