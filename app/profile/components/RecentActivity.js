import React, { useState } from 'react';

const RecentActivity = ({ recentActivity, usernameColor, commentColor, borderColor }) => {
  const [visibleCount, setVisibleCount] = useState(20);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 20);
  };

  const uniqueActivities = recentActivity.filter((activity, index, self) => {
    const activityTimestamp = activity.match(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}/)[0];
    return index === self.findIndex(a => a.includes(activityTimestamp));
  });

  return (
    <div className="max-h-[400px] bg-gray-800/80 rounded-lg shadow-md p-6 mt-4"
    style={{ borderColor: borderColor, borderWidth: '2px', borderStyle: 'solid' }}
    >
      <h3 className="text-4xl md:text-5xl font-semibold mb-4 text-center text-[#000110]"
      style={{ color: usernameColor }}
      >Recent Activity</h3>
      <ul className="list-disc pl-5 overflow-y-auto max-h-[300px] max-x-full"
      style={{ color: commentColor }}
      >
          {[...uniqueActivities].reverse().slice(0, visibleCount).map((activity, index) => (
          <li key={index}>{activity}</li>
        ))}
         {visibleCount < uniqueActivities.length && (
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
