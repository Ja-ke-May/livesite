"use client";

import { useState, useEffect } from 'react';
import Navbar from './Navbar'; 
import MyMeLogo from './MyMeLogo';
import Menu from './menu/Menu';

const Profile = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(true); // Example initial state
  const [currentPath, setCurrentPath] = useState('/profile');
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 10; 
      if (scrollY > threshold && !isDarkBackground) {
        setIsDarkBackground(true);
      } else if (scrollY <= threshold && isDarkBackground) {
        setIsDarkBackground(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDarkBackground]);
  
    return (
      <>
      <div>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        currentPath={currentPath} 
        setCurrentPath={setCurrentPath} 
      />
<div>
        <h1 className='mt-4'>Profile</h1>
        {/* Add profile details here */}
        </div>

      </div>

      <MyMeLogo isDarkBackground={isDarkBackground} />
      <Menu 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        currentPath={currentPath} 
        setCurrentPath={setCurrentPath} 
        isDarkBackground={isDarkBackground} 
      />
      </>
    );
  };
  
  export default Profile;
  