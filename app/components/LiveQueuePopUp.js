import React, { useImperativeHandle, useRef, useEffect, forwardRef, useState } from 'react';

const LiveQueuePopUp = forwardRef(({ visible, onClose }, ref) => {
  const popupRef = useRef(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

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
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  const handleFastPassClick = () => {
    setConfirmVisible(true);
  };

  const handleConfirmClose = (confirm) => {
    setConfirmVisible(false);
    if (confirm) {
      // Handle Fast Pass logic here
      console.log('Fast pass purchased!');
    }
    onClose(); // Close the popup after confirmation
  };

  const handleJoinForFreeClick = () => {
    // Handle "Join for Free" logic here
    console.log('Joined for free!');
    onClose(); // Close the popup after joining for free
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-[101]">
      <div ref={popupRef} className="bg-gray-800 p-4 rounded shadow-lg mt-2 max-w-md w-full relative rounded-[5%]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl font-bold bg-transparent border-none cursor-pointer"
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mt-4 mb-6 text-center">Join the live queue</h3>
        <div className="flex flex-col justify-center items-center">
          <button 
            onClick={handleJoinForFreeClick}
            className="bg-gray-800/80 hover:bg-[#000110] text-white px-4 py-2 rounded mb-2 border border-blue-600 shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 max-w-[50%]"
          >
            Join for Free
          </button>
          <p className="ml-2">Est time: <span className="text-yellow-400 brightness-125">20m</span></p>
          <br />
          <p className="text-sm mb-1">You have <span className="text-yellow-400 brightness-125">1</span> free Fast Pass</p>
          <button 
            onClick={handleFastPassClick}
            className="bg-gray-800/80 hover:bg-[#000110] text-white px-4 py-2 rounded mb-2 border border-yellow-400 shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 brightness-125 max-w-[50%]"
          >
            Fast pass
          </button>
          <p className="ml-2">Est time: <span className="text-yellow-400 brightness-125 mb-10">2m</span></p>
        </div>
        {confirmVisible && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-[102]">
            <div className="bg-gray-800 p-4 rounded shadow-lg mt-2 max-w-md w-full relative rounded-[5%]">
              <h3 className="text-xl font-semibold mt-4 mb-6 text-center">Fast Pass Confirmation</h3>
              <p className="text-center text-white mb-6">A fast pass will cost you <span className='text-yellow-400 brightness-125'>100 tokens</span>, are you sure you want to continue?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleConfirmClose(false)}
                  className="bg-gray-800/80 hover:bg-[#000110] text-white px-4 py-2 rounded border border-blue-600 shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmClose(true)}
                  className="bg-gray-800/80 hover:bg-[#000110] text-white px-4 py-2 rounded border border-yellow-400 shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 brightness-125 max-w-[50%]"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default LiveQueuePopUp;
