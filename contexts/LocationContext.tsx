import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentLocation } from '../utils/locationUtils';

interface LocationContextType {
  userLocation: {
    coordinates: {
      latitude: number;
      longitude: number;
    } | null;
    address: string | null;
  };
  maxDistance: number | null;
  setUserLocation: (location: { coordinates: { latitude: number; longitude: number }; address: string }) => void;
  setMaxDistance: (distance: number | null) => void;
  loading: boolean;
  error: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<{
    coordinates: { latitude: number; longitude: number } | null;
    address: string | null;
  }>({ coordinates: null, address: null });
  
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved location from localStorage on mount
  useEffect(() => {
    const loadSavedLocation = () => {
      try {
        const savedLocation = localStorage.getItem('userLocation');
        const savedMaxDistance = localStorage.getItem('maxDistance');
        
        if (savedLocation) {
          const parsed = JSON.parse(savedLocation);
          setUserLocation(parsed);
        }
        
        if (savedMaxDistance) {
          setMaxDistance(parseInt(savedMaxDistance, 10));
        }
      } catch (err) {
        console.error('Error loading saved location:', err);
      }
    };

    loadSavedLocation();
  }, []);

  // Save location to localStorage when it changes
  useEffect(() => {
    if (userLocation.coordinates) {
      localStorage.setItem('userLocation', JSON.stringify(userLocation));
    }
  }, [userLocation]);

  // Save maxDistance to localStorage when it changes
  useEffect(() => {
    if (maxDistance !== null) {
      localStorage.setItem('maxDistance', maxDistance.toString());
    }
  }, [maxDistance]);

  const updateUserLocation = async (address: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, you would geocode the address here
      // For now, we'll just use the current location
      const position = await getCurrentLocation();
      
      setUserLocation({
        coordinates: {
          latitude: position.latitude,
          longitude: position.longitude
        },
        address
      });
    } catch (err) {
      console.error('Error updating location:', err);
      setError('Could not determine your location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        maxDistance,
        setUserLocation: updateUserLocation,
        setMaxDistance,
        loading,
        error,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export default LocationContext;
