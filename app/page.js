//main page.js 

"use client";

import React, { useContext, useEffect, useState } from 'react';
import Navbar from './components/Navbar'; 
import Chat from './components/Chat';
import Viewer from './components/Viewer';
import Votes from './components/Votes';
import CommentBox from './components/CommentBox';
import ViewersOnline from './components/ViewersOnline';
import MyMeLogo from './components/MyMeLogo';
import Menu from './components/menu/Menu';
import { AuthContext, AuthProvider } from '@/utils/AuthContext';

const HomeContent = () => {
  const { isLoggedIn, username } = useContext(AuthContext);
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
      <Navbar isLoggedIn={isLoggedIn} username={username} />
      <main className="flex flex-col items-center justify-center lg:max-w-[65%] w-full mx-auto">
        <Viewer />
        <Votes />
        <Chat />
      </main>
      <CommentBox />
      <ViewersOnline />
      <MyMeLogo isDarkBackground={isDarkBackground} />
      <Menu isLoggedIn={isLoggedIn} isDarkBackground={isDarkBackground} />
    </div>
  );
};

const Home = () => (
  <AuthProvider>
    <HomeContent />
  </AuthProvider>
);

export default Home;
