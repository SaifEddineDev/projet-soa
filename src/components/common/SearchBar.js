import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ searchParams, setSearchParams }) => {
  const navigate = useNavigate();
  const update = (key, value) => setSearchParams((current) => ({ ...current, [key]: value }));
  const handleSearch = (event) => {
    event.preventDefault();
    const destinations = { taxi: '/taxis', voyage: '/voyages', hotel: '/hotels', all: '/hotels' };
    navigate(destinations[searchParams.serviceType] || '/hotels');
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <div className="search-input"><label htmlFor="travel-destination">Destination</label><input id="travel-destination" type="text" placeholder="Où allez-vous ?" value={searchParams.destination} onChange={(event) => update('destination', event.target.value)} /></div>
      <div className="search-input"><label htmlFor="travel-start">Date d’arrivée</label><input id="travel-start" type="date" value={searchParams.dateDebut} onChange={(event) => update('dateDebut', event.target.value)} /></div>
      <div className="search-input"><label htmlFor="travel-end">Date de départ</label><input id="travel-end" type="date" value={searchParams.dateFin} onChange={(event) => update('dateFin', event.target.value)} /></div>
      <div className="search-input"><label htmlFor="travel-guests">Voyageurs</label><select id="travel-guests" value={searchParams.voyageurs} onChange={(event) => update('voyageurs', Number(event.target.value))}>{[1, 2, 3, 4, 5, 6, 7, 8].map((number) => <option key={number} value={number}>{number} {number === 1 ? 'personne' : 'personnes'}</option>)}</select></div>
      <div className="search-input"><label htmlFor="travel-service">Service</label><select id="travel-service" value={searchParams.serviceType} onChange={(event) => update('serviceType', event.target.value)}><option value="all">Tous les services</option><option value="hotel">Hôtel</option><option value="taxi">Taxi</option><option value="voyage">Voyage</option></select></div>
      <button type="submit" className="btn-search">Rechercher</button>
    </form>
  );
};

export default SearchBar;