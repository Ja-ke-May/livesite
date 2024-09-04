"use client";

import React, { createContext, useState, useEffect } from 'react'; 

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(''); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); 
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username'); 
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true'; 

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername); 
      setIsAdmin(storedIsAdmin);
    }
    setIsInitialized(true);
  }, []);

  const login = (token, username, isAdmin = false ) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username); 
    localStorage.setItem('isAdmin', isAdmin); 

    setIsLoggedIn(true);
    setUsername(username);
    setIsAdmin(isAdmin); 
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');

    setIsLoggedIn(false);
    setUsername('');
    setIsAdmin(false); 
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, isAdmin, login, logout, isInitialized, notificationCount, setNotificationCount }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
