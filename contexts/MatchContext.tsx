import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Match, User, MatchData } from '../types';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';
import { apiService } from '../services/apiService';
import { supabase } from '../services/supabaseClient';

interface MatchContextType {
  matches: Match[];
  addMatch: (user: User) => Promise<void>;
  isLoading: boolean;
  fetchMatches: () => Promise<void>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: { children: ReactNode }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotification();
  const { currentUser } = useAuth();

  const fetchMatches = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
        const userMatches = await apiService.getMatches(currentUser.id);
        setMatches(userMatches);
    } catch (error) {
        console.error("Failed to fetch matches:", error);
    } finally {
        setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Realtime subscription for new matches
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel('matches_realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'matches',
        filter: `participants@>${JSON.stringify([currentUser.id])}`, // Use jsonb contains operator
      }, async (payload) => {
        const newMatch = payload.new as MatchData;
        // Check if it's not already in matches (avoid duplicate on creation)
        if (!matches.some(m => m.id === newMatch.id)) {
          // Add notification based on type
          if ((newMatch as any).interest_type === 'swipe') {
            const otherUserId = newMatch.participants.find(p => p !== currentUser.id)!;
            // Fetch the other user to get name
            const { data: otherUser } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', otherUserId)
              .single();
            if (otherUser) {
              addNotification(`You matched with ${otherUser.name}! Send them a message.`, 'match');
            }
          } else if ((newMatch as any).interest_type === 'date') {
            addNotification('Someone showed interest in your date idea! A 3-day chat has opened.', 'interest');
          }
          // Refetch matches to update the list
          await fetchMatches();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, matches, addNotification, fetchMatches]);


  const addMatch = useCallback(async (user: User) => {
    if (!currentUser) return;

    // Prevent adding duplicate matches for a smoother UX
    if (matches.some(match => match.user.id === user.id)) {
      return;
    }

    try {
        await apiService.addMatch(currentUser.id, user.id);
        // After successfully creating the match in the "backend", refetch the list
        await fetchMatches();
    } catch (error) {
        console.error("Failed to add match:", error);
        addNotification(`Could not create match with ${user.name}.`, 'info');
    }
  }, [matches, addNotification, currentUser, fetchMatches]);


  return (
    <MatchContext.Provider value={{ matches, addMatch, isLoading, fetchMatches }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = (): MatchContextType => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};