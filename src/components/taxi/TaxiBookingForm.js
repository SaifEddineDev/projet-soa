import React from 'react';
import './TaxiBookingForm.css';

const TaxiBookingForm = ({ bookingInfo, setBookingInfo, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="taxi-booking-form">
      <div className="form-group">
        <label>📍 Lieu de prise en charge</label>
        <input
          type="text"
          placeholder="Adresse, aéroport, gare..."
          value={bookingInfo.pickup}
          onChange={(e) => setBookingInfo({...bookingInfo, pickup: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>🎯 Destination</label>
        <input
          type="text"
          placeholder="Où allez-vous ?"
          value={bookingInfo.destination}
          onChange={(e) => setBookingInfo({...bookingInfo, destination: e.target.value})}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>📅 Date</label>
          <input
            type="date"
            value={bookingInfo.date}
            onChange={(e) => setBookingInfo({...bookingInfo, date: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>⏰ Heure</label>
          <input
            type="time"
            value={bookingInfo.time}
            onChange={(e) => setBookingInfo({...bookingInfo, time: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>👥 Passagers</label>
          <select
            value={bookingInfo.passengers}
            onChange={(e) => setBookingInfo({...bookingInfo, passengers: parseInt(e.target.value)})}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>{num} personne(s)</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>🚗 Type de taxi</label>
          <select
            value={bookingInfo.taxiType}
            onChange={(e) => setBookingInfo({...bookingInfo, taxiType: e.target.value})}
          >
            <option value="standard">Standard (4 places)</option>
            <option value="comfort">Confort (4 places)</option>
            <option value="van">Van (8 places)</option>
            <option value="luxury">Luxe (3 places)</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn-book-taxi">
        Chercher un taxi
      </button>
    </form>
  );
};

export default TaxiBookingForm;
