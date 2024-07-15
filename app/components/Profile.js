"use client";

import { useState } from 'react';
import Navbar from './/Navbar'; 

const Profile = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(true); // Example initial state
  const [currentPath, setCurrentPath] = useState('/profile');
  
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
        <h1 className='mt-20'>Profile</h1>
        {/* Add profile details here */}
        </div>

      </div>
      </>
    );
  };
  
  export default Profile;
  