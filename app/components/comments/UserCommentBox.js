import React, { useState, useCallback } from 'react';
import UsernamePopUp from '../UsernamePopUp';
import { fetchUserProfile, fetchSupporters, toggleSupport, fetchRecentActivity } from '@/utils/apiClient';

const UserCommentBox = ({ username, comment, time, commentColor, borderColor, usernameColor }) => {
  
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [links, setLinks] = useState([]);
  const [isUserSupported, setIsUserSupported] = useState(false);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);

  const togglePopup = () => {
    if (!username) {
      return; 
    }

    setShowPopup((prevShowPopup) => {
      const nextShowPopup = !prevShowPopup;

      if (nextShowPopup) {
        setPopupPosition({
          x: 20, 
          y: window.innerHeight - 200,
        });
        loadData();
      }

      return nextShowPopup;
    });
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
        <div className="flex flex-col bg-gray-800/80 text-white p-1 m-1 lg:m-2 lg:p-2 rounded-md shadow-md z-[100]"
          style={{ borderColor: borderColor, borderWidth: '2px', borderStyle: 'solid' }}>
          <div className='flex max-w-[100%] overflow-wrap'>
            <p id={`username-${username}`} className="text-md font-bold cursor-pointer" 
              onClick={togglePopup}
              style={{ color: usernameColor }}>
              {username}
            </p>
            <span className="text-sm text-left mt-1 ml-2 break-words break-all"
              style={{ color: commentColor }}>
              {comment}
            </span>
          </div>
          <div className="flex justify-end">
            <h4 className="text-gray-400 text-xs">{time}</h4>
          </div>
        </div>
      </div>

      {showPopup && username && (
        <UsernamePopUp
          visible={showPopup}
          onClose={togglePopup}
          username={username}
          position={popupPosition}
          links={links}
          isUserSupported={isUserSupported}
          onToggleSupport={handleToggleSupport}
          style={{ position: 'fixed', bottom: '200px', left: '20px' }} 
        />
      )}
    </>
  );
};

export default UserCommentBox;
