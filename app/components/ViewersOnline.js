"use client";

import React, { useEffect, useState } from 'react';

const ViewersOnline = ({ socket }) => {
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    const handleUpdateOnlineUsers = (size) => {
      setViewers(size);
    };

    socket.on('update-online-users', handleUpdateOnlineUsers);

    return () => {
      socket.off('update-online-users', handleUpdateOnlineUsers);
    };
  }, [socket]); 

  const viewersDividedAndRounded = Math.ceil(viewers / 2);

  return (
    <div className="fixed bottom-0 bg-none w-full flex justify-center items-center h-4 md:h-6 mb-1 z-50">
      <p className="text-white">
        Current Viewers: {viewersDividedAndRounded}
      </p>
    </div>
  );
};

export default ViewersOnline;
