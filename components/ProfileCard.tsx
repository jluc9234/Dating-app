import React from 'react';
import { User } from '../types';
import { usePremium } from '../contexts/PremiumContext';
import { PremiumIcon } from '../constants';

interface ProfileCardProps {
  user: User;
  onSwipe: (direction: 'left' | 'right') => void;
  matchPercentage: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onSwipe, matchPercentage }) => {
  const { isPremium } = usePremium();

  return (
    <div className="absolute h-full w-full" style={{ perspective: '1000px' }}>
      {/* This inner div is the visual card and clips the image */}
      <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500">
        <img src={user.images[0]} alt={user.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white w-full">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg">{user.name}, {user.age}</h2>
              {user.isVerified && (
                <svg className="w-6 h-6 text-blue-400 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => alert('Report functionality: User reported for review.')}
                className="text-slate-400 hover:text-red-400 transition-colors"
                title="Report user"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </button>
              {isPremium ? (
                  <div className="text-center">
                      <div className="font-bold text-xl sm:text-2xl text-green-300 drop-shadow-lg">{matchPercentage}%</div>
                      <div className="text-xs text-green-200">Match</div>
                  </div>
              ) : (
                  <div className="text-center backdrop-blur-sm bg-black/20 p-2 rounded-lg">
                      <div className="font-bold text-xl sm:text-2xl text-slate-300 blur-sm select-none">??%</div>
                      <div className="text-xs text-yellow-400 flex items-center gap-1"><PremiumIcon className="w-3 h-3"/> Match</div>
                  </div>
              )}
            </div>
          </div>
          <p className="mt-2 text-sm sm:text-base text-slate-200 drop-shadow-md">{user.bio}</p>
          <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
            {user.interests.map(interest => (
              <span key={interest} className="bg-white/20 backdrop-blur-sm text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">{interest}</span>
            ))}
          </div>
          {user.prompts && user.prompts.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-white mb-2">Prompts</h4>
              {user.prompts.slice(0, 2).map((prompt, index) => (
                <p key={index} className="text-xs text-slate-300 italic">"{prompt}"</p>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Buttons are outside the clipping container, so they are fully visible */}
      <div className="absolute bottom-[-40px] sm:bottom-[-50px] left-1/2 -translate-x-1/2 flex items-center space-x-8">
        <button onClick={() => onSwipe('left')} className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-red-400 border-2 border-red-400 shadow-lg transform hover:scale-110 hover:bg-red-400/30 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <button onClick={() => onSwipe('right')} className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-green-400 border-2 border-green-400 shadow-lg transform hover:scale-110 hover:bg-green-400/30 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;