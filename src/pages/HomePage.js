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
      title: 'Guides Locaux',
      description: 'Explorez avec des guides experts',
      icon: '🧭',
      link: '/guides'
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
          />
        </div>
      </section>

      {/* Recommendations */}
      <section className="recommendations-section">
        <h3>Recommandations du moment</h3>
        <div className="recommendations-grid">
          {/* Cards de recommandations */}
        </div>
      </section>
    </div>
  );
};

export default HomePage;