import React, { useState, useRef } from 'react';
import ActionConfirmationPopup from './ActionConfirmationPopup'; 

const SpeakerButton = ({ isLoggedIn }) => {
  const [expanded, setExpanded] = useState(false);
  const [action, setAction] = useState(null);
  const popupRef = useRef();

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const handleActionClick = (actionName) => {
    setAction(actionName);
    setExpanded(false);
    popupRef.current.openPopup();
  };

  const handlePopupClose = (confirm) => {
    if (confirm) {
      console.log(`${action} confirmed, costs 100 tokens`);
    }
    setAction(null);
  };

  return (
    <>
    <div className="fixed flex items-center w-full">
      {expanded && (
        <div className="left-0 text-[#000110] rounded-md py-2 w-full focus:outline-none bg-[#000110] z-[102] flex justify-center">
          <div className="space-x-2">
            <button 
              className="px-1 py-1 rounded-md shadow-sm text-lg md:text-xl font-medium text-white bg-green-700 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-900"
              onClick={() => handleActionClick('Woo')}
            >
              Woo
            </button>
            <button 
              className="px-1 py-1 rounded-md shadow-sm text-lg md:text-xl font-medium text-white bg-blue-700 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
              onClick={() => handleActionClick('Boo')}
            >
              Boo
            </button>
            <button 
              className="px-1 py-1 rounded-md shadow-sm text-lg md:text-xl font-medium text-white bg-orange-700 hover:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-900"
              onClick={() => handleActionClick('Haha')}
            >
              Haha
            </button>
            <button 
              className="px-1 py-1 rounded-md shadow-sm text-lg md:text-xl font-medium text-white bg-red-700 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900"
              onClick={() => handleActionClick('Record')}
            >
              Record
            </button>
          </div>
        </div>
      )}
      
      <ActionConfirmationPopup 
        ref={popupRef} 
        visible={!!action} 
        action={action}
        onClose={handlePopupClose}
      />
    </div>
    <button 
        onClick={handleClick}
        className={`ml-2 mr-0 py-2 rounded-md shadow-sm text-lg md:text-xl font-medium text-white bg-[#000110] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 z-[101] ${
          !isLoggedIn && 'opacity-50 cursor-not-allowed'
        }`}
        disabled={!isLoggedIn} 
      >
        🔊
      </button>
  </>
  );
};

export default SpeakerButton;
