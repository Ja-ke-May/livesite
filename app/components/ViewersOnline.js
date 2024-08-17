import React, { useEffect, useState } from 'react';
import { fetchOnlineUsers } from '@/utils/apiClient';

const ViewersOnline = () => {
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    const fetchViewers = async () => {
      try {
        const data = await fetchOnlineUsers();
        setViewers(data.viewers);
      } catch (error) {
        console.error('Failed to fetch viewers:', error);
      }
    };

    fetchViewers();

    const interval = setInterval(fetchViewers, 10000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 bg-none w-full flex justify-center items-center h-4 md:h-6 mb-1 z-50">
      <p className="text-white">
        Current Viewers: {viewers}
      </p>
    </div>
  );
};

export default ViewersOnline;
