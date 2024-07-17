import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const linkClasses = "bg-gray-800/80 text-white px-2 md:px-4 py-2 mx-1 md:mx-2 rounded-t-lg hover:bg-[#000110]";
  const activeLinkClasses = "bg-[#000110] text-white px-2 md:px-4 py-2 mx-1 md:mx-2 rounded-t-lg"; 

  const isActive = (href) => href === currentPath;

  const handleLinkClick = (href) => {
    setCurrentPath(href);
  };

  const getLabel = (href, defaultLabel) => {
    if (currentPath === href) {
      switch (href) {
        case '/stars':
          return 'Stars';
        case '/shop':
          return 'Shop';
        case '/about':
          return 'About';
        case '/contact':
          return 'Contact';
        default:
          return defaultLabel;
      }
    }
    return defaultLabel;
  };

  const renderLink = (href, defaultLabel) => (
    <Link href={href} className={isActive(href) ? activeLinkClasses : linkClasses} aria-label={defaultLabel} onClick={() => handleLinkClick(href)}>
      {getLabel(href, defaultLabel)}
    </Link>
  );

  return (
    <nav className="w-full flex justify-center bg-white top-0 pt-4 md:text-lg">
      {renderLink('/', 'Home')}
      {currentPath === '/stars' && renderLink('/stars', 'Stars')}
      {currentPath === '/shop' && renderLink('/shop', 'Shop')}
      {currentPath === '/about' && renderLink('/about', 'About')}
      {currentPath === '/contact' && renderLink('/contact', 'Contact')}
      {isLoggedIn ? (
        renderLink('/profile', 'Profile')
      ) : (
        renderLink('/login', 'Log In')
      )}
    </nav>
  );
};

export default Navbar;
