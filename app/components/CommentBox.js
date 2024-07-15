import React from 'react';

const CommentBox = () => {
  return (
    <div className="fixed w-full flex justify-center bg-white bottom-0 md:text-lg mb-4 md:mb-6">
      <input
        type="text"
        className="border-2 border-gray-300 text-gray-800 rounded-md px-4 py-2 w-3/4 md:w-1/2 focus:outline-none"
        placeholder="Log in to vote and comment"
        maxLength={55}
      />
      <button className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md ml-2">
        SEND
      </button>
    </div>
  );
};

export default CommentBox;
