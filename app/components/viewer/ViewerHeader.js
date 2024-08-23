import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/utils/AuthContext';

const ViewerHeader = ({ state, handleJoinClick, handlePreviewButtonClick, stopVideo, showQueueAlert, queuePosition }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  useEffect(() => {
    let timer;
    if (queuePosition === 1 && state.inQueue && !state.isCameraOn) {
      timer = setTimeout(() => {
        window.location.reload();
      }, 30000); // refresh after 30 sec if preview button not clicked
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [queuePosition, state.inQueue, state.isCameraOn]);

  const onJoinClick = () => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      setTimeout(() => setShowLoginAlert(false), 2000); 
    } else {
      handleJoinClick();
    }
  };

  const renderAlert = (message) => (
    <div className="bg-white text-[#000110] w-full h-full flex justify-center items-center rounded absolute top-0 left-0">
      {message}
    </div>
  );

  return (
    <div className="mt-2 mb-2 h-8 bg-yellow-400 w-full font-bold text-md md:text-md text-center text-[#000110] brightness-125 rounded relative">
      {state.isCameraOn ? (
        <div className="w-full flex justify-center h-full">
          <button
            onClick={stopVideo}
            className="text-white border-2 border-red-700 px-2 h-full text-md md:text-md hover:bg-red-600 rounded bg-red-600"
          >
            Leave
          </button>
        </div>
      ) : state.inQueue && queuePosition === 1 && !state.isCameraOn ? (
        <button
          onClick={handlePreviewButtonClick}
          className="text-white border-2 border-red-700 px-2 h-full text-md md:text-md hover:bg-red-600 rounded bg-red-600 animate-pulse"
        >
          Preview Your Camera
        </button>
      ) : !state.isCameraOn && !state.inQueue  ? (
        <>
          <p className="md:font-extrabold inline">Join the live queue</p>
          <button
            className="border-2 border-[#000110] px-2 m-1 text-sm md:text-md hover:bg-yellow-600 hover:brightness-125 rounded animate-pulse"
            onClick={onJoinClick}
          >
            JOIN
          </button>
        </>
      ) : state.inQueue ? (
        <p className="md:font-extrabold inline">
          Your position in queue: {queuePosition}
        </p>
      ) : null }

      {showLoginAlert && renderAlert('Please log in')}
      {showQueueAlert && renderAlert('Already in queue')}
    </div>
  );
};

export default ViewerHeader;
