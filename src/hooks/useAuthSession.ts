'use client';

import { useState, useEffect } from 'react';
import { getSession, clearSession } from '@/lib/utils/auth';

export type SessionData = {
  isAuthenticated: boolean;
  userType: 'cliente' | 'agente';
  userData: any;
};

export function useAuthSession() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = () => {
      try {
        const sessionData = getSession();
        setSession(sessionData);
      } catch (error) {
        console.error('Error loading session:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    // Escuchar cambios en localStorage (para logout desde otra pestaña)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userSession') {
        loadSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = () => {
    clearSession();
    setSession(null);
    window.location.href = '/'; // Redirigir al login
  };

  const isAuthenticated = !!session;
  const userType = session?.userType || null;

  return {
    session,
    isLoading,
    isAuthenticated,
    userType,
    logout
  };
} 