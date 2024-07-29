//main page.js 

"use client";

import React, { useContext } from 'react';
import Navbar from './components/Navbar'; 
import Chat from './components/Chat';
import Viewer from './components/viewer/Viewer';
import Votes from './components/Votes';
import CommentBox from './components/comments/CommentBox';
import ViewersOnline from './components/ViewersOnline';
import { AuthContext, AuthProvider } from '@/utils/AuthContext';

const HomeContent = () => {
  const { isLoggedIn, username } = useContext(AuthContext);

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
    </div>
  );
};

const Home = () => (
  <AuthProvider>
    <HomeContent />
  </AuthProvider>
);

export default Home;
