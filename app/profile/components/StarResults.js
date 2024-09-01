import React from 'react';

const ProfileStarResults = ({ totalLiveDuration, longestLiveDuration, usernameColor, commentColor, borderColor }) => {

  const formatDuration = (duration) => {
    const roundedDuration = Math.round(duration); 
    const hours = Math.floor(roundedDuration / 3600);
    const minutes = Math.floor((roundedDuration % 3600) / 60);
    const seconds = roundedDuration % 60;

    const formattedHours = hours > 0 ? `${String(hours).padStart(2, '0')}h ` : '';
    const formattedMinutes = minutes > 0 || hours > 0 ? `${String(minutes).padStart(2, '0')}m ` : '';
    const formattedSeconds = `${String(seconds).padStart(2, '0')}s`;

    return `${formattedHours}${formattedMinutes}${formattedSeconds}`.trim();
  };

  return (
    <div className="bg-gray-800/80 rounded-lg shadow-md p-6 mt-4 flex flex-col items-center"
    style={{ borderColor: borderColor, borderWidth: '2px', borderStyle: 'solid' }}
    >
      <h3 className='text-4xl md:text-5xl font-semibold mb-4 text-center text-[#000110]'
      style={{ color: usernameColor }}>Stars Results</h3>
        <h3
        style={{ color: commentColor }}
        >Longest Time Live</h3>
        <h4 className='text-yellow-400 brightness-125'>{formatDuration(longestLiveDuration)}</h4>
        <h3
        style={{ color: commentColor }}
        >Total Time Live</h3>
        <h4 className='text-yellow-400 brightness-125'>{formatDuration(totalLiveDuration)}</h4>
    </div>
  );
};

export default ProfileStarResults;
