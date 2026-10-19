import React from 'react';
import './HotelCard.css';

const HotelCard = ({ hotel }) => {
  return (
    <div className="hotel-card">
      <img src={hotel.image} alt={hotel.name} className="hotel-image" />
      <div className="hotel-content">
        <div className="hotel-header">
          <h3 className="hotel-name">{hotel.name}</h3>
          <div className="hotel-price">{hotel.price}€</div>
        </div>
        <div className="hotel-location">📍 {hotel.location}</div>
        <div className="hotel-rating">
          <span className="rating-value" aria-label={`Note : ${hotel.rating} sur 5`}>{hotel.rating}<small>/5</small></span>
        </div>
        <p className="hotel-description">{hotel.description}</p>
        <div className="hotel-amenities">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="amenity-tag">{amenity}</span>
          ))}
        </div>
        <div className="hotel-actions">
          <button className="btn-details">Détails</button>
          <button className="btn-book">Réserver</button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
