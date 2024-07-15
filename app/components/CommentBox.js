import React from 'react';

const CommentBox = () => {
  return (
    <div className="fixed w-full flex justify-center bg-[#000110] bottom-0 md:text-lg mb-4 md:mb-6">
      <input
        type="text"
        className="border-2 border-gray-300 text-gray-800 rounded-md px-4 py-2 w-3/4 md:w-1/2 focus:outline-none"
        placeholder="Log in to vote and comment"
        maxLength={55}
      />
      <button className="ml-2 py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
        SEND
      </button>
    </div>
  );
};

export default CommentBox;
