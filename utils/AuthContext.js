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
    // Retrieve token and user info from local storage
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username'); 
    const storedIsAdmin = localStorage.getItem('isAdmin');

    console.log('Token:', token);
    console.log('Stored Username:', storedUsername);
    console.log('Stored isAdmin:', storedIsAdmin);  

    // Convert storedIsAdmin to boolean
    const isAdminFlag = storedIsAdmin === 'true';  

    // If token and username exist, set the user as logged in
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername); 
      setIsAdmin(isAdminFlag);  // Set admin status based on the stored value
    }

    // Mark initialization as complete
    setIsInitialized(true);  
  }, []);

  const login = (token, username, isAdmin = false) => {
    console.log('Login isAdmin received:', isAdmin); // Log what isAdmin value is received

    // Store token, username, and isAdmin in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('username', username); 
    localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false'); 

    // Update state
    setIsLoggedIn(true);
    setUsername(username);
    setIsAdmin(isAdmin);  // Set the correct admin state based on the login response
  };

  const logout = () => {
    // Clear localStorage and reset state on logout
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');

    setIsLoggedIn(false);
    setUsername('');
    setIsAdmin(false); 
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      username, 
      isAdmin, 
      login, 
      logout, 
      isInitialized, 
      notificationCount, 
      setNotificationCount 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
