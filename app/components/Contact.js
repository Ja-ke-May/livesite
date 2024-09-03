"use client";

import { useState, useContext } from 'react';
import Navbar from './Navbar'; 
import { AuthContext } from '@/utils/AuthContext';

const Contact = () => {
  const { isLoggedIn, username } = useContext(AuthContext);
  const [currentPath, setCurrentPath] = useState('/contact');

  return (
    <>
      <div>
        <Navbar 
          isLoggedIn={isLoggedIn}  
          currentPath={currentPath} 
          setCurrentPath={setCurrentPath} 
          username={username}
        />
        <div className="max-w-4xl mx-auto p-4 mt-4 text-center text-white">
          <h1 className='hidden text-2xl font-bold mb-4'>Contact Us</h1>
          <p className='text-lg mb-6'>We'd love to hear from you! If you have any questions, feedback, or concerns, please feel free to reach out:</p>
          <div className='space-y-4'>
            <p className='text-xl font-semibold'>
              <a 
                href="mailto:info@myme.live" 
                className="text-blue-500 brightness-125 hover:underline"
              >
                📧 info@myme.live
              </a>
            </p>
            <p className='text-xl font-semibold'>
              <a 
                target="_blank" 
                href="https://www.youtube.com/@MyMeLive" 
                className="text-red-500 brightness-125 font-black hover:underline"
              >
                🎥 YouTube
              </a>
            </p>
            <p className='text-xl font-semibold'>
              <a 
                target="_blank" 
                href="https://x.com/MyMe_Live" 
                className="text-white-500 brightness-125 font-black hover:underline"
              >
                🐦 X
              </a>
            </p>
            <p className='text-xl font-semibold'>
              <a 
                target="_blank" 
                href="https://www.instagram.com/myme.live/" 
                className="text-pink-500 brightness-125 font-black hover:underline"
              >
                📸 Instagram
              </a>
            </p>
          </div>
          <p className='text-lg mt-6'>
            We'll get back to you as soon as possible.
          </p>
        </div>

        <div className="w-full text-center mt-8 flex justify-center items-center">
          <a href="/" className="text-white font-black flex items-center z-[150]">
            <div className="flex items-center justify-center">
              <p className="text-5xl">M</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-xl leading-none">Y</p>
              <p className="text-xl leading-none">E</p>
            </div>
          </a>
        </div>
      </div>
    </>
  );
};

export default Contact;
