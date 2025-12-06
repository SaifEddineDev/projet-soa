import React, { useState, useEffect } from 'react';
import './HotelsPage.css';
import HotelCard from '../components/hotels/HotelCard';
import SearchFilters from '../components/hotels/SearchFilters';

const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    stars: [],
    amenities: [],
    sortBy: 'recommended'
  });

  useEffect(() => {
    // Données fictives pour les hôtels
    const mockHotels = [
      {
        id: 1,
        name: "Hôtel Paris Centre",
        location: "Paris, France",
        price: 120,
        rating: 4.5,
        stars: 4,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
        amenities: ["wifi", "pool", "spa", "restaurant", "gym"],
        description: "Hôtel moderne au cœur de Paris avec vue sur la Tour Eiffel"
      },
      {
        id: 2,
        name: "Luxury Resort & Spa",
        location: "Nice, Côte d'Azur",
        price: 250,
        rating: 4.8,
        stars: 5,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w-400",
        amenities: ["wifi", "pool", "spa", "restaurant", "gym", "beach"],
        description: "Resort de luxe avec accès privé à la plage"
      },
      {
        id: 3,
        name: "Mountain View Lodge",
        location: "Chamonix, Alpes",
        price: 180,
        rating: 4.3,
        stars: 3,
        image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400",
        amenities: ["wifi", "fireplace", "restaurant", "ski"],
        description: "Chalet confortable avec vue imprenable sur les montagnes"
      }
    ];

    setHotels(mockHotels);
    setFilteredHotels(mockHotels);
    setLoading(false);
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    let result = [...hotels];
    
    // Filtre par prix
    result = result.filter(hotel => 
      hotel.price >= newFilters.priceRange[0] && 
      hotel.price <= newFilters.priceRange[1]
    );
    
    // Filtre par étoiles
    if (newFilters.stars.length > 0) {
      result = result.filter(hotel => newFilters.stars.includes(hotel.stars));
    }
    
    // Filtre par équipements
    if (newFilters.amenities.length > 0) {
      result = result.filter(hotel =>
        newFilters.amenities.every(amenity => hotel.amenities.includes(amenity))
      );
    }
    
    // Tri
    switch(newFilters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // recommended (par défaut)
        break;
    }
    
    setFilteredHotels(result);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement des hôtels...</p>
      </div>
    );
  }

  return (
    <div className="hotels-page">
      <div className="hotels-hero">
        <h1>Trouvez l'hôtel parfait</h1>
        <p>Des hébergements pour tous les budgets et toutes les envies</p>
      </div>

      <div className="hotels-container">
        {/* Filtres */}
        <div className="filters-sidebar">
          <div className="filters-header">
            <span>🔍</span>
            <h3>Filtres</h3>
          </div>
          
          <SearchFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          {/* Statistiques */}
          <div className="stats-card">
            <h4>Statistiques</h4>
            <div className="stats-item">
              <span>Hôtels trouvés:</span>
              <span className="stats-value">{filteredHotels.length}</span>
            </div>
            <div className="stats-item">
              <span>Prix moyen:</span>
              <span className="stats-value">
                {filteredHotels.length > 0 
                  ? Math.round(filteredHotels.reduce((sum, hotel) => sum + hotel.price, 0) / filteredHotels.length)
                  : 0}€
              </span>
            </div>
          </div>
        </div>

        {/* Liste des hôtels */}
        <div className="hotels-list">
          <div className="hotels-header">
            <h2>{filteredHotels.length} hôtels disponibles</h2>
            <div className="sort-options">
              <span>↕️</span>
              <select 
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({...filters, sortBy: e.target.value})}
              >
                <option value="recommended">Recommandés</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="rating">Meilleures notes</option>
              </select>
            </div>
          </div>

          {filteredHotels.length === 0 ? (
            <div className="no-results">
              <h3>Aucun hôtel ne correspond à vos critères</h3>
              <p>Essayez de modifier vos filtres pour voir plus de résultats</p>
            </div>
          ) : (
            <div className="hotels-grid">
              {filteredHotels.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;