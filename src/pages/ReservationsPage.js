import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './ReservationsPage.css';

const ReservationsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    const mockReservations = [
      {
        id: 'RES-2024-001',
        type: 'hotel',
        title: 'Hôtel Paris Centre',
        date: '2024-03-15',
        endDate: '2024-03-18',
        status: 'confirmed',
        price: 360,
        guests: 2,
        reference: 'HTL-78945',
        details: {
          checkIn: '14:00',
          checkOut: '12:00',
          room: 'Chambre Double Supérieure'
        }
      },
      {
        id: 'RES-2024-002',
        type: 'taxi',
        title: 'Taxi Aéroport → Centre',
        date: '2024-03-10',
        status: 'completed',
        price: 45,
        guests: 3,
        reference: 'TAXI-12345',
        details: {
          pickup: 'Aéroport CDG',
          destination: 'Hôtel Paris Centre',
          driver: 'Jean Dupont',
          car: 'Toyota Prius'
        }
      }
    ];

    setReservations(mockReservations);
    setFilteredReservations(mockReservations);
    setLoading(false);
  }, []);

  useEffect(() => {
    let result = [...reservations];
    
    if (filters.status !== 'all') {
      result = result.filter(res => res.status === filters.status);
    }
    
    if (filters.type !== 'all') {
      result = result.filter(res => res.type === filters.type);
    }
    
    if (filters.dateRange !== 'all') {
      const today = new Date();
      result = result.filter(res => {
        const resDate = new Date(res.date);
        switch(filters.dateRange) {
          case 'upcoming':
            return resDate >= today;
          case 'past':
            return resDate < today;
          case 'this-month':
            return resDate.getMonth() === today.getMonth() && 
                   resDate.getFullYear() === today.getFullYear();
          default:
            return true;
        }
      });
    }
    
    setFilteredReservations(result);
  }, [filters, reservations]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleCancelReservation = (reservationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      const updatedReservations = reservations.map(res => 
        res.id === reservationId ? { ...res, status: 'cancelled' } : res
      );
      setReservations(updatedReservations);
      alert('Réservation annulée avec succès.');
    }
  };

  const handleViewDetails = (reservationId) => {
    navigate(`/reservation/${reservationId}`);
  };

  const handleModifyReservation = (reservationId) => {
    alert(`Modification de la réservation ${reservationId}`);
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: '#10b981',
      pending: '#f59e0b',
      cancelled: '#ef4444',
      completed: '#3b82f6'
    };
    return colors[status] || '#6b7280';
  };

  const getTypeIcon = (type) => {
    const icons = {
      hotel: '🏨',
      taxi: '🚕',
      voyage: '✈️'
    };
    return icons[type] || '📅';
  };

  const getStatusText = (status) => {
    const texts = {
      confirmed: 'Confirmée',
      pending: 'En attente',
      cancelled: 'Annulée',
      completed: 'Terminée'
    };
    return texts[status] || status;
  };

  const getTypeText = (type) => {
    const texts = {
      hotel: 'Hôtel',
      taxi: 'Taxi',
      voyage: 'Voyage'
    };
    return texts[type] || type;
  };

  const exportReservations = () => {
    alert('Fonction export en cours de développement');
  };

  const printReservations = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement de vos réservations...</p>
      </div>
    );
  }

  const ReservationCard = ({ reservation }) => {
    return (
      <div className="reservation-card">
        <div className="reservation-header">
          <span className="reservation-id">{reservation.id}</span>
          <span 
            className="reservation-status"
            style={{ backgroundColor: getStatusColor(reservation.status) + '20', color: getStatusColor(reservation.status) }}
          >
            {getStatusText(reservation.status)}
          </span>
        </div>

        <div className="reservation-content">
          <div className="reservation-icon">
            {getTypeIcon(reservation.type)}
          </div>
          
          <div className="reservation-details">
            <h3 className="reservation-title">{reservation.title}</h3>
            <div className="reservation-date">
              <span>📅</span> {reservation.date}
              {reservation.endDate && ` → ${reservation.endDate}`}
            </div>
            
            <div className="reservation-info">
              <span className="info-tag">{getTypeText(reservation.type)}</span>
              <span className="info-tag">{reservation.guests} {reservation.guests > 1 ? 'personnes' : 'personne'}</span>
              <span className="info-tag">Ref: {reservation.reference}</span>
            </div>
          </div>
          
          <div className="reservation-price">
            <span className="price-amount">{reservation.price}€</span>
            <span className="price-details">Total TTC</span>
          </div>
        </div>

        <div className="reservation-actions">
          <button 
            onClick={() => handleViewDetails(reservation.id)}
            className="btn-view"
          >
            👁️ Détails
          </button>
          
          {reservation.status === 'confirmed' && (
            <button 
              onClick={() => handleModifyReservation(reservation.id)}
              className="btn-modify"
            >
              ✏️ Modifier
            </button>
          )}
          
          {reservation.status === 'confirmed' && (
            <button 
              onClick={() => handleCancelReservation(reservation.id)}
              className="btn-cancel"
            >
              ✖️ Annuler
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="reservations-page user-reservations-page">
      <div className="reservations-header">
        <div className="header-content">
          <h1>Mes Réservations</h1>
          <p>Consultez et gérez toutes vos réservations</p>
        </div>
        
        <div className="header-actions">
          <button onClick={exportReservations} className="btn-export">
            ⬇️ Exporter
          </button>
          <button onClick={printReservations} className="btn-print">
            🖨️ Imprimer
          </button>
        </div>
      </div>

      <div className="reservations-container">
        {/* Statistiques */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#3b82f6' }}>
              📅
            </div>
            <div className="stat-info">
              <h3>{reservations.length}</h3>
              <p>Total réservations</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#10b981' }}>
              <span>✓</span>
            </div>
            <div className="stat-info">
              <h3>{reservations.filter(r => r.status === 'confirmed').length}</h3>
              <p>Confirmées</p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="filters-section">
          <div className="filters-header">
            🔍
            <h3>Filtrer les réservations</h3>
          </div>
          
          <div className="filters-grid">
            <div className="filter-group">
              <label>Statut</label>
              <select 
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="confirmed">Confirmées</option>
                <option value="pending">En attente</option>
                <option value="completed">Terminées</option>
                <option value="cancelled">Annulées</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Type</label>
              <select 
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">Tous types</option>
                <option value="hotel">Hôtels</option>
                <option value="taxi">Taxis</option>
                <option value="voyage">Voyages</option>
              </select>
            </div>
            
            <div className="filter-group">
              <button 
                className="btn-reset-filters"
                onClick={() => setFilters({ status: 'all', type: 'all', dateRange: 'all' })}
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Liste des réservations */}
        <div className="reservations-list">
          <div className="list-header">
            <h2>{filteredReservations.length} réservation(s) trouvée(s)</h2>
          </div>

          {filteredReservations.length === 0 ? (
            <div className="no-reservations">
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h3>Aucune réservation trouvée</h3>
                <p>Vous n'avez pas de réservation correspondant à ces critères</p>
                <button 
                  className="btn-explore"
                  onClick={() => navigate('/')}
                >
                  Explorer nos services
                </button>
              </div>
            </div>
          ) : (
            <div className="reservations-grid">
              {filteredReservations.map(reservation => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;
