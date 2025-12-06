// src/components/map/MapComponent.jsx
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import './MapComponent.css';

const MapComponent = ({ 
  height = '500px',
  initialLocation = { lat: 48.8566, lng: 2.3522 },
  markers = [],
  onLocationSelect
}) => {
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);

  const containerStyle = {
    width: '100%',
    height: height
  };

  // Obtenir la localisation de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
        }
      );
    }
  }, []);

  // Exemple de calcul d'itinéraire
  const calculateRoute = (destination) => {
    if (!userLocation || !map) return;

    const directionsService = new window.google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: userLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
        }
      }
    );
  };

  // Hotels fictifs
  const defaultMarkers = [
    {
      id: 1,
      position: { lat: 48.8566, lng: 2.3522 },
      title: "Hôtel Paris Centre",
      type: "hotel",
      price: "120€/nuit",
      rating: 4.5
    },
    {
      id: 2,
      position: { lat: 48.8584, lng: 2.2945 },
      title: "Eiffel Tower Hotel",
      type: "hotel",
      price: "200€/nuit",
      rating: 4.8
    },
    {
      id: 3,
      position: { lat: 48.8627, lng: 2.2876 },
      title: "Taxi Station Montmartre",
      type: "taxi",
      available: true
    }
  ];

  const getMarkerIcon = (type) => {
    switch(type) {
      case 'hotel': return '🏨';
      case 'taxi': return '🚕';
      case 'airport': return '✈️';
      default: return '📍';
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || initialLocation}
        zoom={13}
        onLoad={map => setMap(map)}
      >
        {/* Marqueur de l'utilisateur */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#FFFFFF"
            }}
            title="Votre position"
          />
        )}

        {/* Marqueurs des services */}
        {defaultMarkers.map(marker => (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={() => {
              setSelectedMarker(marker);
              if (onLocationSelect) {
                onLocationSelect(marker);
              }
            }}
            label={{
              text: getMarkerIcon(marker.type),
              fontSize: "20px"
            }}
          />
        ))}

        {/* Fenêtre d'information */}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="info-window">
              <h4>{selectedMarker.title}</h4>
              <p>Type: {selectedMarker.type}</p>
              {selectedMarker.price && <p>Prix: {selectedMarker.price}</p>}
              {selectedMarker.rating && <p>Note: {selectedMarker.rating}/5</p>}
              <button 
                onClick={() => calculateRoute(selectedMarker.position)}
                className="btn-get-directions"
              >
                Itinéraire
              </button>
            </div>
          </InfoWindow>
        )}

        {/* Itinéraire */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;