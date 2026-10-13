import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('profile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      API.get('/auth/me')
        .then((res) => {
          setUser(res.data.user);
          setProfile(res.data.profile);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem('profile', JSON.stringify(res.data.profile));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password, role) => {
    const res = await API.post('/auth/login', { username, password, role });
    const { token: jwtToken, user: userData, profile: profileData } = res.data;
    
    setToken(jwtToken);
    setUser(userData);
    setProfile(profileData);
    
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('profile', JSON.stringify(profileData));
    
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setProfile(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
  };

  return (
    <AuthContext.Provider value={{ user, profile, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
