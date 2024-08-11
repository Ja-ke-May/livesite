import React, { useContext } from 'react';
import { AuthContext } from '@/utils/AuthContext';

const ViewerMain = ({ mainVideoRef, state, handleGoLiveClick }) => {
  const { username } = useContext(AuthContext);

  return (
    <div className="relative h-[300px] md:h-[350px] lg:h-[400px] rounded text-center bg-gray-800/80 shadow-md w-full">
      <h2 className="hidden">Viewer Component</h2>
      <video ref={mainVideoRef} autoPlay muted className="w-full h-full object-cover" />

      {state.isLive && (
        <div className="absolute top-2 left-2 bg-none text-white text-sm md:text-md xl:text-lg p-2 rounded">
          <span className="font-bold">{username}</span>
        </div>
      )}

      {!state.isLive && state.isCameraOn && state.isNext && (
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
