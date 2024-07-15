"use client";

import Link from 'next/link';

const BottomNavbar = ({ isLoggedIn, setIsLoggedIn, currentPath, setCurrentPath }) => {
  const linkClasses = "bg-gray-800/80 text-white px-2 md:px-4 py-2 mx-1 md:mx-2 rounded-b-lg hover:bg-[#000110]";
  const activeLinkClasses = "bg-[#000110] text-white px-2 md:px-4 py-2 mx-1 md:mx-2 rounded-b-lg"; // Style for active link

  const isActive = (href) => href === currentPath;

  const handleLogout = (e) => {
    
    setIsLoggedIn(false);
    setCurrentPath('/'); // Update the current path to home
  };

  const handleLinkClick = (href) => {
    setCurrentPath(href);
  };

  const renderLink = (href, label) => (
    <Link href={href} className={isActive(href) ? activeLinkClasses : linkClasses} aria-label={label} onClick={() => handleLinkClick(href)}>
      {label}
    </Link>
  );

  return (
    <nav className="fixed w-full flex justify-center bg-white bottom-0 pb-4 md:text-lg">
      {isLoggedIn ? (
        <>
          {renderLink('/', 'Live Chat')}
          <a onClick={handleLogout} className={linkClasses} aria-label="Log Out" href="/">
            Log Out
          </a>
        </>
      ) : (
        <>
          {renderLink('/', 'Live Chat')}
          {renderLink('/about', 'About')}
        </>
      )}
    </nav>
  );
};

export default BottomNavbar;
