import React, { useState, useEffect } from 'react';
import { MOCK_LOCATIONS } from '../data/mockLocations';

interface LocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
  onDetectLocation: () => void;
  disabled?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  onDetectLocation,
  disabled = false,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length > 1) {
      const filtered = MOCK_LOCATIONS.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (location: string) => {
    onChange(location);
    setInputValue(location);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <div className="flex space-x-2">
        <div className="relative flex-grow">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => inputValue.length > 1 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your location"
            disabled={disabled}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {suggestions.map((location, index) => (
                <li
                  key={index}
                  className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                  onMouseDown={() => handleSelect(location)}
                >
                  {location}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={onDetectLocation}
          disabled={disabled}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Use my current location"
        >
          📍
        </button>
      </div>
    </div>
  );
};

export default LocationSelector;
