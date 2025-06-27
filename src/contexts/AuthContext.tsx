
import React, { createContext, useContext, useState, useEffect } from 'react';
import { database, User } from '@/lib/database';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored session
    const storedUserId = localStorage.getItem('galaxy_store_user_id');
    if (storedUserId) {
      const userData = database.getUserById(storedUserId);
      if (userData) {
        setUser(userData);
      } else {
        localStorage.removeItem('galaxy_store_user_id');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userData = database.getUserByEmail(email);
      if (userData && userData.password === password) {
        setUser(userData);
        localStorage.setItem('galaxy_store_user_id', userData.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUser = database.getUserByEmail(email);
      if (existingUser) {
        return false;
      }

      const newUser = database.createUser({
        name,
        email,
        password,
        isPremium: false,
        isAdmin: false
      });

      setUser(newUser);
      localStorage.setItem('galaxy_store_user_id', newUser.id);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('galaxy_store_user_id');
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;
    
    const updatedUser = database.updateUser(user.id, updates);
    if (updatedUser) {
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
