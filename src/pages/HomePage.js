import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import ServiceGrid from '../components/services/ServiceGrid';
import MapComponent from '../components/map/MapComponent';
import './HomePage.css';

const services = [
  { id: 1, title: 'Hôtels & séjours', description: 'Trouvez un hébergement adapté à vos envies et à votre budget.', icon: '🏨', link: '/hotels' },
  { id: 2, title: 'Taxi & transport', description: 'Organisez vos déplacements simplement, de la prise en charge à l’arrivée.', icon: '🚕', link: '/taxis' },
  { id: 3, title: 'Voyages organisés', description: 'Partez l’esprit tranquille avec des offres pensées pour vous.', icon: '✈️', link: '/voyages' },
  { id: 4, title: 'Conseils de voyage', description: 'Notre équipe vous accompagne dans la préparation de votre séjour.', icon: '🧭', link: '/contact' }
];

const stays = [
  { name: 'Escapade parisienne', place: 'Paris, France', price: '189 €', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=85', tag: 'Séjour urbain' },
  { name: 'L’air de la Méditerranée', place: 'Nice, Côte d’Azur', price: '187 €', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=85', tag: 'Bord de mer' },
  { name: 'Parenthèse dans les Alpes', place: 'Chamonix, France', price: '245 €', image: process.env.PUBLIC_URL + '/chamonix-hotel.jpg', tag: 'Nature & détente' }
];

const HomePage = () => {
  const [searchParams, setSearchParams] = useState({ destination: '', dateDebut: '', dateFin: '', voyageurs: 1, serviceType: 'all' });

  return (
    <div className="home-page">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-content">
          <span className="hero-eyebrow"><span aria-hidden="true">✦</span> Vos prochaines vacances commencent ici</span>
          <h2 id="hero-title">Le voyage qui vous ressemble, <span>en quelques clics.</span></h2>
          <p>Hébergement, transport et idées d’évasion : préparez tout votre séjour au même endroit.</p>
          <div className="hero-actions"><Link to="/voyages" className="hero-primary-link">Découvrir les voyages <span aria-hidden="true">→</span></Link><Link to="/hotels" className="hero-secondary-link">Trouver un hôtel</Link></div>
          <div className="hero-trust"><span aria-hidden="true">✓</span> Une réservation simple <span aria-hidden="true">✓</span> Des services réunis <span aria-hidden="true">✓</span> Un accompagnement humain</div>
        </div>
        <div className="hero-search-wrap"><div className="hero-search-heading"><span>Planifiez votre escapade</span><small>Où souhaitez-vous aller ?</small></div><SearchBar searchParams={searchParams} setSearchParams={setSearchParams} /></div>
      </section>

      <section className="services-section home-section" aria-labelledby="services-title">
        <div className="section-heading"><span className="section-kicker">Tout pour partir serein</span><h3 id="services-title">Votre voyage, de A à Z</h3><p>Choisissez le service qu’il vous faut et construisez un séjour à votre rythme.</p></div>
        <ServiceGrid services={services} />
      </section>

      <section className="home-stays-section home-section" aria-labelledby="stays-title">
        <div className="section-heading section-heading-row"><div><span className="section-kicker">Une envie d’ailleurs ?</span><h3 id="stays-title">Des séjours à découvrir</h3><p>Quelques inspirations pour imaginer votre prochaine escapade.</p></div><Link to="/hotels" className="section-more-link">Tous les hôtels <span aria-hidden="true">→</span></Link></div>
        <div className="home-stays-grid">{stays.map((stay) => (
          <article className="home-stay-card" key={stay.name}>
            <Link to="/hotels" className="home-stay-image-link" aria-label={`Découvrir les hôtels à ${stay.place}`}><img src={stay.image} alt={`Hébergement inspirant à ${stay.place}`} loading="lazy" /><span className="home-stay-tag">{stay.tag}</span></Link>
            <div className="home-stay-content"><span className="home-stay-place">{stay.place}</span><h4>{stay.name}</h4><div className="home-stay-bottom"><span>Dès <strong>{stay.price}</strong> <small>/ nuit</small></span><Link to="/hotels" aria-label={`Voir les hôtels à ${stay.place}`}>Explorer <span aria-hidden="true">→</span></Link></div></div>
          </article>
        ))}</div>
      </section>

      <section className="home-map-section home-section" aria-labelledby="map-title">
        <div className="home-map-copy"><span className="section-kicker">À vous de choisir</span><h3 id="map-title">Le monde est à portée de clic</h3><p>Repérez votre prochaine destination et laissez-vous inspirer. De la ville animée aux paysages grandioses, votre prochaine histoire commence ici.</p><Link to="/voyages" className="home-map-link">Explorer nos voyages <span aria-hidden="true">→</span></Link></div>
        <div className="home-map-container"><MapComponent height="360px" initialLocation={{ lat: 48.8566, lng: 2.3522 }} showMarkers={false} hideControls={true} minimalMode={true} /></div>
      </section>

      <section className="home-last-call"><div><span className="section-kicker">Prêt à vous évader ?</span><h3>Faisons de votre prochain voyage un beau souvenir.</h3><p>Parcourez nos offres et commencez à préparer votre séjour dès aujourd’hui.</p></div><Link to="/voyages" className="home-last-call-link">Je prépare mon voyage <span aria-hidden="true">→</span></Link></section>
    </div>
  );
};

export default HomePage;