import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';

const SendTokensPopUp = forwardRef(({ visible, onClose }, ref) => {
  const [tokenAmount, setTokenAmount] = useState(1);
  const popupRef = useRef(null);

  useImperativeHandle(ref, () => ({
    contains: (element) => popupRef.current.contains(element),
  }));

  // Function to increment the token amount
  const incrementTokenCount = () => {
    setTokenAmount(prev => prev + 1);
  };

  const handleSendTokens = () => {
    console.log(`Sending ${tokenAmount} tokens`);
    onClose();
  };

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

      <h3 className="text-xl font-semibold mt-4 mb-4 text-center text-yellow-400 brightness-125">Send Tokens</h3>
      
      <div className="relative w-full p-2 mb-4 rounded bg-[#000110] text-white text-xl">
        <span>{tokenAmount}</span>
        <button
          className="absolute right-1 top-1/2 transform -translate-y-1/2 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
          onClick={incrementTokenCount}
        >
          +
        </button>
      </div>

      <div className="flex flex-row justify-end">
        
        <button
          className="mr-2 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white hover:text-[#000110] bg-[#000110] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 brightness-125"
          onClick={handleSendTokens}
        >
          Send
        </button>
      </div>
    </div>
  );
});

export default SendTokensPopUp;
