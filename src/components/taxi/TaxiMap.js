import React from 'react';
import './TaxiMap.css';

const TaxiMap = ({ pickup, destination, selectedTaxi }) => {
  return (
    <div className="taxi-map-container">
      <div className="map-placeholder">
        <div className="map-content">
          <h3>Carte des taxis disponibles</h3>
          <div className="map-points">
            {pickup && (
              <div className="map-point pickup">
                <div className="point-icon">📍</div>
                <div className="point-label">Départ: {pickup}</div>
              </div>
            )}
            {destination && (
              <div className="map-point destination">
                <div className="point-icon">🎯</div>
                <div className="point-label">Destination: {destination}</div>
              </div>
            )}
            {selectedTaxi && (
              <div className="map-point taxi">
                <div className="point-icon">🚕</div>
                <div className="point-label">Taxi sélectionné</div>
              </div>
            )}
          </div>
          <div className="map-legend">
            <div className="legend-item">
              <span className="legend-color pickup"></span>
              <span>Point de départ</span>
            </div>
            <div className="legend-item">
              <span className="legend-color destination"></span>
              <span>Destination</span>
            </div>
            <div className="legend-item">
              <span className="legend-color taxi"></span>
              <span>Taxi disponible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxiMap;
