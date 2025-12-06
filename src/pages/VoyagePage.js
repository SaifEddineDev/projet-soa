import React, { useState, useEffect } from 'react';
import './VoyagePage.css';
import TripCard from '../components/voyage/TripCard';
import DestinationFilter from '../components/voyage/DestinationFilter';

const VoyagePage = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    destination: 'all',
    duration: 'all',
    budget: 'all',
    category: 'all'
  });

  const categories = [
    { id: 'beach', name: 'Plage', icon: '🏖️', color: '#3b82f6' },
    { id: 'mountain', name: 'Montagne', icon: '⛰️', color: '#10b981' },
    { id: 'city', name: 'Ville', icon: '🏙️', color: '#8b5cf6' },
    { id: 'nature', name: 'Nature', icon: '🌲', color: '#059669' },
    { id: 'adventure', name: 'Aventure', icon: '🧗', color: '#f59e0b' },
    { id: 'cultural', name: 'Culturel', icon: '🏛️', color: '#ef4444' }
  ];

  useEffect(() => {
    const mockTrips = [
      {
        id: 1,
        title: "Week-end à Paris",
        destination: "Paris, France",
        duration: "3 jours",
        price: 299,
        image: "https://images.unsplash.com/photo-1502602898457-c46ad8bd0312?w=400",
        category: "city",
        rating: 4.7,
        includes: ["Vol A/R", "Hôtel 3*", "Visite guidée", "Petit-déjeuner"],
        description: "Découvrez la Ville Lumière avec ce forfait complet incluant les visites essentielles."
      },
      {
        id: 2,
        title: "Séjour balnéaire à Nice",
        destination: "Nice, Côte d'Azur",
        duration: "7 jours",
        price: 899,
        image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400",
        category: "beach",
        rating: 4.8,
        includes: ["Vol A/R", "Hôtel 4*", "Transferts", "Demi-pension"],
        description: "Profitez du soleil de la Côte d'Azur avec hébergement en bord de mer."
      }
    ];

    setTrips(mockTrips);
    setFilteredTrips(mockTrips);
    setLoading(false);
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    let result = [...trips];
    
    if (newFilters.destination !== 'all') {
      result = result.filter(trip => 
        trip.destination.toLowerCase().includes(newFilters.destination.toLowerCase())
      );
    }
    
    if (newFilters.duration !== 'all') {
      const [min, max] = newFilters.duration.split('-').map(Number);
      result = result.filter(trip => {
        const tripDays = parseInt(trip.duration);
        return tripDays >= min && tripDays <= max;
      });
    }
    
    if (newFilters.budget !== 'all') {
      const [min, max] = newFilters.budget.split('-').map(Number);
      result = result.filter(trip => trip.price >= min && trip.price <= max);
    }
    
    if (newFilters.category !== 'all') {
      result = result.filter(trip => trip.category === newFilters.category);
    }
    
    setFilteredTrips(result);
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredTrips(trips);
      return;
    }
    
    const result = trips.filter(trip =>
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredTrips(result);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement des voyages...</p>
      </div>
    );
  }

  return (
    <div className="voyage-page">
      <div className="voyage-hero">
        <div className="hero-content">
          <h1>Voyagez sans souci</h1>
          <p>Forfaits tout compris aux meilleurs prix</p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher une destination..."
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button className="btn-search">
              ✈️ Rechercher
            </button>
          </div>
        </div>
      </div>

      <div className="voyage-container">
        {/* Catégories */}
        <div className="categories-section">
          <h2>Explorez par thème</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <div
                key={category.id}
                className={`category-card ${filters.category === category.id ? 'active' : ''}`}
                onClick={() => handleFilterChange({...filters, category: category.id})}
                style={{ borderColor: filters.category === category.id ? category.color : '#e5e7eb' }}
              >
                <div className="category-icon" style={{ color: category.color }}>
                  {category.icon}
                </div>
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filtres et résultats */}
        <div className="voyage-content">
          {/* Filtres */}
          <div className="filters-panel">
            <DestinationFilter
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Liste des voyages */}
          <div className="trips-section">
            <div className="trips-header">
              <h2>{filteredTrips.length} voyages trouvés</h2>
            </div>

            {filteredTrips.length === 0 ? (
              <div className="no-results">
                <h3>Aucun voyage ne correspond à vos critères</h3>
                <p>Essayez de modifier vos filtres de recherche</p>
              </div>
            ) : (
              <div className="trips-grid">
                {filteredTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoyagePage;