import React from 'react';

const ViewerMain = ({ mainVideoRef, state, handleGoLiveClick }) => {

  console.log("isNext:", state.isNext, "isCameraOn:", state.isCameraOn, "isLive:", state.isLive);
  
  return (
    <div className="relative h-[300px] md:h-[350px] lg:h-[400px] rounded text-center bg-gray-800/80 shadow-md w-full">
      <h2 className="hidden">Viewer Component</h2>
      <video ref={mainVideoRef} autoPlay muted className="w-full h-full object-cover" />

      {/* Display the live user's username */}
      {state.liveUserId && (
        <div className="absolute top-2 left-2 bg-none text-white text-sm md:text-md xl:text-lg p-2 rounded">
          <span className="font-bold">{state.liveUserId}</span> {/* liveUserId now holds the live user's username */}
        </div>
      )}

      {/* Conditionally render the "GO LIVE" button when the user is prompted to go live */}
      {state.isCameraOn && state.isNext && !state.isLive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handleGoLiveClick}
            className="bg-green-600 text-white text-md md:text-lg font-bold rounded p-4 animate-pulse"
          >
            GO LIVE
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewerMain;
