import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { useUser, useStackApp } from '@stackframe/react';
import { stackClientApp } from '../services/neonAuth';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  updateUser: (updatedUser: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const stackApp = useStackApp();
  const stackUser = useUser();
  const [isLoading, setIsLoading] = useState(true);
  
  // Convert Stack user to our User type
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (stackUser && stackUser.displayName && stackUser.primaryEmail) {
      const convertedUser: User = {
        id: parseInt(stackUser.id) || Date.now(),
        name: stackUser.displayName,
        email: stackUser.primaryEmail,
        password: '', // Not stored for Neon Auth users
        age: 25, // Default value, can be updated later
        bio: '',
        images: [stackUser.profileImageUrl || `https://picsum.photos/seed/${stackUser.id}/800/1200`],
        interests: [],
        isPremium: false,
      };
      setCurrentUser(convertedUser);
    } else {
      setCurrentUser(null);
    }
    setIsLoading(false);
  }, [stackUser]);

  const login = async (email: string, pass: string) => {
    try {
      setIsLoading(true);
      await stackApp.signInWithCredential({ email, password: pass });
      // The useEffect will handle updating currentUser when stackUser changes
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    try {
      setIsLoading(true);
      await stackApp.signUpWithCredential({
        email,
        password: pass,
      });
      // The useEffect will handle updating currentUser when stackUser changes
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      if (stackUser) {
        await stackUser.signOut();
      }
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUser = async (updatedUser: User) => {
    if (!currentUser || currentUser.id !== updatedUser.id || !stackUser) return;
    
    try {
      // Update Stack user profile
      if (updatedUser.name !== stackUser.displayName) {
        await stackUser.update({ displayName: updatedUser.name });
      }
      
      // Update local state
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, signup, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};