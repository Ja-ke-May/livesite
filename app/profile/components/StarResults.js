import React from 'react';

const ProfileStarResults = ({ totalLiveDuration, longestLiveDuration }) => {
  
  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="bg-gray-800/80 rounded-lg shadow-md p-6 mt-4 flex flex-col items-center">
      <h3 className='text-4xl md:text-5xl font-semibold mb-4 text-center text-[#000110]'>Stars Results</h3>
        <h3>Longest Time Live</h3>
        <h4 className='text-yellow-400 brightness-125'>{formatDuration(longestLiveDuration)}</h4>
        <h3>Total Time Live</h3>
        <h4 className='text-yellow-400 brightness-125'>{formatDuration(totalLiveDuration)}</h4>
    </div>
  );
};

export default ProfileStarResults;
