import React from 'react';
import './HotelCard.css';

const HotelCard = ({ hotel }) => {
  const amenityLabels = {
    wifi: 'Wi-Fi',
    pool: 'Piscine',
    spa: 'Spa',
    restaurant: 'Restaurant',
    gym: 'Salle de sport',
    fireplace: 'Cheminée',
    parking: 'Parking',
    ski: 'Ski',
    beach: 'Plage'
  };

  return (
    <article className="hotel-card" aria-label={hotel.name}>
      <img src={hotel.image} alt={hotel.name} className="hotel-image" loading="lazy" />
      <div className="hotel-content">
        <div className="hotel-header">
          <h3 className="hotel-name">{hotel.name}</h3>
          <div className="hotel-price"><strong>{hotel.price}€</strong><small>/ nuit</small></div>
        </div>
        <div className="hotel-location"><span aria-hidden="true">📍</span>{hotel.location}</div>
        <div className="hotel-rating">
          <span className="rating-stars" role="img" aria-label={`Note : ${hotel.rating} sur 5`}>
            <span className="rating-stars-empty" aria-hidden="true">★★★★★</span>
            <span
              className="rating-stars-filled"
              aria-hidden="true"
              style={{ width: `${Math.max(0, Math.min(5, Number(hotel.rating) || 0)) * 20}%` }}
            >★★★★★</span>
          </span>
        </div>
        <p className="hotel-description">{hotel.description}</p>
        <div className="hotel-amenities">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <span key={`${amenity}-${index}`} className="amenity-tag">{amenityLabels[amenity] || amenity}</span>
          ))}
        </div>
        <div className="hotel-actions">
          <button type="button" className="btn-details">Détails <span aria-hidden="true">↗</span></button>
          <button type="button" className="btn-book">Réserver <span aria-hidden="true">→</span></button>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
