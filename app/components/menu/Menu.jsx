import React, { useState, useContext } from 'react';
import Link from 'next/link';
import './menu.css';
import MenuIcon from './MenuIcon';
import { logout } from '../../../utils/apiClient'; 
import { AuthProvider, AuthContext } from '@/utils/AuthContext';

const Menu = ({ isDarkBackground }) => {
  const { isLoggedIn, isLoading } = useContext(AuthContext);
  const [showMenuList, setShowMenuList] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleMenuClick = () => {
    setShowMenuList(prevState => !prevState);
  };

  const handleLogout = () => {
    logout(); 
    
    setShowLogoutConfirm(false); 
    window.location.href = '/'; 
  };

 

  return (
    
      <>
        <div>
          {showMenuList && (
            <section
              id="menu-list"
              className='fixed top-0 right-0 md:pr-2 md:pt-2 bg-gray-800/90 text-white font-extrabold text-xl md:text-2xl p-4 z-50 rounded-bl-3xl'
            >
              <Link href="/stars" passHref>
                <button 
                  className="hover:text-yellow-400 hover:brightness-125 text-lg md:text-xl md:pl-4 md:pr-4 block mt-10 md:pt-4" 
                  title='stars'
                >
                  Stars
                </button>
              </Link>

              <Link href="/shop" passHref>
                <button 
                  className="hover:text-gray-400 text-lg md:text-xl md:pl-4 md:pr-4 block" 
                  title='shop'
                >
                  Shop
                </button>
              </Link>

              <Link href="/about" passHref>
                <button 
                  className="hover:text-gray-400 text-lg md:text-xl md:pl-4 md:pr-4 block" 
                  title='about'
                >
                  About
                </button>
              </Link>

              <Link href="/contact" passHref>
                <button 
                  className="hover:text-gray-400 text-lg md:text-xl md:pl-4 md:pr-4 block" 
                  title='contact'
                >
                  Contact
                </button>
              </Link>

              {isLoading ? (
                <div>Loading...</div> 
              ) : (
                isLoggedIn && (
                  <button 
                    onClick={() => setShowLogoutConfirm(true)} 
                    className="text-red-600 hover:text-red-700 text-lg md:text-xl md:pl-4 md:pr-4 block" 
                    title='logout'
                  >
                    Log Out
                  </button>
                )
              )}
            </section>
          )}
        </div>
        <MenuIcon onMenuToggle={handleMenuClick} isDarkBackground={isDarkBackground} />
        {showLogoutConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#000110]/90 z-50">
            <div className="p-4 md:p-6 rounded-lg shadow-lg bg-[#000110]/80">
              <h2 className="text-xl text-center mb-4">Are you sure you want to log out?</h2>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="mr-2 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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
