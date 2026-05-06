import React, { createContext, useState, useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import api from '../services/api';
import { User } from '../types';

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const payload: any = jwtDecode(token);
        const fallbackUsername = payload?.sub;
        const res = await api.get('/api/users/me');
        const me = res.data || {};
        const role = me.role;
        setUser({
          id: me.id,
          username: me.username || fallbackUsername,
          fullName: me.fullName,
          role,
          roles: role ? [role] : [],
        });
      } catch (e) {
        setUser(null);
      }
    };

    loadCurrentUser();
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // attach logout on 401
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response && err.response.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
