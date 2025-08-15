import React, { useState, useEffect } from 'react';
import UserCommentBox from './UserCommentBox';
import UsernamePopUp from './UsernamePopUp';

const Chat = ({ socket, isLoggedIn, isAdmin, flag }) => {
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

    return () => {
      socket.off('new-comment', handleNewComment);
    };
  }, [socket]);

  // Handle username click from comment
  const handleUsernameClick = (username, position, links, supported) => {
    setPopupUsername(username);
    setPopupLinks(links || []);
    setIsUserSupported(supported || false);
    setPopupPosition(position);
    setShowPopup(true);
  };

  const handleToggleSupport = () => {
    setIsUserSupported((prev) => !prev);
    // TODO: Emit socket event or API call to update support status if needed
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
              handleUsernameClick(c.username, pos, c.links, c.isSupported)
            }
          />
        ))}
      </div>

      {/* Global popup so it persists between comment updates */}
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
