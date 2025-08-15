import React, { useState, useEffect } from 'react';
import UserCommentBox from './UserCommentBox';
import UsernamePopUp from '../UsernamePopUp';
import { fetchSupporters, toggleSupport } from '@/utils/apiClient'; 

const Chat = ({ socket, isLoggedIn, isAdmin, username }) => {
  const [comments, setComments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [popupUsername, setPopupUsername] = useState('');
  const [popupLinks, setPopupLinks] = useState([]);
  const [isUserSupported, setIsUserSupported] = useState(false);

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
    return () => socket.off('new-comment', handleNewComment);
  }, [socket]);

  
  const handleUsernameClick = async (clickedUsername, rect, links) => {
    setPopupUsername(clickedUsername);
    setPopupLinks(links || []);
   setPopupPosition({ x: rect.right, y: rect.top });
    setShowPopup(true);

    try {
      const supporters = await fetchSupporters(clickedUsername);
      setIsUserSupported(supporters.includes(username));
    } catch (err) {
      console.error('Error fetching supporters:', err);
    }
  };

  const handleToggleSupport = async () => {
    try {
      await toggleSupport(popupUsername); 
      const supporters = await fetchSupporters(popupUsername); 
      setIsUserSupported(supporters.includes(username));
    } catch (err) {
      console.error('Error toggling support:', err);
    }
  };

  return (
    <div className="h-full bottom-0 mb-20 text-center mt-2 rounded bg-[#000110] shadow-md pl-4 pb-4 pr-4 md:pl-6 md:pb-6 md:pr-6 w-full">
      <h1 className="hidden mt-2">Live Chat</h1>

      <div className="overflow-y-auto max-h-[600px]">
        {comments.map((c, index) => (
          <UserCommentBox
            key={index}
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            username={c.username}
            comment={c.comment}
            time={c.time}
            commentColor={c.commentColor || '#ffffff'}
            borderColor={c.borderColor || '#000110'}
            usernameColor={c.usernameColor || '#ffffff'}
            flag={c.flag}
            onUsernameClick={(pos) =>
              handleUsernameClick(c.username, pos, c.links)
            }
          />
        ))}
      </div>

      <UsernamePopUp
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        links={popupLinks}
        username={popupUsername}
        position={popupPosition}
        isUserSupported={isUserSupported}
        onToggleSupport={handleToggleSupport}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default Chat;
