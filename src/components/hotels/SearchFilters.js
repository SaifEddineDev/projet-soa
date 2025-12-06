import React from 'react';
import './SearchFilters.css';

const SearchFilters = ({ filters, onFilterChange }) => {
  const handleStarChange = (star) => {
    const newStars = filters.stars.includes(star)
      ? filters.stars.filter(s => s !== star)
      : [...filters.stars, star];
    onFilterChange({ ...filters, stars: newStars });
  };

  return (
    <div className="search-filters">
      <div className="filter-group">
        <h4>Prix par nuit</h4>
        <input
          type="range"
          min="0"
          max="500"
          step="50"
          className="price-slider"
          value={filters.priceRange[1]}
          onChange={(e) => onFilterChange({
            ...filters,
            priceRange: [filters.priceRange[0], parseInt(e.target.value)]
          })}
        />
        <div className="price-range">
          <span>0€</span>
          <span>{filters.priceRange[1]}€</span>
        </div>
      </div>

      <div className="filter-group">
        <h4>Nombre d'étoiles</h4>
        <div className="stars-filter">
          {[5, 4, 3, 2, 1].map(star => (
            <label key={star} className="star-option">
              <input
                type="checkbox"
                checked={filters.stars.includes(star)}
                onChange={() => handleStarChange(star)}
              />
              <span className="star-rating">{'★'.repeat(star)}</span>
              <span>{star} étoiles</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h4>Équipements</h4>
        <div className="amenities-grid">
          {['wifi', 'pool', 'spa', 'restaurant', 'gym', 'parking'].map(amenity => (
            <label key={amenity} className="amenity-option">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => {
                  const newAmenities = filters.amenities.includes(amenity)
                    ? filters.amenities.filter(a => a !== amenity)
                    : [...filters.amenities, amenity];
                  onFilterChange({ ...filters, amenities: newAmenities });
                }}
              />
              <span>{amenity === 'wifi' ? 'WiFi' : 
                     amenity === 'pool' ? 'Piscine' : 
                     amenity === 'spa' ? 'Spa' : 
                     amenity === 'restaurant' ? 'Restaurant' : 
                     amenity === 'gym' ? 'Gym' : 'Parking'}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
