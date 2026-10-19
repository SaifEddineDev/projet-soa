import React, { useState, useEffect } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = ({ onForgotPassword, onSignup }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // États pour le formulaire
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminInfo, setAdminInfo] = useState({
    show: false,
    email: '',
    password: ''
  });

  // Identifiants admin préconfigurés
  const adminAccounts = [
    { email: 'admin@hotel.com', password: 'admin123', role: 'Admin' },
    { email: 'manager@hotel.com', password: 'manager123', role: 'Manager' },
    { email: 'superadmin@hotel.com', password: 'super123', role: 'Super Admin' }
  ];

  useEffect(() => {
    // Afficher les identifiants admin en mode développement
    if (process.env.NODE_ENV === 'development') {
      setAdminInfo({
        show: true,
        email: adminAccounts[0].email,
        password: adminAccounts[0].password
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Veuillez entrer un email valide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
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
      // Use the authentication context to login
      const result = await login(formData.email, formData.password, formData.rememberMe);
      
      if (result.success) {
        // Réinitialiser le formulaire
        setFormData({
          email: '',
          password: '',
          rememberMe: false
        });
        setErrors({});
        
        // Check if user is admin and navigate accordingly
        if (result.user.role === 'admin' || result.user.role === 'manager') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        
        console.log('Connexion réussie:', result.user);
      } else {
        setErrors({ submit: result.message || 'Échec de la connexion' });
      }
    } catch (error) {
      setErrors({ submit: 'Échec de la connexion. Veuillez réessayer.' });
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    if (onSignup) {
      onSignup();
    }
    navigate('/register');
  };

  const handleDemoLogin = async (accountType = 'user') => {
    let demoAccount;
    
    switch(accountType) {
      case 'admin':
        demoAccount = adminAccounts[0];
        break;
      case 'manager':
        demoAccount = adminAccounts[1];
        break;
      default:
        demoAccount = { email: 'user@demo.com', password: 'demo123' };
    }
    
    setFormData({
      email: demoAccount.email,
      password: demoAccount.password,
      rememberMe: false
    });
    
    // Try to login with demo account
    setIsLoading(true);
    try {
      const result = await login(demoAccount.email, demoAccount.password, false);
      
      if (result.success) {
        // Réinitialiser le formulaire
        setFormData({
          email: '',
          password: '',
          rememberMe: false
        });
        setErrors({});
        
        // Check if user is admin and navigate accordingly
        if (result.user.role === 'admin' || result.user.role === 'manager') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        
        console.log(`Mode démo ${accountType} activé:`, result.user);
      } else {
        // If demo login fails, still navigate for demo purposes
        console.log(`Mode démo ${accountType} activé (sans auth)`);
        if (accountType === 'admin' || accountType === 'manager') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Demo login error:', error);
      // Still navigate for demo purposes
      if (accountType === 'admin' || accountType === 'manager') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    if (!isAdminMode) {
      setAdminInfo({
        show: true,
        email: adminAccounts[0].email,
        password: adminAccounts[0].password
      });
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    alert(`${field} copié dans le presse-papier !`);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Connexion</h2>
          <p className="login-subtitle">Accédez à votre espace personnel</p>
          
          {adminInfo.show && (
            <div className="admin-info-panel">
              <div className="admin-info-header">
                <span className="admin-icon">👑</span>
                <span>Comptes Administrateur</span>
                <button 
                  className="admin-toggle" 
                  onClick={toggleAdminMode}
                >
                  {isAdminMode ? 'Masquer' : 'Afficher'}
                </button>
              </div>
              
              {isAdminMode && (
                <div className="admin-accounts-list">
                  {adminAccounts.map((account, index) => (
                    <div key={index} className="admin-account">
                      <div className="account-header">
                        <span className="account-role">{account.role}</span>
                        <button 
                          className="use-btn"
                          onClick={() => handleDemoLogin(account.role.toLowerCase())}
                        >
                          Utiliser
                        </button>
                      </div>
                      <div className="account-credentials">
                        <div className="credential">
                          <span className="label">Email:</span>
                          <span className="value">{account.email}</span>
                          <button 
                            className="copy-btn"
                            onClick={() => copyToClipboard(account.email, 'Email')}
                          >
                            📋
                          </button>
                        </div>
                        <div className="credential">
                          <span className="label">Mot de passe:</span>
                          <span className="value">{account.password}</span>
                          <button 
                            className="copy-btn"
                            onClick={() => copyToClipboard(account.password, 'Mot de passe')}
                          >
                            📋
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}
          
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
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                aria-pressed={showPassword}
                title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                  <circle cx="12" cy="12" r="3" />
                  {showPassword && <path d="m4 4 16 16" />}
                </svg>
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Votre mot de passe"
              autoComplete="current-password"
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="checkbox-input"
              />
              <label htmlFor="rememberMe" className="checkbox-label">
                Se souvenir de moi
              </label>
            </div>
            
            <button
              type="button"
              className="forgot-password-btn"
              onClick={onForgotPassword}
            >
              Mot de passe oublié ?
            </button>
          </div>
          
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
          
          <div className="demo-login-container">
            <h4 className="demo-title">Accès rapide</h4>
            <div className="demo-buttons">
              <button
                type="button"
                className="demo-btn admin"
                onClick={() => handleDemoLogin('admin')}
              >
                👑 Admin Demo
              </button>
              <button
                type="button"
                className="demo-btn manager"
                onClick={() => handleDemoLogin('manager')}
              >
                📊 Manager Demo
              </button>
              <button
                type="button"
                className="demo-btn user"
                onClick={() => handleDemoLogin('user')}
              >
                👤 User Demo
              </button>
            </div>
          </div>
          
          <div className="divider">
            <span>Ou</span>
          </div>
          
          <button
            type="button"
            className="signup-button"
            onClick={handleSignup}
          >
            Créer un nouveau compte
          </button>
        </form>
        
        <div className="login-footer">
          <p className="footer-text">
            En vous connectant, vous acceptez nos{' '}
            <a href="/terms" className="footer-link">Conditions d'utilisation</a>{' '}
            et notre{' '}
            <a href="/privacy" className="footer-link">Politique de confidentialité</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
