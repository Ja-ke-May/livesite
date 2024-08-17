import React, { useState, useEffect } from 'react';
import UserCommentBox from './UserCommentBox';

const Chat = ({ socket }) => {
  const [comments, setComments] = useState([]);
 
  useEffect(() => {
    
    socket.on('new-comment', (comment) => {
      console.log('Received new comment:', comment); 
      setComments((prevComments) => [comment, ...prevComments]);
    });
  
    return () => {
      socket.disconnect();
    };
  }, [socket]);
  

  return (
    <div className="h-full bottom-0 mb-20 text-center mt-2 rounded bg-[#000110] shadow-md pl-4 pb-4 pr-4 md:pl-6 md:pb-6 md:pr-6 w-full">
      <h1 className="hidden mt-2">Live Chat</h1>

      {/* Render all comments */}
      <div className="overflow-y-auto max-h-[600px]">
        {comments.map((c, index) => (
          <UserCommentBox key={index} username={c.username} comment={c.comment} />
        ))}
      </div>
    </div>
  );
};

export default Chat;
