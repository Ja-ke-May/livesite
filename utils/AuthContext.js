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
   const [flag, setFlag] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username'); 
    const storedIsAdmin = localStorage.getItem('isAdmin'); 
      const storedFlag = localStorage.getItem('flag');

    const isAdminFlag = storedIsAdmin === 'true';  

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername); 
      setIsAdmin(isAdminFlag);  
       setFlag(storedFlag || "");
      
      fetchUserBlockedStatus(token, storedUsername).then((status) => {
        setIsBlocked(status); 
      });
    }

    setIsInitialized(true);  
  }, []);

  const login = (token, username, isAdmin ) => {

    localStorage.setItem('token', token);
    localStorage.setItem('username', username); 
    localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');  
localStorage.setItem('flag', flag || "");
    

    setIsLoggedIn(true);
    setUsername(username);
    setIsAdmin(isAdmin);  
     setFlag(flag || "");

    fetchUserBlockedStatus(token, username).then((status) => {
      setIsBlocked(status); 
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin'); 
    localStorage.removeItem('flag');


    setIsLoggedIn(false);
    setUsername('');
    setIsAdmin(false);  
    setIsBlocked(false);
    setFlag("");
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      username, 
      isAdmin, 
      isBlocked,
      flag,
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
