// src/components/common/SearchBar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ searchParams, setSearchParams }) => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigation vers la page appropriée selon le type de service
    if (searchParams.serviceType === 'hotel') {
      navigate('/hotels');
    } else if (searchParams.serviceType === 'taxi') {
      navigate('/taxis');
    } else if (searchParams.serviceType === 'voyage') {
      navigate('/voyages');
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <div className="search-input">
        <label>Destination</label>
        <input
          type="text"
          placeholder="Où allez-vous ?"
          value={searchParams.destination}
          onChange={(e) => setSearchParams({
            ...searchParams,
            destination: e.target.value
          })}
        />
      </div>

      <div className="search-input">
        <label>Date d'arrivée</label>
        <input
          type="date"
          value={searchParams.dateDebut}
          onChange={(e) => setSearchParams({
            ...searchParams,
            dateDebut: e.target.value
          })}
        />
      </div>

      <div className="search-input">
        <label>Date de départ</label>
        <input
          type="date"
          value={searchParams.dateFin}
          onChange={(e) => setSearchParams({
            ...searchParams,
            dateFin: e.target.value
          })}
        />
      </div>

      <div className="search-input">
        <label>Voyageurs</label>
        <select
          value={searchParams.voyageurs}
          onChange={(e) => setSearchParams({
            ...searchParams,
            voyageurs: parseInt(e.target.value)
          })}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
            <option key={num} value={num}>{num} {num === 1 ? 'personne' : 'personnes'}</option>
          ))}
        </select>
      </div>

      <div className="search-input">
        <label>Service</label>
        <select
          value={searchParams.serviceType}
          onChange={(e) => setSearchParams({
            ...searchParams,
            serviceType: e.target.value
          })}
        >
          <option value="all">Tous les services</option>
          <option value="hotel">Hôtel</option>
          <option value="taxi">Taxi</option>
          <option value="voyage">Voyage</option>
        </select>
      </div>

      <button type="submit" className="btn-search">
        Rechercher
      </button>
    </form>
  );
};

export default SearchBar;