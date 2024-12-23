'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const API_BASE_URL = 'https://api.usemelon.co/api/v1';

interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    // Initialize from localStorage during mount
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  });

  useEffect(() => {
    // Log current auth state
    console.log('Auth State:', {
      token: token,
      isAuthenticated: !!token,
      user: user
    });
  }, [token, user]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt for:', email);

      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          field: email, 
          password 
        }),
      });

      const data = await response.json();
      console.log('Login Response:', data);

      if (data.success) {
        // Store token
        localStorage.setItem('auth_token', data.token);
        setToken(data.token);
        
        // Store user
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        setUser(data.user);

        console.log('Login successful, token stored:', data.token);
      } else {
        console.error('Login failed:', data.error || 'Unknown error');
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    console.log('Logged out, auth state cleared');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}