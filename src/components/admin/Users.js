import React, { useState, useEffect } from 'react';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Simulation de données
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@email.com',
          phone: '+33 6 12 34 56 78',
          role: 'user',
          status: 'active',
          createdAt: '2024-01-15',
          lastLogin: '2024-03-10',
          bookingsCount: 5
        },
        {
          id: 2,
          firstName: 'Marie',
          lastName: 'Curie',
          email: 'marie.curie@email.com',
          phone: '+33 6 98 76 54 32',
          role: 'user',
          status: 'active',
          createdAt: '2024-02-01',
          lastLogin: '2024-03-12',
          bookingsCount: 3
        },
        {
          id: 3,
          firstName: 'Pierre',
          lastName: 'Martin',
          email: 'pierre.martin@email.com',
          phone: '+33 6 55 44 33 22',
          role: 'admin',
          status: 'active',
          createdAt: '2023-12-10',
          lastLogin: '2024-03-11',
          bookingsCount: 0
        },
        {
          id: 4,
          firstName: 'Sophie',
          lastName: 'Bernard',
          email: 'sophie.bernard@email.com',
          phone: '+33 6 11 22 33 44',
          role: 'user',
          status: 'inactive',
          createdAt: '2024-01-20',
          lastLogin: '2024-02-28',
          bookingsCount: 2
        },
        {
          id: 5,
          firstName: 'Thomas',
          lastName: 'Leroy',
          email: 'thomas.leroy@email.com',
          phone: '+33 6 77 88 99 00',
          role: 'manager',
          status: 'active',
          createdAt: '2023-11-05',
          lastLogin: '2024-03-09',
          bookingsCount: 0
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const updateUserStatus = (id, newStatus) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, status: newStatus } : user
    ));
  };

  const updateUserRole = (id, newRole) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, role: newRole } : user
    ));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'manager': return '#f59e0b';
      case 'user': return '#10b981';
      default: return '#64748b';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#10b981' : '#ef4444';
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    admins: users.filter(u => u.role === 'admin').length
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Chargement des utilisateurs...</p>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <div className="header-left">
          <h2>Gestion des Utilisateurs</h2>
          <p>Gérez les comptes utilisateurs et leurs permissions</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">Actifs</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.inactive}</span>
            <span className="stat-label">Inactifs</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.admins}</span>
            <span className="stat-label">Admins</span>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <select
          className="filter-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">Tous les rôles</option>
          <option value="user">Utilisateur</option>
          <option value="manager">Manager</option>
          <option value="admin">Administrateur</option>
        </select>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Contact</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Dernière connexion</th>
              <th>Réservations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="user-cell">
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{user.firstName} {user.lastName}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="contact-cell">
                  <div className="contact-info">
                    <div className="phone">{user.phone}</div>
                    <div className="created-date">Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</div>
                  </div>
                </td>
                <td>
                  <select
                    className="role-select"
                    style={{ color: getRoleColor(user.role) }}
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                  >
                    <option value="user" style={{ color: '#10b981' }}>Utilisateur</option>
                    <option value="manager" style={{ color: '#f59e0b' }}>Manager</option>
                    <option value="admin" style={{ color: '#ef4444' }}>Administrateur</option>
                  </select>
                </td>
                <td>
                  <select
                    className="status-select"
                    style={{ color: getStatusColor(user.status) }}
                    value={user.status}
                    onChange={(e) => updateUserStatus(user.id, e.target.value)}
                  >
                    <option value="active" style={{ color: '#10b981' }}>Actif</option>
                    <option value="inactive" style={{ color: '#ef4444' }}>Inactif</option>
                  </select>
                </td>
                <td className="last-login-cell">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : 'Jamais'}
                </td>
                <td className="bookings-cell">
                  <span className="bookings-count">{user.bookingsCount}</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view" title="Voir profil">
                      👁️
                    </button>
                    <button className="action-btn edit" title="Modifier">
                      ✏️
                    </button>
                    <button className="action-btn contact" title="Contacter">
                      📧
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <h3>Aucun utilisateur trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
