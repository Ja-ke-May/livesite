import React from 'react';

const formatTime = () => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const UserCommentBox = ({ username, comment }) => {
  const time = formatTime();

  return (
    <div className="flex flex-col bg-gray-800/80 text-white p-2 m-2 lg:m-4 lg:p-4 rounded-md shadow-md z-[100]">
      <div className="flex justify-between items-start">
        <h3 className="font-bold">{username}</h3>
      </div>
      <div className="flex justify-between items-start">
        <p className="mt-2 max-w-[100%] break-words overflow-wrap break-word">{comment}</p>
      </div>
      <div className="flex justify-end mt-2">
        <span className="text-gray-400 text-xs">{time}</span>
      </div>
    </div>
  );
};

export default UserCommentBox;
