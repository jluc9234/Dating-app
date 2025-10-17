import React, { useState, useEffect } from 'react';
import { useLocation } from '../contexts/LocationContext';
import { getCurrentLocation } from '../utils/locationUtils';

const LocationSettings: React.FC = () => {
  const { 
    userLocation, 
    maxDistance, 
    setUserLocation, 
    setMaxDistance, 
    loading, 
    error 
  } = useLocation();
  
  const [address, setAddress] = useState<string>(userLocation.address || '');
  const [localMaxDistance, setLocalMaxDistance] = useState<string>(
    maxDistance ? maxDistance.toString() : ''
  );

  useEffect(() => {
    if (userLocation.address) {
      setAddress(userLocation.address);
    }
  }, [userLocation.address]);

  const handleDetectLocation = async () => {
    try {
      const position = await getCurrentLocation();
      // In a real app, you would reverse geocode these coordinates to get an address
      const detectedAddress = `Nearby (${position.latitude.toFixed(4)}, ${position.longitude.toFixed(4)})`;
      
      setUserLocation({
        coordinates: {
          latitude: position.latitude,
          longitude: position.longitude
        },
        address: detectedAddress
      });
      setAddress(detectedAddress);
    } catch (err) {
      console.error('Error getting location:', err);
      alert('Could not get your location. Please enter it manually.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      setUserLocation({
        coordinates: userLocation.coordinates || { latitude: 0, longitude: 0 },
        address: address.trim()
      });
    }
    
    const distance = localMaxDistance ? parseInt(localMaxDistance, 10) : null;
    if (distance !== null && !isNaN(distance) && distance > 0) {
      setMaxDistance(distance);
    } else {
      setMaxDistance(null);
    }
    
    alert('Location settings saved!');
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-6">
      <h2 className="font-bold text-lg mb-4">Location Settings</h2>
      
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Your Location
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address or city"
              className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Use my current location"
            >
              📍
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Maximum Distance (miles)
          </label>
          <input
            type="number"
            min="1"
            max="500"
            value={localMaxDistance}
            onChange={(e) => setLocalMaxDistance(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="No limit"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-slate-400">
            Set to 0 or leave empty for no distance limit
          </p>
        </div>

        {error && (
          <div className="p-2 text-red-400 text-sm bg-red-900/30 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Location Settings'}
        </button>
      </form>
    </div>
  );
};

export default LocationSettings;
