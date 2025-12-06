import React from 'react';
import './TaxiList.css';

const TaxiList = ({ taxis, selectedTaxi, onSelectTaxi, estimatedPrice }) => {
  const getTaxiIcon = (type) => {
    switch(type) {
      case 'standard': return '🚕';
      case 'comfort': return '🚖';
      case 'van': return '🚐';
      case 'luxury': return '🚗';
      default: return '🚕';
    }
  };

  return (
    <div className="taxi-list">
      <div className="taxi-options">
        {taxis.map(taxi => (
          <div
            key={taxi.id}
            className={`taxi-option ${selectedTaxi?.id === taxi.id ? 'selected' : ''}`}
            onClick={() => onSelectTaxi(taxi)}
          >
            <div className="taxi-option-header">
              <div className="taxi-type">
                {getTaxiIcon(taxi.type)} {taxi.name}
              </div>
              <div className="taxi-price">{taxi.price}€/km</div>
            </div>
            <div className="taxi-features">
              {taxi.features.join(' • ')}
            </div>
            <div className="taxi-details">
              <div className="taxi-capacity">👥 {taxi.capacity} places</div>
              <div className="taxi-eta">⏱️ Arrivée: {taxi.eta} min</div>
              <div className="taxi-rating">⭐ {taxi.rating}/5</div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedTaxi && (
        <div className="estimated-price">
          <h4>Prix estimé pour 10km:</h4>
          <div className="price-display">
            <span className="price">{estimatedPrice}€</span>
            <span className="note">(Estimation basée sur 10km)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxiList;
