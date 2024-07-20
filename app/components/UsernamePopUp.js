import React, { useRef, useEffect, useState } from 'react';
import LinksPopUp from './LinksPopUp';
import SendTokensPopUp from './SendTokens';
import Link from 'next/link';

const UsernamePopUp = ({ visible, onClose, links, username, position }) => {
  const [isSupportStar, setIsSupportStar] = useState(false);
  const [showLinksPopUp, setShowLinksPopUp] = useState(false);
  const [showSendTokensPopUp, setShowSendTokensPopUp] = useState(false);
  const popupRef = useRef(null);

  const toggleSupport = () => setIsSupportStar(!isSupportStar);
  const toggleLinksPopUp = () => setShowLinksPopUp(!showLinksPopUp);
  const toggleSendTokensPopUp = () => setShowSendTokensPopUp(!showSendTokensPopUp);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div ref={popupRef} className="absolute bg-gray-800 p-2 rounded-[5%] shadow-lg" style={{ top: position.y, left: position.x }}>
      <button
        onClick={onClose}
        className="absolute top-0 right-2 text-white text-xl font-bold bg-transparent border-none cursor-pointer"
        aria-label="Close"
      >
        &times;
      </button>

      <ul>

      <li className="text-lg md:text-xl md:pl-4 md:pr-4 cursor-pointer mt-4 ml-1 mr-1 mb-1">
          <Link href="/profile" className="hover:text-gray-400">
            View Profile
          </Link>
        </li>

        <li className="text-lg md:text-xl md:pl-4 md:pr-4 cursor-pointer mt-2 flex justify-between items-center hover:text-yellow-400 hover:brightness-125">
          <button
            onClick={toggleSendTokensPopUp}
            className="bg-transparent border-none cursor-pointer"
          >
            Send Tokens
          </button>
        </li>

        <li className="text-lg md:text-xl md:pl-4 md:pr-4 cursor-pointer mt-2 flex justify-between items-center text-white hover:text-yellow-400 brightness-125" onClick={toggleSupport}>
          Support
          <span
            className={`inline-block ml-2 cursor-pointer ${isSupportStar ? 'text-yellow-400 brightness-125 text-3xl' : 'w-6 h-6 border-2 border-blue-400 rounded-md'}`}
            onClick={toggleSupport}
          >
            {isSupportStar ? '⭐' : ''}
          </span>
        </li>

        <li className="text-lg md:text-xl md:pl-4 md:pr-4 cursor-pointer mt-2 flex justify-between items-center text-white hover:text-blue-600">
          <button
            onClick={toggleLinksPopUp}
            className="bg-transparent border-none cursor-pointer"
          >
            Links
          </button>
        </li>
       
       <li className='text-lg md:text-xl md:pl-4 md:pr-4 cursor-pointer mt-2 flex justify-between items-center text-red-400 hover:text-red-600'>
        Report
       </li>
      </ul>

      {showLinksPopUp && <LinksPopUp visible={showLinksPopUp} onClose={toggleLinksPopUp} links={links} username={username} />}
      {showSendTokensPopUp && <SendTokensPopUp visible={showSendTokensPopUp} onClose={toggleSendTokensPopUp} />}
    </div>
  );
};

export default UsernamePopUp;
