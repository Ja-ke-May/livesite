// Home.js or App.js
"use client";

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar'; 
import Chat from './components/Chat';
import Viewer from './components/Viewer';
import Votes from './components/Votes';
import CommentBox from './components/CommentBox';
import ViewersOnline from './components/ViewersOnline';
import MyMeLogo from './components/MyMeLogo';
import Menu from './components/menu/Menu';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState('');
  const [currentPath, setCurrentPath] = useState('/');
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
    <div>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        currentPath={currentPath} 
        setCurrentPath={setCurrentPath} 
      />
      <main className="flex flex-col items-center justify-center lg:max-w-[65%] w-full mx-auto">
        <Viewer />
        <Votes />
        <Chat />
      </main>
      <CommentBox />
      <ViewersOnline />

      <MyMeLogo isDarkBackground={isDarkBackground} />
      <Menu 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        currentPath={currentPath} 
        setCurrentPath={setCurrentPath} 
        isDarkBackground={isDarkBackground} 
      />
      
    </div>
  );
};

export default Home;
