import React, { useState } from 'react';
import { DateIdea, DateCategory } from '../types';
import DateCard from './DateCard';
import { DATE_CATEGORIES, getRandomGradient } from '../constants';
import { useLocation } from '../contexts/LocationContext';
import { calculateDistance } from '../utils/locationUtils';

interface DateMarketplaceProps {
  onCreateDate: () => void;
  dateIdeas: DateIdea[];
  isLoading: boolean;
}

const DateMarketplace: React.FC<DateMarketplaceProps> = ({ onCreateDate, dateIdeas, isLoading }) => {
  const { userLocation, maxDistance } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<DateCategory | 'All'>('All');
  const [searchLocation, setSearchLocation] = useState('');
  const [buttonGradient, setButtonGradient] = useState(() => getRandomGradient());

  // Predefined city coordinates for demo
  const cityCoordinates: { [key: string]: { latitude: number; longitude: number; address: string } } = {
    'Los Angeles': { latitude: 34.0522, longitude: -118.2437, address: 'Los Angeles, CA' },
    'San Francisco': { latitude: 37.7749, longitude: -122.4194, address: 'San Francisco, CA' },
    'New York': { latitude: 40.7128, longitude: -74.0060, address: 'New York, NY' },
    'Chicago': { latitude: 41.8781, longitude: -87.6298, address: 'Chicago, IL' },
    'Miami': { latitude: 25.7617, longitude: -80.1918, address: 'Miami, FL' },
  };

  // Filter dates by category first
  const categoryFilteredIdeas = selectedCategory === 'All'
    ? dateIdeas
    : dateIdeas.filter(idea => idea.category === selectedCategory);

  // Then filter by location and distance
  const locationFilteredIdeas = categoryFilteredIdeas.filter(idea => {
    // Determine the search coordinates
    let searchCoords = null;
    if (searchLocation && cityCoordinates[searchLocation]) {
      searchCoords = cityCoordinates[searchLocation];
    } else if (userLocation.coordinates) {
      searchCoords = userLocation.coordinates;
    }

    // If no search or user location, show all
    if (!searchCoords) return true;

    // If idea has coordinates, calculate distance
    if (idea.coordinates) {
      const distance = calculateDistance(
        searchCoords.latitude,
        searchCoords.longitude,
        idea.coordinates.latitude,
        idea.coordinates.longitude
      );
      
      // Add distance to the idea for display
      idea.distance = distance;
      
      // Filter by max distance if set
      return !maxDistance || distance <= maxDistance;
    }

    // If no coordinates for the idea, include it
    return true;
  });

  const handleCreateClick = () => {
    onCreateDate();
    setButtonGradient(getRandomGradient());
  };

  return (
    <div className="px-4 text-white h-full overflow-y-auto scrollbar-hide pt-20 pb-24">
      <h1 className="text-3xl font-bold mb-2">Date Marketplace</h1>
      <p className="text-slate-400 mb-6">Discover unique date ideas posted by others.</p>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for a city (e.g., Los Angeles)"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
        />
        <button 
          onClick={handleCreateClick} 
          className={`w-full bg-gradient-to-r ${buttonGradient} text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-300`}
        >
          Create-A-Date
        </button>
      </div>

      <div className="flex overflow-x-auto space-x-3 pb-4 mb-6 scrollbar-hide">
        <button 
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${selectedCategory === 'All' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'bg-slate-800/70 text-slate-300'}`}
        >
          All
        </button>
        {DATE_CATEGORIES.map(category => (
          <button 
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${selectedCategory === category ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'bg-slate-800/70 text-slate-300'}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Location filter indicator */}
      {(searchLocation && cityCoordinates[searchLocation]) || userLocation.coordinates ? (
        <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
          <p className="text-sm text-slate-300">
            📍 Showing dates within {maxDistance || 'any distance'} of {searchLocation && cityCoordinates[searchLocation] ? cityCoordinates[searchLocation].address : userLocation.address}
          </p>
        </div>
      ) : null}
      
      {isLoading ? (
         <div className="flex items-center justify-center h-40">
            <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
      ) : (
        <div className="space-y-2">
            {locationFilteredIdeas.length > 0 ? (
                locationFilteredIdeas.map(idea => (
                    <DateCard key={idea.id} dateIdea={idea} />
                ))
            ) : (
                <div className="text-center py-10">
                    <p className="text-slate-400">
                        {categoryFilteredIdeas.length === 0 
                          ? "No date ideas in this category yet!" 
                          : "No date ideas match your location preferences!"}
                    </p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default DateMarketplace;
