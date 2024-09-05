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

    // Log values retrieved from localStorage
    console.log('Token:', token);
    console.log('Stored Username:', storedUsername);
    console.log('Stored isAdmin (from localStorage):', storedIsAdmin);  

    // Convert storedIsAdmin to boolean
    const isAdminFlag = storedIsAdmin === 'true';  

    // If token and username exist, set the user as logged in
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername); 
      setIsAdmin(isAdminFlag);  // Set admin status based on the stored value
      console.log('User logged in with isAdmin:', isAdminFlag);  // Log the set value of isAdmin
    }

    // Mark initialization as complete
    setIsInitialized(true);  
  }, []);

  const login = (token, username, isAdmin = false) => {
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

    console.log('State after login - isAdmin:', isAdmin);  // Log state after setting isAdmin
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
