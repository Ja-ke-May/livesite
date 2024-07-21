"use client";

import { useState } from "react";
import LiveQueuePopUp from "./LiveQueuePopUp";

const Viewer = () => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const handleJoinClick = () => {
    setIsPopUpOpen(true);
  };

  const handleClosePopUp = () => {
    setIsPopUpOpen(false);
  };

  return (
    <>
      <div className="mt-2 h-8 bg-yellow-400 w-full font-bold text-md md:text-md text-center text-[#000110] brightness-125">
        <p className="md:font-extrabold inline">Join the live queue</p>
        <button
          className="border-2 border-[#000110] pr-1 pl-1 m-1 text-sm md:text-md hover:bg-yellow-600 hover:brightness-125 rounded animate-pulse"
          onClick={handleJoinClick}
        >
          JOIN
        </button>
      </div>
      <div className="h-[360px] lg:h-[400px] rounded text-center bg-gray-800/80 shadow-md p-4 md:p-6 w-full">
        <h1>Viewer Component</h1>
        {/* Add viewer logic here */}
      </div>

      {/* Conditionally render the LiveQueuePopUp based on state */}
      <LiveQueuePopUp visible={isPopUpOpen} onClose={handleClosePopUp} />
    </>
  );
};

export default Viewer;
