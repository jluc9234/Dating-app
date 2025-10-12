import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { useUser, useStackApp } from '@stackframe/stack';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  updateUser: (updatedUser: User) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const stackUser = useUser();
  const stackApp = useStackApp();

  useEffect(() => {
    // Initialize user from Stack Auth
    const initUser = () => {
      try {
        if (stackUser) {
          // Convert Stack user to our User type
          const user: User = {
            id: stackUser.id,
            name: stackUser.displayName || stackUser.primaryEmail || 'User',
            email: stackUser.primaryEmail || '',
            age: 25, // Default age, can be updated in profile
            bio: '',
            images: [],
            interests: [],
            isPremium: false
          };
          setCurrentUser(user);
          
          // Also store in localStorage for backward compatibility
          window.localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
          setCurrentUser(null);
          window.localStorage.removeItem('currentUser');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, [stackUser]);

  const login = async (email: string, pass: string) => {
    try {
      setLoading(true);
      await stackApp.signInWithCredential({ email, password: pass });
      // The useEffect will handle setting the user
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    try {
      setLoading(true);
      await stackApp.signUpWithCredential({ 
        email, 
        password: pass 
      });
      // The useEffect will handle setting the user
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await stackApp.signOut();
      setCurrentUser(null);
      window.localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const updateUser = async (updatedUser: User) => {
    if (!currentUser || currentUser.id !== updatedUser.id) return;
    
    try {
      setCurrentUser(updatedUser);
      window.localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, signup, updateUser, loading }}>
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