"use client";

import { useState } from 'react';
import Navbar from './/Navbar'; 
import BottomNavbar from './BottomNavbar';

const Profile = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(true); // Example initial state
  const currentPath = '/profile'; 
  
    return (
      <>
      <div>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} currentPath={currentPath} />
        <BottomNavbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} currentPath={currentPath} />
<div>
        <h1 className='mt-20'>Profile</h1>
        {/* Add profile details here */}
        </div>

      </div>
      </>
    );
  };
  
  export default Profile;
  