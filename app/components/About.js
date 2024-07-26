"use client";

import { useState, useEffect, useContext } from 'react';
import Navbar from './Navbar'; 
import { AuthContext } from '@/utils/AuthContext';

const About = () => {
  const { isLoggedIn, username } = useContext(AuthContext);
  const [currentPath, setCurrentPath] = useState('/about');


  return (
    <>
      <div>
        <Navbar 
          isLoggedIn={isLoggedIn}  
          currentPath={currentPath} 
          setCurrentPath={setCurrentPath} 
          username={username}
        />
        <div>
          <h1 className='mt-4'>About Us</h1>
          {/* Add profile details here */}
        </div>
      </div>
      
    </>
  );
};

export default About;
