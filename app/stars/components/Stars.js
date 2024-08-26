"use client";

import { useState, useContext } from 'react';
import Navbar from '../../components/Navbar'; 
import { AuthContext } from '@/utils/AuthContext';

const Stars = () => {
  const { isLoggedIn, username } = useContext(AuthContext);
  const [currentPath, setCurrentPath] = useState('/stars');
 

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
          <h1 className='mt-4'>Stars Leaderboards</h1>
          
          
          <h3>Coming soon...</h3>



        </div>
      </div>
      
    </>
  );
};

export default Stars;
