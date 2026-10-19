// reservation-voyage/src/components/admin/AdminRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import Hotels from './Hotels';
import Reservations from './Reservations';
import Users from './Users';
import AdminLogin from './AdminLogin';
import { useAuth } from '../../context/AuthContext';

// Composant de protection des routes admin
const ProtectedRoute = ({ children }) => {
  const { user, hasRole } = useAuth();
  
  if (!user || !hasRole('admin')) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="hotels" element={<Hotels />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="users" element={<Users />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;