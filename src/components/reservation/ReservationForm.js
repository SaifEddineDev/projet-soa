// src/components/reservation/ReservationForm.jsx
import React, { useState, useContext } from 'react';
import { ReservationContext } from '../../context/ReservationContext';
import CalendarDatePicker from '../common/CalendarDatePicker';
import './ReservationForm.css';

const ReservationForm = ({ serviceType, serviceId, price }) => {
  const { addReservation } = useContext(ReservationContext);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    dateDebut: '',
    dateFin: '',
    voyageurs: 1,
    preferences: '',
    paymentMethod: 'credit_card'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const reservation = {
      ...formData,
      serviceType,
      serviceId,
      price,
      status: 'pending',
      reference: `RES-${Date.now()}`,
      dateReservation: new Date().toISOString()
    };

    try {
      await addReservation(reservation);
      alert('Réservation confirmée !');
      // Redirection vers la page de paiement
    } catch (error) {
      alert('Erreur lors de la réservation');
    }
  };

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      <h3>Réserver maintenant</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label>Nom complet *</label>
          <input
            type="text"
            required
            value={formData.nom}
            onChange={(e) => setFormData({...formData, nom: e.target.value})}
          />
        </div>
        
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Téléphone *</label>
          <input
            type="tel"
            required
            value={formData.telephone}
            onChange={(e) => setFormData({...formData, telephone: e.target.value})}
          />
        </div>
        
        <div className="form-group">
          <label>Nombre de voyageurs *</label>
          <select
            value={formData.voyageurs}
            onChange={(e) => setFormData({...formData, voyageurs: e.target.value})}
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="reservation-start-date">Date d'arrivée *</label>
          <CalendarDatePicker
            id="reservation-start-date"
            name="dateDebut"
            required
            value={formData.dateDebut}
            onChange={(e) => setFormData({...formData, dateDebut: e.target.value})}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reservation-end-date">Date de départ *</label>
          <CalendarDatePicker
            id="reservation-end-date"
            name="dateFin"
            required
            value={formData.dateFin}
            onChange={(e) => setFormData({...formData, dateFin: e.target.value})}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Préférences spéciales</label>
        <textarea
          value={formData.preferences}
          onChange={(e) => setFormData({...formData, preferences: e.target.value})}
          placeholder="Demandes spéciales, allergies, etc."
        />
      </div>

      <div className="price-summary">
        <div className="price-item">
          <span>Prix unitaire</span>
          <span>{price} €</span>
        </div>
        <div className="price-item">
          <span>Nombre de voyageurs</span>
          <span>{formData.voyageurs}</span>
        </div>
        <div className="price-total">
          <span>Total</span>
          <span>{price * formData.voyageurs} €</span>
        </div>
      </div>

      <button type="submit" className="btn-reserve">
        Confirmer la réservation
      </button>
    </form>
  );
};

export default ReservationForm;
