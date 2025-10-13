import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { apiService, logout as apiLogout } from '../services/apiService';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  updateUser: (updatedUser: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const item = window.localStorage.getItem('currentUser');
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  const login = async (email: string, pass: string) => {
    const user = await apiService.login(email, pass);
    if (user) {
        setCurrentUser(user);
        window.localStorage.setItem('currentUser', JSON.stringify(user));
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    await apiService.signup(name, email, pass);
    // User will need to confirm email, then login
  };

  const logout = async () => {
    await apiLogout();
    setCurrentUser(null);
    window.localStorage.removeItem('currentUser');
  };
  
  const updateUser = async (updatedUser: User) => {
    if (!currentUser || currentUser.id !== updatedUser.id) return;
    const user = await apiService.updateUser(updatedUser);
    setCurrentUser(user);
    window.localStorage.setItem('currentUser', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, signup, updateUser }}>
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