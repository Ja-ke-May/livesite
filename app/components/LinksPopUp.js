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
    <div ref={popupRef} className="relative absolute right-0 top-0 bg-[#000110] p-4 rounded-[5%] shadow-lg mt-2 max-w-md w-full z-[101]">
      <button
        onClick={onClose}
        className="absolute top-0 right-2 text-white text-xl font-bold bg-transparent border-none cursor-pointer"
        aria-label="Close"
      >
        &times;
      </button>
      
      <h3 className="text-xl font-semibold mt-4 mb-4 text-center">{username}'s Links</h3>
      <div className='max-h-[400px] overflow-y-auto'>
        <ul>
          {links.length > 0 ? (
            links.map((link, index) => (
              <li key={link.id || index} className="flex items-center mb-2 text-white hover:text-blue-600">
                <a
                  href={link.url}
                  className="flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.imageUrl && (
                    <img
                      src={`data:image/jpeg;base64,${link.imageUrl}`}
                      alt={link.text}
                      className="max-h-8 max-w-8 m-2 rounded-[10%]"
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
    </div>
  );
});

export default LinksPopUp;
