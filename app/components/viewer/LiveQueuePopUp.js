import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react';
import { deductTokens } from '@/utils/apiClient';

const LiveQueuePopUp = forwardRef(({ visible, onClose, onJoin, queueLength }, ref) => {
  const popupRef = useRef(null);
  const confirmRef = useRef(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    contains: (element) => popupRef.current && popupRef.current.contains(element),
  }));

  const handleFastPassClick = () => {
    setConfirmVisible(true);
  };

  const handleConfirmClose = async (confirm) => {
    setLoading(true);
    
    if (confirm) {
      try {
        await deductTokens(100); 
        onJoin(true); 
        onClose(); 
      } catch (error) {
        console.error("You don't have enough tokens:", error);
      setErrorMessage(error.message || "You don't have enough tokens");
      } finally {
        setLoading(false); 
      }
    }
    setConfirmVisible(false);
  };

  const handleJoinForFreeClick = () => {
    onJoin(); 
    onClose(); 
  };

  if (!visible && !confirmVisible) return null;

  return (
    <>
      {visible && !confirmVisible && (
        <div className="fixed inset-0 bg-[#000110]/80 flex items-center justify-center z-[101]">
          <div
            ref={popupRef}
            className="bg-[#000110] p-4 rounded shadow-lg mt-2 max-w-md w-full relative rounded-[5%]"
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-white text-xl font-bold bg-transparent border-none cursor-pointer"
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mt-2 mb-2 text-center">Join the live queue</h3>
            <p className='text-center mb-5'>There are currently: 
              <br />
              {queueLength}
              <br />
              people in the queue.
            </p>
            
            <div className="flex flex-col justify-center items-center">
              <button 
                onClick={handleJoinForFreeClick}
                className="text-white px-4 py-2 rounded-md shadow-sm text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 max-w-[50%]"
              >
                Join for Free
              </button>
              {/* <p className="ml-2">Est time: <span className="text-yellow-400 brightness-125 mb-10">20m</span></p> */}
              <br />
              {/* <p className="text-sm mb-2">You have <span className="text-yellow-400 brightness-125">1</span> free Fast Pass</p> */}
              <button 
                onClick={handleFastPassClick}
                className="border border-yellow-400 hover:bg-yellow-400 hover:brightness-125 hover:text-[#000110] text-white px-4 py-2 rounded-md shadow-sm text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 max-w-[50%] mb-2 brightness-125"
              >
                Fast Pass
              </button>
              {/* <p className="ml-2">Est time: <span className="text-yellow-400 brightness-125 mb-10">2m</span></p> */}
            </div>
          </div>
        </div>
      )}
      
      {confirmVisible && (
        <div className="fixed bg-[#000110]/80 inset-0 min-h-full flex items-center justify-center z-[102]">
          <div
            ref={confirmRef}
            className="bg-[#000110] p-4 rounded shadow-lg mt-2 max-w-md w-full relative rounded-[5%]"
          >
            <button
              onClick={() => handleConfirmClose(false)}
              className="absolute top-2 right-2 text-white text-xl font-bold bg-transparent border-none cursor-pointer"
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mt-2 mb-4 text-center">Fast Pass Confirmation</h3>
            <p className="text-center text-white mb-6">A fast pass will cost you <span className='text-yellow-400 brightness-125'>100 tokens</span>, are you sure you want to continue?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleConfirmClose(false)}
                className="text-white px-4 py-2 rounded-md shadow-sm text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white-400 max-w-[50%]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmClose(true)}
                disabled={loading}
                className={`hover:bg-yellow-400 hover:text-[#000110] text-white px-4 py-2 rounded-md shadow-sm bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 max-w-[50%] brightness-125 ${loading ? 'animate-pulse bg-yellow-400 text-[#000110]' : ''}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default LiveQueuePopUp;
