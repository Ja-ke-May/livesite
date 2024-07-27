import React, { useState } from 'react';

const CommentBox = () => {
  const [comment, setComment] = useState('');
  const maxLength = 55;

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <div className="fixed w-full flex justify-center bg-[#000110] bottom-0 md:text-lg pb-8">
      <div className="relative w-3/4 md:w-1/2">
        <input
          type="text"
          className="text-[#000110] rounded-md px-4 py-2 w-full focus:outline-none pr-12"
          placeholder="Log in to vote and comment"
          maxLength={maxLength}
          value={comment}
          onChange={handleCommentChange}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          {maxLength - comment.length}
        </div>
      </div>
      <button className="ml-2 mr-2 px-1 rounded-md shadow-sm text-sm font-medium text-white bg-[#000110] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
        SEND
      </button>
    </div>
  );
};

export default CommentBox;
