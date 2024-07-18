import React from 'react';

const RecentActivity = () => {
  return (
    <div className="bg-gray-800/80 rounded-lg shadow-md p-6 mt-4">
      <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
      <ul className="list-disc pl-5">
        <li>User liked your post</li>
        <li>User commented on your photo</li>
        <li>User followed you</li>
      </ul>
    </div>
  );
};

export default RecentActivity;
