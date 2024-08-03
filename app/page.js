//main page.js 

"use client";

import React, { useContext, useState, useEffect } from 'react';
import Navbar from './components/Navbar'; 
import Chat from './components/Chat';
import Viewer from './components/viewer/Viewer';
import Votes from './components/Votes';
import CommentBox from './components/comments/CommentBox';
import ViewersOnline from './components/ViewersOnline';
import { AuthContext, AuthProvider } from '@/utils/AuthContext'; 
import Over18 from './components/Over18';

const HomeContent = () => {
  const { isLoggedIn, username, isInitialized } = useContext(AuthContext); 
  const [showOver18, setShowOver18] = useState(false);

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      const isOver18 = localStorage.getItem('isOver18');
      if (!isOver18) {
        setShowOver18(true);
      }
    }
  }, [isInitialized, isLoggedIn]);

  const handleOver18Confirm = (isOver18) => {
    if (isOver18) {
      localStorage.setItem('isOver18', 'true');
      setShowOver18(false);
    } else {
      alert('You must be over 18 to use this site.');
      window.history.back();
    }
  };

  if (showOver18) {
    return <Over18 onConfirm={handleOver18Confirm} />;
  }

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} username={username} />
      <main className="flex flex-col items-center justify-center lg:max-w-[60%] w-full mx-auto">
        <Viewer />
        
        <Chat />
      </main>
      <CommentBox />
      <ViewersOnline />
    </div>
  );
};

const Home = () => (
  <AuthProvider>
    <HomeContent />
  </AuthProvider>
);

export default Home;
