"use client";

import { useState, useEffect, useContext } from 'react';
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
        <div>
          <h1 className='mt-4'>Contact</h1>
          
          
      



        </div>
      </div>
      
    </>
  );
};

export default Contact;
