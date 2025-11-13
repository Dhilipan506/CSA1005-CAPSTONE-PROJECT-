import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Student, Warden } from '../types';
import { mockWardens } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  login: (userData: Student | Warden, role: 'student' | 'warden') => void;
  logout: () => void;
  isLoading: boolean;
  wardens: Warden[];
  addWarden: (wardenData: Omit<Warden, 'id'>) => Warden;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const WARDENS_STORAGE_KEY = 'hostel_wardens';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [wardens, setWardens] = useState<Warden[]>(() => {
    try {
      const storedWardens = localStorage.getItem(WARDENS_STORAGE_KEY);
      return storedWardens ? JSON.parse(storedWardens) : mockWardens;
    } catch (error) {
      console.error("Failed to parse wardens from local storage", error);
      return mockWardens;
    }
  });

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from session storage", error);
      sessionStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    try {
      localStorage.setItem(WARDENS_STORAGE_KEY, JSON.stringify(wardens));
    } catch (error) {
      console.error("Failed to save wardens to local storage", error);
    }
  }, [wardens]);

  const login = (userData: Student | Warden, role: 'student' | 'warden') => {
    const userToStore = { ...userData, role };
    // Fix: Cast userToStore to User type. TypeScript cannot infer that the `role`
    // parameter will correctly correspond to the `userData` type, making the
    // inferred type of userToStore too broad. The cast is safe given the
    // implementation at the call sites.
    setUser(userToStore as User);
    sessionStorage.setItem('user', JSON.stringify(userToStore));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  const addWarden = (wardenData: Omit<Warden, 'id'>): Warden => {
    const newWarden: Warden = {
        ...wardenData,
        id: `W${Date.now()}`
    };
    setWardens(prev => [...prev, newWarden]);
    return newWarden;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, wardens, addWarden }}>
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
