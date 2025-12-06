import React from 'react';
import './DestinationFilter.css';

const DestinationFilter = ({ filters, onFilterChange }) => {
  const durations = [
    { value: 'all', label: 'Toutes durées' },
    { value: '1-3', label: '1-3 jours' },
    { value: '4-7', label: '4-7 jours' },
    { value: '8-14', label: '8-14 jours' },
    { value: '15+', label: '15+ jours' }
  ];

  const budgets = [
    { value: 'all', label: 'Tous budgets' },
    { value: '0-500', label: 'Moins de 500€' },
    { value: '500-1000', label: '500-1000€' },
    { value: '1000-2000', label: '1000-2000€' },
    { value: '2000+', label: 'Plus de 2000€' }
  ];

  return (
    <div className="destination-filter">
      <div className="filter-group">
        <h3>Destination</h3>
        <input
          type="text"
          className="destination-input"
          placeholder="Rechercher une destination..."
          value={filters.destination === 'all' ? '' : filters.destination}
          onChange={(e) => onFilterChange({
            ...filters,
            destination: e.target.value || 'all'
          })}
        />
      </div>

      <div className="filter-group">
        <h3>Durée</h3>
        <div className="checkbox-group">
          {durations.map(duration => (
            <label key={duration.value} className="checkbox-label">
              <input
                type="radio"
                name="duration"
                value={duration.value}
                checked={filters.duration === duration.value}
                onChange={() => onFilterChange({...filters, duration: duration.value})}
              />
              {duration.label}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>Budget</h3>
        <div className="checkbox-group">
          {budgets.map(budget => (
            <label key={budget.value} className="checkbox-label">
              <input
                type="radio"
                name="budget"
                value={budget.value}
                checked={filters.budget === budget.value}
                onChange={() => onFilterChange({...filters, budget: budget.value})}
              />
              {budget.label}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>Prix maximum</h3>
        <input
          type="range"
          min="0"
          max="3000"
          step="100"
          className="price-slider"
          value={filters.maxPrice || 3000}
          onChange={(e) => onFilterChange({
            ...filters,
            maxPrice: parseInt(e.target.value)
          })}
        />
        <div className="price-range-display">
          <span>0€</span>
          <span>{filters.maxPrice || 3000}€</span>
        </div>
      </div>

      <button className="btn-apply">Appliquer les filtres</button>
    </div>
  );
};

export default DestinationFilter;
