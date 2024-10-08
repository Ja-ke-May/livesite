"use client";

import { useState, useContext, useEffect } from 'react';
import Navbar from '../../components/Navbar'; 
import { AuthContext } from '@/utils/AuthContext';

const Stars = () => {

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-3YM558MVY4';
    script.async = true;
    document.body.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-3YM558MVY4');

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

        <div className="w-full text-center mt-8 flex justify-center items-center">
          
              <a href="/" className={`text-white font-black flex items-centerz-[150]`}>
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

export default Stars;
