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
import { useRouter } from 'next/navigation';

const HomeContent = () => {
  const { isLoggedIn, username, isInitialized, isAdmin, logout, isBlocked } = useContext(AuthContext); 
  const [showOver18, setShowOver18] = useState(false); 
  const [socket, setSocket] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-3YM558MVY4';
    script.async = true;
    document.body.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-3YM558MVY4');

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const newSocket = io('https://livesite-backend.onrender.com', {
      reconnection: true,
      reconnectionAttempts: 1000, 
      reconnectionDelay: 1000, 
      reconnectionDelayMax: 5000, 
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('forceLogout', (data) => {
        alert(data.message); 
        socket.disconnect(); 
        logout(); 
        window.location.href = '/login'; 
      });
  
      return () => {
        socket.off('forceLogout');
      };
    }
  }, [socket, logout, router]);
  

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      const isOver18 = localStorage.getItem('isOver18');
      if (!isOver18) {
        setShowOver18(true);
      }
    }
  }, [isInitialized, isLoggedIn]);

  useEffect(() => {
    if (socket) {
      socket.on('receive-audio', (audioBase64) => {
        fetch(audioBase64)
          .then(res => res.blob())
          .then(blob => {
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audio.play();
          })
          .catch(err => console.error('Error playing audio:', err));
      });
  
      return () => {
        socket.off('receive-audio');
      };
    }
  }, [socket]);
  
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

  if (!socket) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className='hidden'>Home</h1>
      <Navbar isLoggedIn={isLoggedIn} username={username} />
      <main className="flex flex-col items-center justify-center lg:max-w-[60%] w-full mx-auto">
        <Viewer isAdmin={isAdmin} isBlocked={isBlocked} />
        
        <Chat isLoggedIn={isLoggedIn} username={username} socket={socket} isAdmin={isAdmin} />
      </main>
      <CommentBox isLoggedIn={isLoggedIn} username={username} socket={socket} isBlocked={isBlocked} />
      <ViewersOnline socket={socket} />
    </div>
  );
};

const Home = () => (
  <AuthProvider>
    <HomeContent />
  </AuthProvider>
);

export default Home;
