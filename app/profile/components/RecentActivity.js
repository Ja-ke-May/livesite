import React, { useState } from 'react';

const RecentActivity = ({ recentActivity }) => {
  const [visibleCount, setVisibleCount] = useState(20);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 20);
  };

  return (
    <div className="max-h-[400px] bg-gray-800/80 rounded-lg shadow-md p-6 mt-4">
      <h3 className="text-4xl md:text-5xl font-semibold mb-4 text-center text-[#000110]">Recent Activity</h3>
      <ul className="list-disc pl-5 overflow-y-auto max-h-[300px] max-x-full">
        {[...recentActivity].reverse().slice(0, visibleCount).map((activity, index) => (
          <li key={index}>{activity}</li>
        ))}
         {visibleCount < recentActivity.length && (
        <button
          onClick={handleLoadMore}
          className="mt-4 px-4 py-2 bg-[#000110] text-white rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
        >
          Load More
        </button>
      )}
      </ul>
     
    </div>
  );
};

export default RecentActivity;
