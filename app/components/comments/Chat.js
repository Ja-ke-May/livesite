import React, { useState, useEffect } from 'react';
import UserCommentBox from './UserCommentBox';

const Chat = ({ socket }) => {
  const [comments, setComments] = useState([]);

  const formatTime = () => {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
 
  useEffect(() => {
    const handleNewComment = (comment) => { 
        const time = formatTime();
        setComments((prevComments) => [
            { ...comment, time }, 
            ...prevComments
        ]);
    };

    socket.on('new-comment', handleNewComment);

    return () => {
        socket.off('new-comment', handleNewComment);
    };
}, [socket]);


  return (
    <div className="h-full bottom-0 mb-20 text-center mt-2 rounded bg-[#000110] shadow-md pl-4 pb-4 pr-4 md:pl-6 md:pb-6 md:pr-6 w-full">
      <h1 className="hidden mt-2">Live Chat</h1>

      <div className="overflow-y-auto max-h-[600px]">
        {comments.map((c, index) => (
          <UserCommentBox 
          key={index} 
          username={c.username} 
          comment={c.comment}
          time={c.time} 
          commentColor={c.commentColor || '#ffffff'} 
            borderColor={c.borderColor || '#000110'} 
            usernameColor={c.usernameColor || '#ffffff'} 
             />
        ))}
      </div>
    </div>
  );
};

export default Chat;
