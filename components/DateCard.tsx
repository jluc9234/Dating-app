import React, { useState } from 'react';
import { DateIdea } from '../types';
import { useNotification } from '../contexts/NotificationContext';
import { usePremium } from '../contexts/PremiumContext';
import { useDateInteraction } from '../contexts/DateInteractionContext';
import { MapPinIcon, getRandomGradient, PlaneIcon, CalendarIcon, CurrencyDollarIcon, TagIcon } from '../constants';
import DirectionsModal from './DirectionsModal';

interface DateCardProps {
  dateIdea: DateIdea;
}

const DateCard: React.FC<DateCardProps> = ({ dateIdea }) => {
  const [isDirectionsModalOpen, setIsDirectionsModalOpen] = useState(false);
  const { isPremium } = usePremium();
  const { interests, toggleInterest, isTogglingInterest } = useDateInteraction();
  const [buttonGradient] = useState(() => getRandomGradient());

  const isInterested = interests.has(dateIdea.id);
  const isLoading = isTogglingInterest.has(dateIdea.id);

  const handleInterestClick = () => {
    toggleInterest(dateIdea);
  };

  const formattedDate = dateIdea.date ? new Date(dateIdea.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : null;

  return (
    <>
      <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-3 shadow-lg hover:border-pink-500/50 hover:shadow-pink-500/10 transition-all duration-300">
        {dateIdea.isOutOfTown && (
          <div className="absolute top-2 right-2 bg-cyan-500/80 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <PlaneIcon className="w-3 h-3" />
            Out of Town
          </div>
        )}
        <div className="flex items-center mb-1">
          <img src={dateIdea.authorImage} alt={dateIdea.authorName} className="w-8 h-8 rounded-full mr-3 border-2 border-slate-600" />
          <div>
            <h3 className="font-bold text-sm text-white">{dateIdea.title}</h3>
            <p className="text-xs text-slate-400">by {dateIdea.authorName}</p>
          </div>
        </div>

        {dateIdea.location && (
          <button 
            onClick={() => setIsDirectionsModalOpen(true)}
            className="flex items-center gap-1 text-xs text-slate-400 mb-1 hover:text-cyan-400 transition-colors"
          >
            <MapPinIcon className="w-3 h-3" />
            <span>{dateIdea.location}</span>
            {dateIdea.distance && (
              <span className="text-cyan-400 font-medium">• {dateIdea.distance.toFixed(1)} miles</span>
            )}
          </button>
        )}

        <p className="text-slate-300 mb-2 text-xs line-clamp-2">{dateIdea.description}</p>
        
        <div className="border-t border-slate-700/50 my-2"></div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 mb-2">
            {formattedDate && (
              <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3 text-slate-500" />
                  <span>{formattedDate}</span>
              </div>
            )}
            {dateIdea.budget && dateIdea.budget !== 'Not Set' && (
              <div className="flex items-center gap-1">
                  <CurrencyDollarIcon className="w-3 h-3 text-slate-500" />
                  <span>{dateIdea.budget}</span>
              </div>
            )}
            {dateIdea.dressCode && dateIdea.dressCode !== 'Not Set' && (
              <div className="flex items-center gap-1">
                  <TagIcon className="w-3 h-3 text-slate-500" />
                  <span>{dateIdea.dressCode}</span>
              </div>
            )}
        </div>

        <div className="flex justify-between items-center flex-wrap gap-1">
          <span className="text-xs font-semibold bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full">{dateIdea.category}</span>
          <div className="flex items-center gap-1">
            {isPremium && dateIdea.location && (
                <button 
                    onClick={() => setIsDirectionsModalOpen(true)}
                    className="bg-cyan-500/20 text-cyan-300 font-semibold px-2 py-1 rounded-lg hover:bg-cyan-500/40 transform hover:-translate-y-0.5 transition-all duration-300 text-xs flex items-center gap-1"
                >
                    <MapPinIcon className="w-3 h-3" />
                    Directions
                </button>
            )}
            <button 
              onClick={handleInterestClick}
              disabled={isLoading}
              className={`bg-gradient-to-r ${buttonGradient} text-white font-semibold px-2 py-1 rounded-lg shadow-md hover:shadow-purple-500/40 transform hover:-translate-y-0.5 transition-all duration-300 text-xs disabled:opacity-60 disabled:transform-none disabled:shadow-none`}
            >
              {isLoading ? '...' : (isInterested ? "I'm Interested ✓" : "I'm Interested")}
            </button>
          </div>
        </div>
      </div>
      {dateIdea.location && (
          <DirectionsModal 
              isOpen={isDirectionsModalOpen}
              onClose={() => setIsDirectionsModalOpen(false)}
              location={dateIdea.location}
          />
      )}
    </>
  );
};

export default DateCard;