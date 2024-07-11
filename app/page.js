"use client";

import Navbar from './components/Navbar';
import Viewer from './components/Viewer';
import Votes from './components/Votes';
import Chat from './components/Chat';

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-[98%] flex-col items-center">
      <Navbar />
      <Viewer />
      <Votes />
      <Chat />
    </main>
  );
}
