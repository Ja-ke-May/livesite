import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/utils/AuthContext';
import Menu from './menu/Menu'; 
import MyMeLogo from './MyMeLogo';

const Navbar = () => {
  const { isLoggedIn, username, notificationCount } = useContext(AuthContext);
  const [currentPath, setCurrentPath] = useState('');
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 10; 
      setIsDarkBackground(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const linkClasses = "bg-gray-800/80 text-white px-2 md:px-4 py-2 mx-1 md:mx-2 rounded-t-lg hover:bg-[#000110]";
  const activeLinkClasses = "bg-[#000110] text-white px-2 md:px-4 py-2 mx-1 md:mx-2 rounded-t-lg"; 

  const isActive = (href) => href === currentPath;

  const handleLinkClick = (href) => {
    setCurrentPath(href);
  };

  const renderLink = (href, defaultLabel) => (
    <Link href={href} key={href} className={isActive(href) ? activeLinkClasses : linkClasses} aria-label={defaultLabel} onClick={() => handleLinkClick(href)}>
      {defaultLabel}
    </Link>
  );

  const renderProfileLink = () => (
    <div className="relative flex items-center">
      {username ? renderLink(`/profile/${username}`, 'Profile') : renderLink('/login', 'Log In')}
      {notificationCount > 0 && (
        <div className="absolute -top-2 -right-1 w-4 h-4 bg-red-700 text-xs text-white flex items-center justify-center rounded-[10%] hover:scale-150">
          {notificationCount}
        </div>
      )}
    </div>
  );

  return (
    <nav className="w-full flex justify-center items-center bg-white top-0 pt-4 md:text-lg">
      <div className="flex">
        {renderLink('/', 'Home')}
      </div>
      <div className="flex">
        {['/stars', '/shop', '/about', '/contact'].map((path) => (
          currentPath === path && renderLink(path, path.charAt(1).toUpperCase() + path.slice(2))
        ))}
      </div>
      <div className="flex">
        {isLoggedIn ? renderProfileLink() : renderLink('/login', 'Log In')}
      </div>
      <MyMeLogo isDarkBackground={isDarkBackground} />
      <Menu setCurrentPath={setCurrentPath} isDarkBackground={isDarkBackground}/>
    </nav>
  );
};

export default Navbar;
