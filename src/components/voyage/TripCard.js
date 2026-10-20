import React from 'react';
import './TripCard.css';

const TripCard = ({ trip }) => {
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'beach': return '🏖️';
      case 'mountain': return '⛰️';
      case 'city': return '🏙️';
      case 'nature': return '🌲';
      case 'adventure': return '🧗';
      case 'cultural': return '🏛️';
      default: return '✈️';
    }
  };

  return (
    <div className="trip-card">
      <img
        src={trip.image}
        alt={trip.title}
        className="trip-image"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = `${process.env.PUBLIC_URL}/chamonix-hotel.jpg`;
        }}
      />
      <div className="trip-content">
        <div className="trip-header">
          <h3 className="trip-title">{trip.title}</h3>
          <div className="trip-price">{trip.price}€</div>
        </div>
        <div className="trip-destination">📍 {trip.destination}</div>
        <div className="trip-duration">📅 {trip.duration}</div>
        <div className="trip-rating">
          <span
            className="trip-stars"
            role="img"
            aria-label={`Note voyageurs : ${trip.rating} sur 5`}
          >
            <span className="trip-stars-empty" aria-hidden="true">★★★★★</span>
            <span
              className="trip-stars-filled"
              aria-hidden="true"
              style={{ width: `${Math.max(0, Math.min(5, Number(trip.rating) || 0)) * 20}%` }}
            >★★★★★</span>
          </span>
          <span className="trip-rating-label">Note voyageurs</span>
        </div>
        <p className="trip-description">{trip.description}</p>
        <div className="included-list">
          <h4>Inclus:</h4>
          <div className="included-items">
            {trip.includes.slice(0, 3).map((item, index) => (
              <span key={index} className="included-tag">{item}</span>
            ))}
          </div>
        </div>
        <div className="trip-actions">
          <button className="btn-details">Voir détails <span aria-hidden="true">↗</span></button>
          <button className="btn-book">Réserver <span aria-hidden="true">→</span></button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
