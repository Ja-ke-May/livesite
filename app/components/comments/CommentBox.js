import React, { useState } from 'react';
import SpeakerButton from './speakerButton';

const CommentBox = ({ isLoggedIn, username, socket }) => {
  const [comment, setComment] = useState('');
  const maxLength = 55;

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (isLoggedIn && comment.trim() !== '') {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch user profile to get colors
        const profileResponse = await fetch(`https://livesite-backend.onrender.com/profile/${username}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!profileResponse.ok) {
          console.error('Failed to fetch user profile');
          return;
        }
  
        const userProfile = await profileResponse.json();
        const { commentColor, borderColor, usernameColor } = userProfile;
  
        // Send the comment along with the color settings
        const response = await fetch('https://livesite-backend.onrender.com/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ comment: comment.trim(), username }), 
        });
  
        if (response.ok) {
          socket.emit('new-comment', { 
            username, 
            comment, 
            commentColor, 
            borderColor, 
            usernameColor 
          });
          setComment(''); 
        } else {
          console.error('Failed to submit comment');
        }
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };
  

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommentSubmit();
    }
  };

  return (
    <div className="fixed w-full flex justify-center bg-[#000110] bottom-0 md:text-lg pb-6">
      <div className="relative w-3/4 md:w-1/2">
        <input
          type="text"
          className="text-[#000110] rounded-md px-4 py-2 w-full focus:outline-none pr-12 mt-1"
          placeholder={isLoggedIn ? '' : 'Log in to vote/comment'}
          maxLength={maxLength}
          value={comment}
          onChange={handleCommentChange}
          onKeyDown={handleKeyDown}
          disabled={!isLoggedIn}
        />
        {isLoggedIn && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {maxLength - comment.length}
          </div>
        )}
      </div>

      <button
        className={`ml-1 px-1 rounded-md shadow-sm text-sm font-medium text-white bg-[#000110] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 ${
          !isLoggedIn && 'opacity-50 cursor-not-allowed'
        }`}
        onClick={handleCommentSubmit}
        disabled={!isLoggedIn}
      >
        SEND
      </button>

      <SpeakerButton isLoggedIn={isLoggedIn} />
    </div>
  );
};

export default CommentBox;
