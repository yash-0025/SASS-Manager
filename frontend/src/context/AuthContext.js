import React, { createContext, useContext, useState, useEffect } from 'react';
import { decodeToken } from "react-jwt";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('access-token');
    if (token) {
      try {
        const data = decodeToken(token);
        if (data) {
          setIsLogin(true);
          setIsAdmin(data.isAdmin || false);
          setIsSuperAdmin(data.isSuperAdmin || false);
          setName(data.name || '');
        } else {
          // Token is invalid/expired
          sessionStorage.removeItem('access-token');
          setIsLogin(false);
          setIsAdmin(false);
          setIsSuperAdmin(false);
          setName('');
        }
      } catch (error) {
        console.error('Token decoding error:', error);
        sessionStorage.removeItem('access-token');
        setIsLogin(false);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setName('');
      }
    } else {
        setIsLogin(false);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setName('');
    }
  }, []); // Run once on mount to check initial token

  const login = (token) => {
    sessionStorage.setItem('access-token', token);
    try {
      const data = decodeToken(token);
      if (data) {
        setIsLogin(true);
        setIsAdmin(data.isAdmin || false);
        setIsSuperAdmin(data.isSuperAdmin || false);
        setName(data.name || '');
      } else {
         // Token is invalid/expired
        sessionStorage.removeItem('access-token');
        setIsLogin(false);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setName('');
      }
    } catch (error) {
        console.error('Token decoding error:', error);
        sessionStorage.removeItem('access-token');
        setIsLogin(false);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setName('');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('access-token');
    setIsLogin(false);
    setIsAdmin(false);
    setIsSuperAdmin(false);
    setName('');
  };

  return (
    <AuthContext.Provider value={{ isLogin, isAdmin, isSuperAdmin, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 