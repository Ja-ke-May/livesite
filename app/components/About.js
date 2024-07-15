"use client";

import { useState } from 'react';
import Navbar from './Navbar'; 
import BottomNavbar from './BottomNavbar';

const About = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const currentPath = '/about'; 
  
    return (
      <>
      <div>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} currentPath={currentPath} />
        <BottomNavbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} currentPath={currentPath} />
<div>
        <h1 className='mt-20'>About Us</h1>
        {/* Add profile details here */}
        </div>

      </div>
      </>
    );
  };
  
  export default About;
  