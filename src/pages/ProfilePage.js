import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    preferences: user?.preferences || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <h1>Mon Profil</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {user?.name?.charAt(0) || "U"}
          </div>
          <h2>{user?.name || "Utilisateur"}</h2>
          <p>{user?.email}</p>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Nom complet</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Préférences</label>
              <textarea
                value={formData.preferences}
                onChange={(e) => setFormData({...formData, preferences: e.target.value})}
                placeholder="Préférences de voyage..."
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-save">Enregistrer</button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel">
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-item">
              <span className="label">Nom :</span>
              <span className="value">{user?.name}</span>
            </div>
            <div className="info-item">
              <span className="label">Email :</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Téléphone :</span>
              <span className="value">{user?.phone || "Non renseigné"}</span>
            </div>
            <div className="info-item">
              <span className="label">Préférences :</span>
              <span className="value">{user?.preferences || "Aucune préférence"}</span>
            </div>
            
            <button onClick={() => setIsEditing(true)} className="btn-edit">
              Modifier le profil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
