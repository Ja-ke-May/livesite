"use client";

import React from 'react';
import Link from 'next/link';
import MyMeLogo from './MyMeLogo';
import Menu from './menu/Menu';

const Navbar = ({ isLoggedIn, setIsLoggedIn, currentPath, setCurrentPath }) => {
  const linkClasses = "bg-gray-800/80 text-white px-2 md:px-4 py-2 mx-1 md:mx-2 rounded-t-lg hover:bg-[#000110]";
  const activeLinkClasses = "bg-[#000110] text-white px-2 md:px-4 py-2 mx-1 md:mx-2 rounded-t-lg"; // Style for active link

  const isActive = (href) => href === currentPath;

  const handleLinkClick = (href) => {
    setCurrentPath(href);
  };

  const renderLink = (href, label) => (
    <Link href={href} className={isActive(href) ? activeLinkClasses : linkClasses} aria-label={label} onClick={() => handleLinkClick(href)}>
      {label}
    </Link>
  );

  return (
    <nav className="fixed w-full flex justify-center bg-white top-0 pt-4 md:text-lg">
      <MyMeLogo />
      <Menu 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        currentPath={currentPath} 
        setCurrentPath={setCurrentPath} 
      />
      {renderLink('/', 'Home')}
      {isLoggedIn ? (
        renderLink('/profile', 'Profile')
      ) : (
        renderLink('/login', 'Log In')
      )}
    </nav>
  );
};

export default Navbar;
