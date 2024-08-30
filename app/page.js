"use client";

import React, { useContext, useState, useEffect } from 'react';
import Navbar from './components/Navbar'; 
import Chat from './components/comments/Chat';
import Viewer from './components/viewer/Viewer';
import CommentBox from './components/comments/CommentBox';
import ViewersOnline from './components/ViewersOnline';
import { AuthContext, AuthProvider } from '@/utils/AuthContext'; 
import Over18 from './components/Over18';
import io from 'socket.io-client';


const HomeContent = () => {
  const { isLoggedIn, username, isInitialized } = useContext(AuthContext); 
  const [showOver18, setShowOver18] = useState(false); 

  let socket = io('https://livesite-backend.onrender.com', {
    reconnection: true,
    reconnectionAttempts: 1000, 
    reconnectionDelay: 1000, 
    reconnectionDelayMax: 5000, 
  });
   

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
      <h1 className='hidden'>Home</h1>
      <Navbar isLoggedIn={isLoggedIn} username={username} />
      <main className="flex flex-col items-center justify-center lg:max-w-[60%] w-full mx-auto">
        <Viewer socket={socket} />
        
        <Chat isLoggedIn={isLoggedIn} username={username} socket={socket} />
      </main>
      <CommentBox isLoggedIn={isLoggedIn} username={username} socket={socket} />
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
