import React, { useState } from 'react';

const Support = ({ username }) => {
  const [isCircleYellow, setIsCircleYellow] = useState(false);
  const [supportersCount, setSupportersCount] = useState(5); // Initial supporters count

  const toggleCircleColor = () => {
    setIsCircleYellow(!isCircleYellow);
    setSupportersCount(supportersCount + (isCircleYellow ? -1 : 1));
  };

  return (
    <div className='flex justify-center'>
      <div className="bg-gray-800/80 rounded-lg shadow-md p-6 mt-4 text-center max-w-[85%]">
        <h3 className="text-xl font-semibold mb-4">
          Support <span className='text-blue-400 font-bold ml-1'>{username}</span>
          {isCircleYellow ? (
            <span
              className="inline-block ml-2 cursor-pointer text-yellow-400 brightness-125 text-3xl align-middle"
              onClick={toggleCircleColor}
            >
              ⭐
            </span>
          ) : (
            <span
              className="inline-block w-8 h-8 ml-2 border-2 border-blue-400 rounded-md cursor-pointer align-middle"
              onClick={toggleCircleColor}
            >
            </span>
          )}
        </h3>
        <p className="text-sm mt-4">
          It's completely free to show your support. Your username will show in
          a supported user, and your recent activity.
        </p>
        <p className="text-md mt-4">Current supporters: <span className='text-xl text-yellow-400 brightness-125'>{supportersCount}</span></p>
      </div>
    </div>
  );
};

export default Support;
