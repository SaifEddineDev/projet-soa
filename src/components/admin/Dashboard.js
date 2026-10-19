// src/admin/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalReservations: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de données
    setTimeout(() => {
      setStats({
        totalHotels: 42,
        totalReservations: 156,
        totalUsers: 289,
        totalRevenue: 15420,
      });

      setRecentReservations([
        { id: 1, hotel: 'Hôtel Plaza Paris', user: 'Jean Dupont', date: '2024-03-15', amount: 189, status: 'confirmée' },
        { id: 2, hotel: 'Méditerranée Resort', user: 'Marie Curie', date: '2024-03-14', amount: 245, status: 'en attente' },
        { id: 3, hotel: 'Chalet Alpin', user: 'Pierre Martin', date: '2024-03-13', amount: 320, status: 'confirmée' },
        { id: 4, hotel: 'Urban Design Hotel', user: 'Sophie Bernard', date: '2024-03-12', amount: 165, status: 'annulée' },
        { id: 5, hotel: 'Luxe Resort', user: 'Thomas Leroy', date: '2024-03-11', amount: 210, status: 'confirmée' },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const statsCards = [
    { id: 'hotels', label: 'Hôtels', value: stats.totalHotels, icon: '🏨', color: '#3b82f6', change: '+12%' },
    { id: 'reservations', label: 'Réservations', value: stats.totalReservations, icon: '📅', color: '#10b981', change: '+8%' },
    { id: 'users', label: 'Utilisateurs', value: stats.totalUsers, icon: '👥', color: '#8b5cf6', change: '+15%' },
    { id: 'revenue', label: 'Revenus (€)', value: stats.totalRevenue.toLocaleString(), icon: '💰', color: '#f59e0b', change: '+23%' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmée': return '#10b981';
      case 'en attente': return '#f59e0b';
      case 'annulée': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Aperçu général</h2>
        <div className="period-selector">
          <select className="period-select">
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month" selected>Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="stats-grid">
        {statsCards.map((stat) => (
          <div key={stat.id} className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                <span>{stat.icon}</span>
              </div>
              <div className="stat-change positive">
                {stat.change}
              </div>
            </div>
            <div className="stat-body">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques et réservations récentes */}
      <div className="dashboard-content">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Revenus mensuels</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-color" style={{ background: '#3b82f6' }}></span>
                <span>2024</span>
              </span>
              <span className="legend-item">
                <span className="legend-color" style={{ background: '#8b5cf6' }}></span>
                <span>2023</span>
              </span>
            </div>
          </div>
          <div className="chart-placeholder">
            <div className="chart-bars">
              {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'].map((month) => (
                <div key={month} className="chart-bar">
                  <div className="bar current" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                  <div className="bar previous" style={{ height: `${Math.random() * 60 + 10}%` }}></div>
                  <span className="bar-label">{month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="recent-reservations">
          <div className="section-header">
            <h3>Réservations récentes</h3>
            <button className="view-all">Voir tout →</button>
          </div>
          
          <div className="reservations-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hôtel</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>#{reservation.id.toString().padStart(4, '0')}</td>
                    <td className="hotel-cell">
                      <div className="hotel-info">
                        <span className="hotel-name">{reservation.hotel}</span>
                      </div>
                    </td>
                    <td>{reservation.user}</td>
                    <td>{reservation.date}</td>
                    <td className="amount">{reservation.amount}€</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ background: `${getStatusColor(reservation.status)}20`, color: getStatusColor(reservation.status) }}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view" title="Voir">
                          👁️
                        </button>
                        <button className="action-btn edit" title="Modifier">
                          ✏️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;