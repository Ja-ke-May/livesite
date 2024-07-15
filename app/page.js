"use client";

import { useState } from 'react';
import Navbar from './components/Navbar'; 
import BottomNavbar from './components/BottomNavbar';
import Chat from './components/Chat';
import Viewer from './components/Viewer';
import Votes from './components/Votes';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Example initial state
  const [currentPath, setCurrentPath] = useState('/'); // Example current path

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} currentPath={currentPath} setCurrentPath={setCurrentPath} />
      <BottomNavbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} currentPath={currentPath} setCurrentPath={setCurrentPath} />
      <main className="flex flex-col items-center">
        <Viewer />
        <Votes />
        <Chat />
      </main>
    </div>
  );
}
