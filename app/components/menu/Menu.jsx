import React, { useState } from 'react';
import Link from 'next/link';
import './menu.css';
import MenuIcon from './MenuIcon';

const Menu = ({ isLoggedIn, setIsLoggedIn, currentPath, setCurrentPath }) => {
  const [showMenuList, setShowMenuList] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleMenuClick = () => {
    setShowMenuList(prevState => !prevState);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    
    setShowLogoutConfirm(false); // Close the confirmation popup
    setCurrentPath('/');
    window.location.href = '/';
  };

  const handleLinkClick = (href) => {
    setCurrentPath(href);
  };

  return (
    <>
      <div>
        {showMenuList && (
          <section
            id="menu-list"
            className='fixed top-0 right-0 md:pr-2 md:pt-2 bg-gray-800/80 text-white text-xl md:text-2xl p-4 z-50 rounded-bl-3xl'
          >
            <Link href="/about" passHref>
              <button 
                className="hover:text-gray-400 text-lg md:text-xl md:pl-4 md:pr-4 block mt-10 md:pt-2" 
                title='about'
                onClick={() => handleLinkClick('/about')}
              >
                About
              </button>
            </Link>
            
            <Link href="/tokens" passHref>
              <button 
                className="hover:text-gray-400 text-lg md:text-xl md:pl-4 md:pr-4 block" 
                title='tokens'
                onClick={() => handleLinkClick('/tokens')}
              >
                Tokens
              </button>
            </Link>

            <Link href="/Leaderboards" passHref>
              <button 
                className="hover:text-gray-400 text-lg md:text-xl md:pl-4 md:pr-4 block" 
                title='leaderboards'
                onClick={() => handleLinkClick('/Leaderboards')}
              >
                Leaderboards
              </button>
            </Link>

            <Link href="/help" passHref>
              <button 
                className="hover:text-gray-400 text-lg md:text-xl md:pl-4 md:pr-4 block" 
                title='help'
                onClick={() => handleLinkClick('/help')}
              >
                Help
              </button>
            </Link>

            <Link href="/contact" passHref>
              <button 
                className="hover:text-gray-400 text-lg md:text-xl md:pl-4 md:pr-4 block" 
                title='contact'
                onClick={() => handleLinkClick('/contact')}
              >
                Contact
              </button>
            </Link>

            {isLoggedIn && (
              <button 
                onClick={() => setShowLogoutConfirm(true)} 
                className="hover:text-gray-400 text-lg md:text-xl md:pl-4 md:pr-4 block" 
                title='logout'
              >
                Log Out
              </button>
            )}
          </section>
        )}
      </div>
      <MenuIcon onMenuToggle={handleMenuClick} />
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
            <h2 className="text-xl text-blue-900 text-center mb-4">Are you sure you want to log out?</h2>
            <div className="flex justify-center">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-blue-900 rounded-md mr-2 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
