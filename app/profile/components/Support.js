// Support.js
import React from 'react';

const Support = ({ username, supportersCount, isUserSupported, onToggleSupport }) => {

  return (
    <div className='flex justify-center'>
      <div className="bg-gray-800/80 rounded-lg shadow-md p-6 mt-4 text-center max-w-[85%]">
        <h3 className="text-xl font-semibold mb-4">
          Support <span className='text-blue-400 font-bold ml-1'>{username}</span>
          {isUserSupported ? (
            <span
              className="inline-block ml-2 cursor-pointer text-yellow-400 brightness-125 text-3xl align-middle"
              onClick={onToggleSupport}
            >
              ⭐
            </span>
          ) : (
            <span
              className="inline-block w-8 h-8 ml-2 border-2 border-blue-400 rounded-md cursor-pointer align-middle"
              onClick={onToggleSupport}
            >
            </span>
          )}
        </h3>
        <p className="text-xs mt-4">
          It's completely free to show your support. Your username will show in
          a supported users, and your recent activity.
        </p>
        <p className="text-md mt-4">Supporters: <span className='text-xl text-yellow-400 brightness-125'>{supportersCount}</span></p>
      </div>
    </div>
  );
};

export default Support;
