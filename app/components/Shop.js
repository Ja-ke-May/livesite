"use client";

import { useState, useEffect, useContext } from 'react';
import Navbar from './Navbar'; 
import MyMeLogo from './MyMeLogo';
import { AuthContext } from '@/utils/AuthContext';

const Shop = () => {
  const { isLoggedIn, username } = useContext(AuthContext);
  const [currentPath, setCurrentPath] = useState('/shop');

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
          <h1 className='mt-4'>Shop</h1>
          


        </div>
      </div>
      
    </>
  );
};

export default Shop;
