// src/admin/pages/Hotels.js
import React, { useState } from 'react';
import './Hotels.css';

const Hotels = () => {
  const [hotels, setHotels] = useState([
    { 
      id: 1, 
      name: 'Hôtel Plaza Paris', 
      location: 'Paris, France', 
      stars: 5, 
      rooms: 120, 
      price: 189, 
      status: 'actif',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    { 
      id: 2, 
      name: 'Méditerranée Resort', 
      location: 'Nice, France', 
      stars: 4, 
      rooms: 85, 
      price: 245, 
      status: 'actif',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    { 
      id: 3, 
      name: 'Chalet Alpin', 
      location: 'Chamonix, France', 
      stars: 5, 
      rooms: 25, 
      price: 320, 
      status: 'inactif',
      image: process.env.PUBLIC_URL + '/chamonix-hotel.jpg'
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || hotel.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddHotel = () => {
    const newHotel = {
      id: hotels.length + 1,
      name: 'Nouvel Hôtel',
      location: 'Ville, Pays',
      stars: 3,
      rooms: 50,
      price: 150,
      status: 'actif',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    };
    setHotels([...hotels, newHotel]);
    setShowAddModal(false);
  };

  const toggleHotelStatus = (id) => {
    setHotels(hotels.map(hotel => 
      hotel.id === id 
        ? { ...hotel, status: hotel.status === 'actif' ? 'inactif' : 'actif' }
        : hotel
    ));
  };

  const deleteHotel = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet hôtel ?')) {
      setHotels(hotels.filter(hotel => hotel.id !== id));
    }
  };

  return (
    <div className="hotels-page">
      <div className="page-header">
        <div className="header-left">
          <h2>Gestion des Hôtels</h2>
          <p>Créez et gérez votre catalogue d'hôtels</p>
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          <span>+</span> Ajouter un hôtel
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher un hôtel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Tous
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'actif' ? 'active' : ''}`}
            onClick={() => setFilterStatus('actif')}
          >
            Actifs
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'inactif' ? 'active' : ''}`}
            onClick={() => setFilterStatus('inactif')}
          >
            Inactifs
          </button>
        </div>
      </div>

      {/* Liste des hôtels */}
      <div className="hotels-grid">
        {filteredHotels.map((hotel) => (
          <div key={hotel.id} className="hotel-card">
            <div className="hotel-image">
              <img src={hotel.image} alt={hotel.name} />
              <span className={`status-badge ${hotel.status}`}>
                {hotel.status === 'actif' ? 'Actif' : 'Inactif'}
              </span>
              <div className="stars">
                {'★'.repeat(hotel.stars)}
              </div>
            </div>
            
            <div className="hotel-info">
              <h3>{hotel.name}</h3>
              <div className="location">
                <span className="icon">📍</span>
                <span>{hotel.location}</span>
              </div>
              
              <div className="details">
                <div className="detail-item">
                  <span className="label">Chambres:</span>
                  <span className="value">{hotel.rooms}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Prix moyen:</span>
                  <span className="value">{hotel.price}€/nuit</span>
                </div>
              </div>
            </div>
            
            <div className="hotel-actions">
              <button className="action-btn edit" title="Modifier">
                ✏️ Modifier
              </button>
              <button 
                className={`action-btn toggle ${hotel.status === 'actif' ? 'deactivate' : 'activate'}`}
                onClick={() => toggleHotelStatus(hotel.id)}
              >
                {hotel.status === 'actif' ? '⏸️ Désactiver' : '▶️ Activer'}
              </button>
              <button 
                className="action-btn delete"
                onClick={() => deleteHotel(hotel.id)}
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Ajouter un nouvel hôtel</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nom de l'hôtel *</label>
                <input type="text" placeholder="Ex: Hôtel Plaza Paris" />
              </div>
              <div className="form-group">
                <label>Localisation *</label>
                <input type="text" placeholder="Ex: Paris, France" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre d'étoiles</label>
                  <select>
                    <option value="1">★</option>
                    <option value="2">★★</option>
                    <option value="3">★★★</option>
                    <option value="4">★★★★</option>
                    <option value="5">★★★★★</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nombre de chambres</label>
                  <input type="number" placeholder="Ex: 100" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                Annuler
              </button>
              <button className="save-btn" onClick={handleAddHotel}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotels;