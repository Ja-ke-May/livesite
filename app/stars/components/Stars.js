"use client";

import { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/Navbar'; 
import MyMeLogo from '../../components/MyMeLogo';
import Menu from '../../components/menu/Menu';
import { AuthContext } from '@/utils/AuthContext';

const Stars = () => {
  const { isLoggedIn } = useContext(AuthContext);
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
        currentPath={currentPath} 
        setCurrentPath={setCurrentPath} 
      />
<div>
        <h1 className='mt-4'>Stars</h1>

        <h3>Longest Time Live</h3>
        <h3>Most Time Live</h3>
        <h3>Most Supporters</h3>
        <h3>Top Commenters</h3> 

        </div>

      </div>

      <MyMeLogo isDarkBackground={isDarkBackground} />
      <Menu 
        isLoggedIn={isLoggedIn} 
        currentPath={currentPath} 
        setCurrentPath={setCurrentPath} 
        isDarkBackground={isDarkBackground} 
      />
      </>
      
    );
  };
  
  export default Stars;
  