import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hc_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('hc_token');
      if (savedToken) {
        try {
          const res = await api.getMe();
          if (res.user) {
            setCurrentUser(res.user);
            localStorage.setItem('hc_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('[AuthContext] Session invalid or expired:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('hc_token', data.token);
    localStorage.setItem('hc_user', JSON.stringify(data.user));
    setToken(data.token);
    setCurrentUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    localStorage.setItem('hc_token', data.token);
    localStorage.setItem('hc_user', JSON.stringify(data.user));
    setToken(data.token);
    setCurrentUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('hc_token');
    localStorage.removeItem('hc_user');
    setToken('');
    setCurrentUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('hc_user', JSON.stringify(res.user));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated: !!token && !!currentUser,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
