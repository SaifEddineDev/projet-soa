import React from 'react';
import './SearchFilters.css';

const amenityOptions = [
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'pool', label: 'Piscine' },
  { value: 'spa', label: 'Spa' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'gym', label: 'Salle de sport' },
  { value: 'parking', label: 'Parking' },
  { value: 'fireplace', label: 'Cheminée' },
  { value: 'ski', label: 'Ski' },
  { value: 'beach', label: 'Plage' },
  { value: 'breakfast', label: 'Petit-déjeuner' }
];

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
          {amenityOptions.map(({ value, label }) => (
            <label key={value} className="amenity-option">
              <input
                type="checkbox"
                checked={filters.amenities.includes(value)}
                onChange={() => {
                  const newAmenities = filters.amenities.includes(value)
                    ? filters.amenities.filter(a => a !== value)
                    : [...filters.amenities, value];
                  onFilterChange({ ...filters, amenities: newAmenities });
                }}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
