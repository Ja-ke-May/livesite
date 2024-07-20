import React, { useImperativeHandle, useRef, useEffect, forwardRef } from 'react';

const LinksPopUp = forwardRef(({ visible, onClose, links, username }, ref) => {
  const popupRef = useRef(null);

  useImperativeHandle(ref, () => ({
    contains: (element) => popupRef.current && popupRef.current.contains(element),
  }));

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
    <div ref={popupRef} className="relative absolute right-0 top-0 bg-gray-800 p-4 rounded-[5%] shadow-lg mt-2 max-w-md w-full">
      <button
        onClick={onClose}
        className="absolute top-0 right-2 text-white text-xl font-bold bg-transparent border-none cursor-pointer"
        aria-label="Close"
      >
        &times;
      </button>
      <h3 className="text-xl font-semibold mt-2 mb-4 text-center text-blue-400">{username} Links</h3>
      <ul>
        {links.length > 0 ? (
          links.map((link) => (
            <li key={link.id} className="flex items-center mb-2 text-white hover:text-blue-600">
              <a
                href={link.url}
                className="flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.imageUrl && (
                  <img
                    src={link.imageUrl}
                    alt={link.text}
                    className="h-8 w-8 m-2 rounded-[10%]"
                  />
                )}
                {link.text}
              </a>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-400">No links available</li>
        )}
      </ul>
    </div>
  );
});

export default LinksPopUp;
