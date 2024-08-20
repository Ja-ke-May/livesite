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
          
          
          <h3>Longest Time Live</h3>
        <h3>Total Time Live</h3>
        <h3>Supporters</h3>
        <h3>Comments</h3> 



        </div>
      </div>
      
    </>
  );
};

export default Stars;
