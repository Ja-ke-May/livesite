import React, { useState, useCallback } from 'react';
import UsernamePopUp from '../UsernamePopUp';
import { fetchUserProfile, fetchSupporters, toggleSupport, fetchRecentActivity } from '@/utils/apiClient';

const formatTime = () => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const UserCommentBox = ({ username, comment, chatContainerRef }) => {
  const time = formatTime();

  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 }); // Re-add the popupPosition state
  const [links, setLinks] = useState([]);
  const [isUserSupported, setIsUserSupported] = useState(false);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);

  const togglePopup = () => {
    const fixedPosition = {
      x: 20, // 20px from the left edge of the screen
      y: window.innerHeight - 200, // 20px from the bottom edge of the screen
    };
    setPopupPosition(fixedPosition); // Correctly set the position
    setShowPopup(!showPopup);

    if (!showPopup) {
      loadData();
    }
  };

  const loadData = async () => {
    try {
      setLoadingLinks(true);

      const [userProfile, supportersData] = await Promise.all([
        fetchUserProfile(username),
        fetchSupporters(username),
      ]);

      setLinks(userProfile.links || []);
      setIsUserSupported(supportersData.isUserSupported);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoadingLinks(false);
    }
  };

  const handleToggleSupport = useCallback(async () => {
    const newIsUserSupported = !isUserSupported;

    setIsUserSupported(newIsUserSupported);
    try {
      const data = await toggleSupport(username);
      setIsUserSupported(data.isSupported);

      const recentActivityData = await fetchRecentActivity(username);
      setRecentActivity(recentActivityData);
    } catch (error) {
      console.error('Failed to toggle support status:', error.message);
      setIsUserSupported(!newIsUserSupported);
    }
  }, [isUserSupported, username]);

  return (
    <>
      <div className="relative"> 
        <div className="flex flex-col bg-gray-800/80 text-white p-2 m-2 lg:m-4 lg:p-4 rounded-md shadow-md z-[100]">
          <div className="flex justify-between items-start">
            <h3 id={`username-${username}`} className="font-bold cursor-pointer" onClick={togglePopup}>
              {username}
            </h3>
          </div>
          <div className="flex justify-between items-start">
            <p className="mt-2 max-w-[100%] break-words overflow-wrap break-word">{comment}</p>
          </div>
          <div className="flex justify-end mt-2">
            <span className="text-gray-400 text-xs">{time}</span>
          </div>
        </div>
      </div>

      <div>
        {showPopup && (
          <UsernamePopUp
            visible={showPopup}
            onClose={togglePopup}
            username={username}
            position={popupPosition}
            links={links}
            isUserSupported={isUserSupported}
            onToggleSupport={handleToggleSupport}
            style={{ position: 'fixed', bottom: '200px', left: '20px' }} // Ensure absolute positioning
          />
        )}
      </div>
    </>
  );
};

export default UserCommentBox;
