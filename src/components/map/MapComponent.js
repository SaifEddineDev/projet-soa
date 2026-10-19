// src/components/map/MapComponent.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import './MapComponent.css';

// Default map options
const defaultMapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

// Default center (Paris)
const DEFAULT_CENTER = { lat: 48.8566, lng: 2.3522 };

const MapComponent = ({ 
  height = '500px',
  initialLocation = DEFAULT_CENTER,
  markers = [],
  onLocationSelect,
  zoom = 13
}) => {
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [geolocationError, setGeolocationError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [mapCenter, setMapCenter] = useState(initialLocation);
  const [mapZoom, setMapZoom] = useState(zoom);
  const searchInput = useRef(null);
  const mapRef = useRef(null);

  const containerStyle = {
    width: '100%',
    height: height
  };

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setMapCenter(location);
          setMapZoom(15); // Zoom in more when showing user location
          setGeolocationError(null);
        },
        (error) => {
          console.error("Location error:", error);
          let errorMessage = "Could not access your location";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access was denied. Please enable location services.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
            default:
              errorMessage = "An unknown error occurred while getting your location.";
          }
          
          setGeolocationError(errorMessage);
          setUserLocation(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setGeolocationError("Geolocation is not supported by your browser.");
      setUserLocation(null);
    }
  }, []);

  // Load user location on component mount
  useEffect(() => {
    getUserLocation();
    
    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, [getUserLocation]);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!window.google || !searchInput.current) return;
    
    const autocomplete = new window.google.maps.places.Autocomplete(
      searchInput.current,
      { 
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: 'fr' } // Restrict to France
      }
    );
    
    const placeChanged = () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        console.log('No details available for input:', place.name);
        return;
      }

      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      
      setSearchLocation({
        position: location,
        name: place.name,
        address: place.formatted_address || place.vicinity
      });
      
      // Update map center and zoom
      setMapCenter(location);
      setMapZoom(15);
      
      if (mapRef.current) {
        mapRef.current.panTo(location);
      }
    };
    
    autocomplete.addListener('place_changed', placeChanged);
    setAutocomplete(autocomplete);
    
    // Cleanup
    return () => {
      if (window.google && autocomplete) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [map]);

  // Handle search form submission
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !autocomplete) return;
    
    autocomplete.set('query', searchQuery);
    
    // Use PlacesService for more robust search
    const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    
    placesService.textSearch(
      { 
        query: searchQuery,
        location: mapCenter,
        radius: 50000 // 50km radius
      },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const place = results[0];
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          
          setSearchLocation({
            position: location,
            name: place.name,
            address: place.formatted_address || place.vicinity
          });
          
          // Update map center and zoom
          setMapCenter(location);
          setMapZoom(15);
          
          if (mapRef.current) {
            mapRef.current.panTo(location);
          }
        }
      }
    );
  }, [searchQuery, autocomplete, mapCenter]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchLocation(null);
  };

  // Get marker icon
  const getMarkerIcon = (type) => {
    switch(type) {
      case 'hotel': return '🏨';
      case 'taxi': return '🚕';
      case 'airport': return '✈️';
      default: return '📍';
    }
  };

  // Handle map load
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMap(map);
  }, []);

  // Handle map unload
  const onUnmount = useCallback(() => {
    mapRef.current = null;
    setMap(null);
  }, []);

  return (
    <div className="map-container" style={{ height }}>
      {geolocationError && (
        <div className="geolocation-error">
          <p>{geolocationError}</p>
        </div>
      )}
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={['places']}
        loadingElement={<div className="map-loading">Loading map...</div>}
      >
        <div className="map-search-container">
          <form onSubmit={handleSearch} className="map-search-form">
            <div className="search-input-container">
              <input
                ref={searchInput}
                type="text"
                placeholder="Rechercher un lieu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="map-search-input"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={clearSearch}
                  className="clear-search-btn"
                  aria-label="Effacer la recherche"
                >
                  ×
                </button>
              )}
              <button type="submit" className="search-submit-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </form>
        </div>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={mapZoom}
          onLoad={onMapLoad}
          onUnmount={onUnmount}
          options={defaultMapOptions}
        >
          {/* User location marker */}
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
              title="Your location"
              zIndex={1000}
            />
          )}

          {/* Custom markers */}
          {markers.map(marker => (
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

          {/* Directions */}
          {directions && <DirectionsRenderer directions={directions} />}
          
          {/* Search location marker */}
          {searchLocation && (
            <Marker
              position={searchLocation.position}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#FF5252",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#FFFFFF"
              }}
              title={searchLocation.name}
              zIndex={900}
            />
          )}
        </GoogleMap>
        
        {/* Search location info window */}
        {searchLocation && (
          <InfoWindow
            position={searchLocation.position}
            onCloseClick={clearSearch}
          >
            <div className="search-location-info">
              <h4>{searchLocation.name}</h4>
              <p>{searchLocation.address}</p>
            </div>
          </InfoWindow>
        )}
      </LoadScript>
    </div>
  );
};

export default MapComponent;