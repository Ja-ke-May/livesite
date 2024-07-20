import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';

const SendTokensPopUp = forwardRef(({ visible, onClose }, ref) => {
  const [tokenAmount, setTokenAmount] = useState(1);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [incrementInterval, setIncrementInterval] = useState(null);
  const popupRef = useRef(null);

  useImperativeHandle(ref, () => ({
    contains: (element) => popupRef.current.contains(element),
  }));

  // Handle token amount increment
  useEffect(() => {
    if (isIncrementing) {
      const intervalId = setInterval(() => {
        setTokenAmount(prev => prev + 1);
      }, 100);
      setIncrementInterval(intervalId);
    } else if (incrementInterval) {
      clearInterval(incrementInterval);
      setIncrementInterval(null);
    }

    return () => clearInterval(incrementInterval);
  }, [isIncrementing]);

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
    <div ref={popupRef} className="relative absolute right-0 top-0 bg-gray-800 p-4 rounded-[5%] shadow-lg mt-2 max-w-md w-full">
     
      
      <h3 className="text-xl font-semibold mb-4 text-center text-yellow-400 brightness-125">Send Tokens</h3>
      
      <div className="relative w-full p-2 mb-4 rounded border border-blue-600 bg-gray-900 text-white text-center text-xl">
        <span>{tokenAmount}</span>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
          onMouseDown={() => setIsIncrementing(true)}
          onMouseUp={() => setIsIncrementing(false)}
          onMouseLeave={() => setIsIncrementing(false)}
        >
          +
        </button>
      </div>

      <div className="flex justify-between">
        <button
          className="mr-2 py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="mr-2 py-2 px-4 border border-yellow-400 rounded-md shadow-sm text-sm font-medium text-white hover:text-[#000110] bg-gray-800/80 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 brightness-125"
          onClick={handleSendTokens}
        >
          Send
        </button>
      </div>
    </div>
  );
});

export default SendTokensPopUp;
