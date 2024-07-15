"use client";

import { useState } from 'react';
import Navbar from './Navbar'; 

const About = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [currentPath, setCurrentPath] = useState('/about');
  
    return (
      <>
      <div>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        currentPath={currentPath} 
        setCurrentPath={setCurrentPath} 
      />
<div>
        <h1 className='mt-20'>About Us</h1>
        {/* Add profile details here */}
        </div>

      </div>
      </>
    );
  };
  
  export default About;
  