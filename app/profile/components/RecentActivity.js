import React from 'react';

const RecentActivity = () => {
  return (
    <div className="bg-gray-800/80 rounded-lg shadow-md p-6 mt-4">
      <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
      <ul className="list-disc pl-5">
        <li>You went live for 2 mins 30 seconds</li>
        <li>User sent you tokens</li>
        <li>User supported you</li>
      </ul>
    </div>
  );
};

export default RecentActivity;
