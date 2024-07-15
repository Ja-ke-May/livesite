"use client";

import { useState } from 'react';
import Navbar from './components/Navbar'; 
import Chat from './components/Chat';
import Viewer from './components/Viewer';
import Votes from './components/Votes';
import CommentBox from './components/CommentBox';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Example initial state
  const [currentPath, setCurrentPath] = useState('/'); // Example current path

  return (
    <div>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        currentPath={currentPath} 
        setCurrentPath={setCurrentPath} 
      />
      <main className="flex flex-col items-center">
        <Viewer />
        <Votes />
        <Chat />
      </main>
      <CommentBox />
    </div>
  );
}
