import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import LinksPopUp from './LinksPopUp';
import SendTokensPopUp from './SendTokens';
import ReportPopUp from './ReportPopUp';
import Link from 'next/link';

const UsernamePopUp = ({
  visible,
  onClose,
  links,
  username,
  position,
  isUserSupported,
  onToggleSupport,
  isAdmin
}) => {
  const [activePopUp, setActivePopUp] = useState(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const popupRef = useRef(null);

  const handlePopUpToggle = (popUpName) => {
    setActivePopUp((prev) => (prev === popUpName ? null : popUpName));
  };

  // Adjust position without mutating props
  useEffect(() => {
    if (visible && popupRef.current) {
      const { innerWidth, innerHeight } = window;
      const popupRect = popupRef.current.getBoundingClientRect();

      let adjustedX = position.x;
      let adjustedY = position.y;

      if (popupRect.right > innerWidth) {
        adjustedX = Math.max(innerWidth - popupRect.width, 0);
      }
      if (popupRect.bottom > innerHeight) {
        adjustedY = Math.max(innerHeight - popupRect.height, 0);
      }

      setAdjustedPosition({ x: adjustedX, y: adjustedY });
    }
  }, [visible, position]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return createPortal(
    <div
      ref={popupRef}
      className="fixed bg-[#000110] p-2 rounded-[5%] shadow-lg z-[101]"
      style={{
        top: adjustedPosition.y,
        left: adjustedPosition.x
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-0 right-2 text-white text-xl font-bold bg-transparent border-none cursor-pointer"
        aria-label="Close"
      >
        &times;
      </button>

      <ul>
        <li className="text-lg md:text-xl md:pl-4 md:pr-4 cursor-pointer mt-4 mr-1 mb-1">
          <Link href={`/profile/${username}`} className="hover:text-gray-400">
            {username}'s Profile
          </Link>
        </li>

        <li className="text-lg md:text-xl md:pl-4 md:pr-4 cursor-pointer mt-2 flex justify-between items-center hover:text-yellow-400 hover:brightness-125">
          <button
            onClick={() => handlePopUpToggle('sendTokens')}
            className="bg-transparent border-none cursor-pointer"
          >
            Send Tokens
          </button>
        </li>

        <li
          className="text-lg md:text-xl md:pl-4 md:pr-4 cursor-pointer mt-2 flex justify-between items-center text-white hover:text-yellow-400 brightness-125"
          onClick={onToggleSupport}
        >
          Support
          <span
            className={`inline-block ml-2 cursor-pointer ${
              isUserSupported
                ? 'text-yellow-400 brightness-125 text-3xl'
                : 'w-6 h-6 border-2 border-white rounded-md'
            }`}
          >
            {isUserSupported ? '⭐' : ''}
          </span>
        </li>

        <li className="text-lg md:text-xl md:pl-4 md:pr-4 cursor-pointer mt-2 flex justify-between items-center text-white hover:text-blue-600">
          <button
            onClick={() => handlePopUpToggle('links')}
            className="bg-transparent border-none cursor-pointer"
          >
            Links
          </button>
        </li>

        <li className="text-lg md:text-xl md:pl-4 md:pr-4 cursor-pointer mt-2 flex justify-between items-center text-red-400 hover:text-red-600">
          <button onClick={() => handlePopUpToggle('report')}>Report</button>
        </li>
      </ul>

      {activePopUp === 'links' && (
        <LinksPopUp
          visible={activePopUp === 'links'}
          onClose={() => handlePopUpToggle('links')}
          links={links}
          username={username}
        />
      )}
      {activePopUp === 'sendTokens' && (
        <SendTokensPopUp
          recipientUsername={username}
          visible={activePopUp === 'sendTokens'}
          onClose={() => handlePopUpToggle('sendTokens')}
        />
      )}
      {activePopUp === 'report' && (
        <ReportPopUp
          visible={activePopUp === 'report'}
          onClose={() => handlePopUpToggle('report')}
          username={username}
          isAdmin={isAdmin}
        />
      )}
    </div>,
    document.body
  );
};

export default UsernamePopUp;
