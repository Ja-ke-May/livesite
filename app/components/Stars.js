"use client";

import { useState, useEffect } from 'react';
import Navbar from './Navbar'; 
import MyMeLogo from './MyMeLogo';
import Menu from './menu/Menu';

const Stars = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [currentPath, setCurrentPath] = useState('/stars');
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
        <h1 className='mt-4'>Stars</h1>

        <h3>Longest Tine Live</h3>
        <h3>Most Time Live</h3>
        <h3>Most Supporters</h3>
        <h3>Top Commenters</h3> 

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
  
  export default Stars;
  