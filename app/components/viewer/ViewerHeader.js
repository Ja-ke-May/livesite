import React from 'react';

const ViewerHeader = ({ state, handleJoinClick, handlePreviewButtonClick, stopVideo }) => {
  return (
    <div className="mt-2 h-8 bg-yellow-400 w-full font-bold text-md md:text-md text-center text-[#000110] brightness-125 rounded">
      {state.isCameraOn ? (
        <div className="relative w-full flex justify-center h-full ">
          <button
            onClick={stopVideo}
            className="absolute text-white border-2 border-red-700 pr-1 pl-1 h-full text-md md:text-md hover:bg-red-600 rounded bg-red-600"
          >
            Leave
          </button>
        </div>
      ) : state.showPreviewButton ? (
        <button
          onClick={handlePreviewButtonClick}
          className="text-white border-2 border-red-700 pr-1 pl-1 h-full text-md md:text-md hover:bg-red-600 rounded bg-red-600 animate-pulse"
        >
          Preview Your Camera
        </button>
      ) : (
        <>
          <p className="md:font-extrabold inline">Join the live queue</p>
          <button
            className="border-2 border-[#000110] pr-1 pl-1 m-1 text-sm md:text-md hover:bg-yellow-600 hover:brightness-125 rounded animate-pulse"
            onClick={handleJoinClick}
            disabled={state.inQueue}
          >
            JOIN
          </button>
        </>
      )}
    </div>
  );
};

export default ViewerHeader;
