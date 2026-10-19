import React, { useState } from 'react';
import './register.css';
import { Link, useNavigate } from 'react-router-dom';

const Register = ({ onRegister, onLogin }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Effacer l'erreur de confirmation de mot de passe si on modifie un des mots de passe
    if (name === 'password' || name === 'confirmPassword') {
      if (errors.confirmPassword) {
        setErrors({
          ...errors,
          confirmPassword: ''
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Veuillez entrer un email valide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins une majuscule';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins un chiffre';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Vous devez accepter les conditions d\'utilisation';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simuler une requête API d'inscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onRegister) {
        onRegister(formData);
      }
      
      // Réinitialiser le formulaire
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      });
      setErrors({});
      
      console.log('Inscription réussie avec:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      });
      
      // Rediriger vers la page de connexion après inscription
      navigate('/login');
    } catch (error) {
      setErrors({ submit: 'Échec de l\'inscription. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    }
    navigate('/login');
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Créer un compte</h2>
          <p className="register-subtitle">Rejoignez notre communauté</p>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form" noValidate>
          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}
          
          <div className="name-fields">
            <div className="form-group half-width">
              <label htmlFor="firstName" className="form-label">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                placeholder="Votre prénom"
                autoComplete="given-name"
              />
              {errors.firstName && (
                <div className="error-message">{errors.firstName}</div>
              )}
            </div>
            
            <div className="form-group half-width">
              <label htmlFor="lastName" className="form-label">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                placeholder="Votre nom"
                autoComplete="family-name"
              />
              {errors.lastName && (
                <div className="error-message">{errors.lastName}</div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="votre@gmail.com"
              autoComplete="email"
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>
          
          <div className="form-group">
            <div className="password-label-container">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Créez un mot de passe sécurisé"
              autoComplete="new-password"
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
            <div className="password-hints">
              <span className={`hint ${formData.password.length >= 6 ? 'valid' : ''}`}>
                • 6 caractères minimum
              </span>
              <span className={`hint ${/(?=.*[A-Z])/.test(formData.password) ? 'valid' : ''}`}>
                • Une majuscule
              </span>
              <span className={`hint ${/(?=.*\d)/.test(formData.password) ? 'valid' : ''}`}>
                • Un chiffre
              </span>
            </div>
          </div>
          
          <div className="form-group">
            <div className="password-label-container">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le mot de passe
              </label>
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Retapez votre mot de passe"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
          </div>
          
          <div className="form-group">
            <div className="remember-me">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className={`checkbox-input ${errors.agreeTerms ? 'error' : ''}`}
              />
              <label htmlFor="agreeTerms" className="checkbox-label">
                J'accepte les{' '}
                <a href="/terms" className="terms-link">Conditions d'utilisation</a>{' '}
                et la{' '}
                <a href="/privacy" className="terms-link">Politique de confidentialité</a>
              </label>
            </div>
            {errors.agreeTerms && (
              <div className="error-message">{errors.agreeTerms}</div>
            )}
          </div>
          
          <button
            type="submit"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Inscription en cours...
              </>
            ) : (
              'Créer mon compte'
            )}
          </button>
          
          <div className="divider">
            <span>Déjà membre ?</span>
          </div>
          
          <button
            type="button"
            className="login-button-secondary"
            onClick={handleLogin}
          >
            Se connecter
          </button>
        </form>
        
        <div className="register-footer">
          <p className="footer-text">
            En vous inscrivant, vous confirmez avoir lu et accepté nos{' '}
            <a href="/terms" className="footer-link">Conditions d'utilisation</a>{' '}
            et notre{' '}
            <a href="/privacy" className="footer-link">Politique de confidentialité</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;