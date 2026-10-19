import React, { useState, useEffect } from 'react';
import './Reservations.css';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    // Simulation de données
    setTimeout(() => {
      setReservations([
        {
          id: 1,
          type: 'hotel',
          serviceName: 'Hôtel Plaza Paris',
          location: 'Paris, France',
          user: 'Jean Dupont',
          email: 'jean.dupont@email.com',
          phone: '+33 6 12 34 56 78',
          checkIn: '2024-03-15',
          checkOut: '2024-03-18',
          pickupTime: null,
          guests: 2,
          amount: 567,
          status: 'confirmed',
          createdAt: '2024-03-10'
        },
        {
          id: 2,
          type: 'taxi',
          serviceName: 'Taxi Premium',
          location: 'Nice, France',
          user: 'Marie Curie',
          email: 'marie.curie@email.com',
          phone: '+33 6 98 76 54 32',
          checkIn: null,
          checkOut: null,
          pickupTime: '2024-03-14 14:30',
          guests: 1,
          amount: 45,
          status: 'pending',
          createdAt: '2024-03-12'
        },
        {
          id: 3,
          type: 'hotel',
          serviceName: 'Chalet Alpin',
          location: 'Chamonix, France',
          user: 'Pierre Martin',
          email: 'pierre.martin@email.com',
          phone: '+33 6 55 44 33 22',
          checkIn: '2024-03-20',
          checkOut: '2024-03-25',
          pickupTime: null,
          guests: 4,
          amount: 890,
          status: 'confirmed',
          createdAt: '2024-03-08'
        },
        {
          id: 4,
          type: 'taxi',
          serviceName: 'Taxi Économique',
          location: 'Lyon, France',
          user: 'Sophie Bernard',
          email: 'sophie.bernard@email.com',
          phone: '+33 6 11 22 33 44',
          checkIn: null,
          checkOut: null,
          pickupTime: '2024-03-16 09:00',
          guests: 1,
          amount: 25,
          status: 'cancelled',
          createdAt: '2024-03-11'
        },
        {
          id: 5,
          type: 'hotel',
          serviceName: 'Urban Design Hotel',
          location: 'Bordeaux, France',
          user: 'Thomas Leroy',
          email: 'thomas.leroy@email.com',
          phone: '+33 6 77 88 99 00',
          checkIn: '2024-03-22',
          checkOut: '2024-03-24',
          pickupTime: null,
          guests: 2,
          amount: 234,
          status: 'completed',
          createdAt: '2024-03-05'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    const matchesType = typeFilter === 'all' || reservation.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const updateReservationStatus = (id, newStatus) => {
    setReservations(reservations.map(reservation =>
      reservation.id === id ? { ...reservation, status: newStatus } : reservation
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      case 'completed': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'hotel' ? '🏨' : '🚕';
  };

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Chargement des réservations...</p>
      </div>
    );
  }

  return (
    <div className="reservations-page">
      <div className="page-header">
        <div className="header-left">
          <h2>Gestion des Réservations</h2>
          <p>Gérez toutes les réservations d'hôtels et de taxis</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.confirmed}</span>
            <span className="stat-label">Confirmées</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">En attente</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.cancelled}</span>
            <span className="stat-label">Annulées</span>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher par client, email ou service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">Tous les types</option>
          <option value="hotel">Hôtels</option>
          <option value="taxi">Taxis</option>
        </select>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tous les statuts</option>
          <option value="confirmed">Confirmée</option>
          <option value="pending">En attente</option>
          <option value="cancelled">Annulée</option>
          <option value="completed">Terminée</option>
        </select>
      </div>

      <div className="reservations-table-container">
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Service</th>
              <th>Client</th>
              <th>Dates</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>
                  <span className="type-badge">
                    <span className="type-icon">{getTypeIcon(reservation.type)}</span>
                    {reservation.type === 'hotel' ? 'Hôtel' : 'Taxi'}
                  </span>
                </td>
                <td className="service-cell">
                  <div className="service-info">
                    <div className="service-name">{reservation.serviceName}</div>
                    <div className="location">📍 {reservation.location}</div>
                    <div className="guests-info">
                      👥 {reservation.guests} personne{reservation.guests > 1 ? 's' : ''}
                    </div>
                  </div>
                </td>
                <td className="contact-cell">
                  <div className="contact-info">
                    <div className="contact-info">{reservation.user}</div>
                    <div className="email">{reservation.email}</div>
                    <div className="phone">{reservation.phone}</div>
                  </div>
                </td>
                <td className="dates-cell">
                  {reservation.type === 'hotel' ? (
                    <div className="hotel-dates">
                      <div className="check-in">📅 Arrivée: {reservation.checkIn}</div>
                      <div className="check-out">📅 Départ: {reservation.checkOut}</div>
                    </div>
                  ) : (
                    <div className="taxi-dates">
                      <div className="pickup">🚗 Prise en charge: {reservation.pickupTime}</div>
                    </div>
                  )}
                </td>
                <td className="amount-cell">
                  {reservation.amount}€
                </td>
                <td>
                  <select
                    className="status-select"
                    style={{ color: getStatusColor(reservation.status) }}
                    value={reservation.status}
                    onChange={(e) => updateReservationStatus(reservation.id, e.target.value)}
                  >
                    <option value="confirmed" style={{ color: '#10b981' }}>Confirmée</option>
                    <option value="pending" style={{ color: '#f59e0b' }}>En attente</option>
                    <option value="cancelled" style={{ color: '#ef4444' }}>Annulée</option>
                    <option value="completed" style={{ color: '#8b5cf6' }}>Terminée</option>
                  </select>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view" title="Voir détails">
                      👁️
                    </button>
                    <button className="action-btn edit" title="Modifier">
                      ✏️
                    </button>
                    <button className="action-btn contact" title="Contacter client">
                      📧
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredReservations.length === 0 && (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <h3>Aucune réservation trouvée</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservations;
