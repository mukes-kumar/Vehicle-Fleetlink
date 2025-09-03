import React, { createContext, useEffect, useState } from 'react';
import API from '../api/api';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // user object from /profile
  const [loading, setLoading] = useState(true);

  // load profile if token exists
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await API.get('/user/profile'); // adapt path if needed
        setUser(data?.data);
      } catch (err) {
        console.warn('fetch profile failed', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (credentials) => {
    const { data } = await API.post('/user/login', credentials); // adjust path if your backend differs
    // expected: { token: '...', user: {...} } or token only — if only token, next line fetches profile
    
    if (data.token) localStorage.setItem('token', data.token);
    if (data.user) setUser(data.user);
    else {
      const { data: profile } = await API.get('/user/profile');
      setUser(profile?.data);
    }
    toast.success('Logged in');
  };

  const register = async (payload) => {
    // payload: { name, email, password, role } (role: 'admin' | 'user')
    const { data } = await API.post('/user/register', payload);
    if (data.token) localStorage.setItem('token', data.token);
    const { data: profile } = await API.get('/user/profile');
    setUser(profile?.data);
    toast.success('Registered');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
