"use client";

import React, { createContext, useState, useEffect } from 'react'; 
import { fetchUserBlockedStatus } from '@/utils/apiClient'; 

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(''); 
  const [isAdmin, setIsAdmin] = useState(false); 
  const [isBlocked, setIsBlocked] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); 
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Retrieve token and user info from local storage
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username'); 
    const storedIsAdmin = localStorage.getItem('isAdmin'); 

    // Convert storedIsAdmin to boolean
    const isAdminFlag = storedIsAdmin === 'true';  

    s
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername); 
      setIsAdmin(isAdminFlag);  
      
      fetchUserBlockedStatus(token, storedUsername).then((status) => {
        setIsBlocked(status); 
      });
    }

    // Mark initialization as complete
    setIsInitialized(true);  
  }, []);

  const login = (token, username, isAdmin ) => {
    console.log('Login isAdmin received:', isAdmin); // Log what isAdmin value is received from the backend

    // Store token, username, and isAdmin in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('username', username); 
    localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');  // Ensure 'true'/'false' is stored as string

    // Log what is being stored in localStorage
    console.log('Stored in localStorage:', {
      token: token,
      username: username,
      isAdmin: localStorage.getItem('isAdmin')  // Check how isAdmin is stored
    });

    // Update state
    setIsLoggedIn(true);
    setUsername(username);
    setIsAdmin(isAdmin);  // Set the correct admin state based on the login response

    fetchUserBlockedStatus(token, username).then((status) => {
      setIsBlocked(status); // Set the blocked status in state
    });
  };

  const logout = () => {
    // Clear localStorage and reset state on logout
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');

    console.log('Clearing localStorage and logging out.');

    setIsLoggedIn(false);
    setUsername('');
    setIsAdmin(false);  // Reset isAdmin on logout
    setIsBlocked(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      username, 
      isAdmin, 
      isBlocked,
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
