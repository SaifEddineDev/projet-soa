import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import HomePage from "./pages/HomePage";
import HotelsPage from "./pages/HotelsPage";
import TaxiPage from "./pages/TaxiPage";
import VoyagePage from "./pages/VoyagePage";
import ReservationsPage from "./pages/ReservationsPage";
import ProfilePage from "./pages/ProfilePage";
import ContactPage from "./pages/ContactPage";
import Login from "./components/login/login.js";
import Register from "./components/register/register.js";
import AdminRoutes from './components/admin/AdminRoutes.js';
import "./App.css";

function App() {
  const handleLogin = (userData) => {
    console.log('Utilisateur connecté:', userData);
    // Logique de connexion ici
  };

  const handleSignup = () => {
    console.log('Redirection vers inscription');
  };

  const handleForgotPassword = () => {
    console.log('Mot de passe oublié');
  };

  return (
    <AuthProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/hotels" element={<HotelsPage />} />
              <Route path="/taxis" element={<TaxiPage />} />
              <Route path="/voyages" element={<VoyagePage />} />
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={
                <Login 
                  onLogin={handleLogin}
                  onForgotPassword={handleForgotPassword}
                  onSignup={handleSignup}
                />
              } />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
