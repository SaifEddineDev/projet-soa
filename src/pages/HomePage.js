import React, { useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import ServiceGrid from '../components/services/ServiceGrid'; 
import MapComponent from '../components/map/MapComponent';
import './HomePage.css';

const HomePage = () => {
  const [searchParams, setSearchParams] = useState({
    destination: '',
    dateDebut: '',
    dateFin: '',
    voyageurs: 1,
    serviceType: 'all'
  });

  const services = [
    {
      id: 1,
      title: 'Réservation Hôtel',
      description: 'Trouvez les meilleurs hôtels au meilleur prix',
      icon: '🏨',
      link: '/hotels'
    },
    {
      id: 2,
      title: 'Taxi & Transport',
      description: 'Réservez un taxi en quelques clics',
      icon: '🚕',
      link: '/taxis'
    },
    {
      id: 3,
      title: 'Voyages Organisés',
      description: 'Découvrez nos offres de voyages',
      icon: '✈️',
      link: '/voyages'
    },
    {
      id: 4,
      title: 'Conseils de voyage',
      description: 'Contactez notre équipe pour préparer votre séjour',
      icon: '🧭',
      link: '/contact'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Voyagez en toute sérénité</h2>
          <p>Réservez vos hôtels, taxis et voyages en un seul endroit</p>
          
          <SearchBar 
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h3>Nos Services</h3>
        <ServiceGrid services={services} />
      </section>

      {/* Map Preview */}
      <section className="map-section">
        <h3>Trouvez votre destination</h3>
        <div className="map-container">
          <MapComponent 
            height="400px"
            initialLocation={{ lat: 48.8566, lng: 2.3522 }} // Paris
            showMarkers={false}
            hideControls={true}
            minimalMode={true}
          />
        </div>
      </section>

      {/* Recommendations */}
      <section className="recommendations-section">
  <div className="section-header">
    <h3>Recommandations du moment</h3>
    <p className="section-subtitle">Découvrez nos établissements les plus prisés</p>
  </div>
  
  <div className="recommendations-grid">
    {/* Carte 1 */}
    <div className="recommendation-card">
      <div className="card-badge">Populaire</div>
      <div className="card-image">
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Hôtel Luxe Paris" 
        />
        <button className="wishlist-btn">
          <span className="heart-icon">♥</span>
        </button>
      </div>
      <div className="card-content">
        <div className="card-header">
          <h4 className="hotel-name">Hôtel Plaza Paris</h4>
          <div className="location">
            <span className="location-icon">📍</span>
            <span className="location-text">Paris, France</span>
          </div>
        </div>
        
        <div className="rating-container">
          <div className="stars">
            {'★'.repeat(5)}
            <span className="rating-text">5.0 (124 avis)</span>
          </div>
          <div className="rating-badge">Excellent</div>
        </div>
        
        <div className="amenities">
          <span className="amenity">🛏️ 2 lits</span>
              <span className="amenity">🚿 Salle de bain</span>
              <span className="amenity">📶 WiFi gratuit</span>
            </div>

            <div className="price-section">
              <div className="price-info">
                <span className="price">À partir de <strong>189€</strong></span>
                <span className="price-note">par nuit</span>
              </div>
                <button className="book-btn">Voir disponibilités</button>
              </div>
            </div>
          </div>
    
          {/* Carte 2 */}
          <div className="recommendation-card">
            <div className="card-badge discount">-15%</div>
            <div className="card-image">
              <img 
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Resort Méditerranée" 
              />
              <button className="wishlist-btn">
                <span className="heart-icon">♥</span>
              </button>
            </div>
            <div className="card-content">
              <div className="card-header">
                <h4 className="hotel-name">Méditerranée Resort</h4>
                <div className="location">
                  <span className="location-icon">📍</span>
                  <span className="location-text">Nice, Côte d'Azur</span>
                </div>
              </div>

              <div className="rating-container">
                <div className="stars">
                  {'★'.repeat(4)}
                  <span className="half-star">★</span>
                  <span className="rating-text">4.5 (89 avis)</span>
                </div>
                <div className="rating-badge">Très bien</div>
              </div>

              <div className="amenities">
                <span className="amenity">🏊 Piscine</span>
                <span className="amenity">🍽️ Restaurant</span>
                <span className="amenity">🏖️ Plage privée</span>
              </div>

              <div className="price-section">
                <div className="price-info">
                  <div className="price-original">220€</div>
                  <span className="price">À partir de <strong>187€</strong></span>
                  <span className="price-note">par nuit</span>
                </div>
                <button className="book-btn">Profiter de l'offre</button>
              </div>
            </div>
          </div>

          {/* Carte 3 */}
          <div className="recommendation-card">
            <div className="card-badge eco">Éco-friendly</div>
            <div className="card-image">
              <img 
                src="https://images.unsplash.com/photo-1564501049418-3c27787d01e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Chalet Montagne" 
              />
              <button className="wishlist-btn">
                <span className="heart-icon">♥</span>
              </button>
            </div>
            <div className="card-content">
              <div className="card-header">
                <h4 className="hotel-name">Chalet Alpin</h4>
                <div className="location">
                  <span className="location-icon">📍</span>
                  <span className="location-text">Chamonix, Alpes</span>
                </div>
              </div>

              <div className="rating-container">
                <div className="stars">
                  {'★'.repeat(5)}
                  <span className="rating-text">5.0 (67 avis)</span>
                </div>
                <div className="rating-badge">Exceptionnel</div>
              </div>

              <div className="amenities">
                <span className="amenity">🔥 Cheminée</span>
                <span className="amenity">🚗 Parking</span>
                <span className="amenity">🌿 Éco-responsable</span>
              </div>

              <div className="price-section">
                <div className="price-info">
                  <span className="price">À partir de <strong>245€</strong></span>
                  <span className="price-note">par nuit</span>
                </div>
                <button className="book-btn">Réserver</button>
              </div>
            </div>
          </div>

          {/* Carte 4 */}
          <div className="recommendation-card">
            <div className="card-badge">Nouveau</div>
            <div className="card-image">
              <img 
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Hôtel Design" 
              />
              <button className="wishlist-btn">
                <span className="heart-icon">♥</span>
              </button>
            </div>
            <div className="card-content">
              <div className="card-header">
                <h4 className="hotel-name">Urban Design Hotel</h4>
                <div className="location">
                  <span className="location-icon">📍</span>
                  <span className="location-text">Lyon, France</span>
                </div>
              </div>

              <div className="rating-container">
                <div className="stars">
                  {'★'.repeat(4)}
                  <span className="rating-text">4.2 (45 avis)</span>
                </div>
                <div className="rating-badge">Superbe</div>
              </div>

              <div className="amenities">
                <span className="amenity">🏋️ Salle de sport</span>
                <span className="amenity">☕ Petit-déjeuner</span>
                <span className="amenity">💼 Centre d'affaires</span>
              </div>

              <div className="price-section">
                <div className="price-info">
                  <span className="price">À partir de <strong>165€</strong></span>
                  <span className="price-note">par nuit</span>
                </div>
                <button className="book-btn">Découvrir</button>
              </div>
            </div>
          </div>
        </div>
  
        <div className="section-footer">
          <button className="view-all-btn">Voir toutes les recommandations →</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
