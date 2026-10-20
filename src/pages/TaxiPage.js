import React, { useState, useEffect } from 'react';
import './TaxiPage.css';
import TaxiBookingForm from '../components/taxi/TaxiBookingForm';
import TaxiList from '../components/taxi/TaxiList';
import TaxiMap from '../components/taxi/TaxiMap';

const TaxiPage = () => {
  const [bookingInfo, setBookingInfo] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
    passengers: 1,
    taxiType: 'standard'
  });

  const [availableTaxis, setAvailableTaxis] = useState([]);
  const [selectedTaxi, setSelectedTaxi] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [bookingStep, setBookingStep] = useState(1);

  useEffect(() => {
    // Simulation de taxis disponibles
    const mockTaxis = [
      {
        id: 1,
        type: 'standard',
        name: 'Taxi Standard',
        price: 1.5,
        capacity: 4,
        eta: 5,
        rating: 4.2,
        features: ['Climatisation', 'WiFi', 'Porte-bagages']
      },
      {
        id: 2,
        type: 'comfort',
        name: 'Taxi Confort',
        price: 2.0,
        capacity: 4,
        eta: 8,
        rating: 4.5,
        features: ['Climatisation', 'WiFi', 'Eau offerte', 'Chargement USB']
      }
    ];
    setAvailableTaxis(mockTaxis);
  }, []);

  const calculatePrice = (distance = 10, type = 'standard') => {
    const basePrices = {
      standard: 1.5,
      comfort: 2.0,
      van: 2.5,
      luxury: 4.0
    };
    return (distance * basePrices[type]).toFixed(2);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (bookingInfo.pickup && bookingInfo.destination) {
      const price = calculatePrice(10, bookingInfo.taxiType);
      setEstimatedPrice(price);
      setBookingStep(2);
    }
  };

  const handleTaxiSelect = (taxi) => {
    setSelectedTaxi(taxi);
    const price = calculatePrice(10, taxi.type);
    setEstimatedPrice(price);
  };

  const confirmBooking = () => {
    alert(`Réservation confirmée !\nTaxi: ${selectedTaxi.name}\nPrix: ${estimatedPrice}€\nVotre chauffeur arrive dans ${selectedTaxi.eta} minutes.`);
    setBookingStep(3);
    setTimeout(() => {
      setBookingStep(1);
      setSelectedTaxi(null);
      setBookingInfo({
        pickup: '',
        destination: '',
        date: '',
        time: '',
        passengers: 1,
        taxiType: 'standard'
      });
    }, 5000);
  };

  return (
    <div className="taxi-page">
      <div className="taxi-hero">
        <h1>Réservez votre taxi</h1>
        <p>Rapide, sûr et disponible 24h/24</p>
      </div>

      <div className="taxi-container">
        {/* Formulaire de réservation */}
        <div className="booking-section">
          <div className="booking-steps" data-step={bookingStep}>
            <div className={`step ${bookingStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span>Détails du trajet</span>
            </div>
            <div className={`step ${bookingStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span>Choix du taxi</span>
            </div>
            <div className={`step ${bookingStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>Confirmation</span>
            </div>
          </div>

          {bookingStep === 1 && (
            <div className="booking-form-card">
              <h2>Où allez-vous ?</h2>
              <TaxiBookingForm
                bookingInfo={bookingInfo}
                setBookingInfo={setBookingInfo}
                onSubmit={handleBookingSubmit}
              />
            </div>
          )}

          {bookingStep === 2 && (
            <div className="taxi-selection-section">
              <h2>Choisissez votre taxi</h2>
              <p>Distance estimée: 10km • Durée: 25min</p>
              
              <TaxiList
                taxis={availableTaxis}
                selectedTaxi={selectedTaxi}
                onSelectTaxi={handleTaxiSelect}
                estimatedPrice={estimatedPrice}
              />

              {selectedTaxi && (
                <div className="booking-summary">
                  <h3>Récapitulatif</h3>
                  <div className="summary-details">
                    <div className="summary-item">
                      <span>📍</span>
                      <div>
                        <strong>Départ:</strong>
                        <p>{bookingInfo.pickup || "Non spécifié"}</p>
                      </div>
                    </div>
                    <div className="summary-item">
                      <span>📍</span>
                      <div>
                        <strong>Destination:</strong>
                        <p>{bookingInfo.destination || "Non spécifié"}</p>
                      </div>
                    </div>
                    <div className="summary-item">
                      <span>👤</span>
                      <div>
                        <strong>Passagers:</strong>
                        <p>{bookingInfo.passengers} personne(s)</p>
                      </div>
                    </div>
                    <div className="summary-item">
                      <span>🚗</span>
                      <div>
                        <strong>Type:</strong>
                        <p>{selectedTaxi.name}</p>
                      </div>
                    </div>
                    <div className="summary-item">
                      <span>🕒</span>
                      <div>
                        <strong>Arrivée estimée:</strong>
                        <p>{selectedTaxi.eta} minutes</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="price-total">
                    <span>Total:</span>
                    <span className="price">{estimatedPrice}€</span>
                  </div>
                  
                  <button onClick={confirmBooking} className="btn-confirm">
                    Confirmer la réservation
                  </button>
                </div>
              )}
            </div>
          )}

          {bookingStep === 3 && (
            <div className="confirmation-section">
              <div className="confirmation-card">
                <div className="success-icon">✓</div>
                <h2>Réservation confirmée !</h2>
                <p>Votre taxi est en route</p>
                
                <div className="confirmation-details">
                  <div className="detail-item">
                    <strong>Numéro de réservation:</strong>
                    <span>TAXI-{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Chauffeur:</strong>
                    <span>Jean Dupont</span>
                  </div>
                  <div className="detail-item">
                    <strong>Téléphone:</strong>
                    <span>+33 6 12 34 56 78</span>
                  </div>
                  <div className="detail-item">
                    <strong>Immatriculation:</strong>
                    <span>AB-123-CD</span>
                  </div>
                  <div className="detail-item">
                    <strong>Temps d'attente estimé:</strong>
                    <span>{selectedTaxi?.eta} minutes</span>
                  </div>
                </div>
                
                <div className="tracking-info">
                  <h4>Suivez votre taxi en direct</h4>
                  <button className="btn-track">Ouvrir le suivi</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Carte des taxis */}
        <div className="map-section">
          <TaxiMap 
            pickup={bookingInfo.pickup}
            destination={bookingInfo.destination}
            selectedTaxi={selectedTaxi}
          />
          
          {/* Informations utiles */}
          <div className="info-cards">
            <div className="info-card">
              <h3>Pourquoi choisir nos taxis ?</h3>
              <ul>
                <li>✓ Chauffeurs professionnels et vérifiés</li>
                <li>✓ Véhicules récents et entretenus</li>
                <li>✓ Prix fixes sans surprise</li>
                <li>✓ Paiement sécurisé multiple</li>
                <li>✓ Assistance 24h/24</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxiPage;
