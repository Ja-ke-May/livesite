import React, { useState, useCallback } from 'react';
import UsernamePopUp from '../UsernamePopUp';
import { fetchUserProfile, fetchSupporters, toggleSupport, fetchRecentActivity } from '@/utils/apiClient';

const UserCommentBox = ({
  isLoggedIn,
  username,
  comment,
  time,
  commentColor,
  borderColor,
  usernameColor,
  isAdmin,
  flag
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [links, setLinks] = useState([]);
  const [isUserSupported, setIsUserSupported] = useState(false);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);

  const togglePopup = async (e) => {
    if (!showPopup) {
      // Position near clicked username
      const rect = e.target.getBoundingClientRect();
      setPopupPosition({ x: rect.left, y: rect.bottom });

      await loadData();
      setShowPopup(true);
    } else {
      setShowPopup(false);
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
        <div
          className="flex flex-col bg-gray-800/80 text-white p-1 m-1 lg:m-2 lg:p-2 rounded-md shadow-md z-[100]"
          style={{ borderColor, borderWidth: '2px', borderStyle: 'solid' }}
        >
          <div className="flex max-w-[100%] overflow-wrap">
            <div
              id={`username-${username}`}
              className="text-md font-bold cursor-pointer flex items-center"
              onClick={togglePopup}
              style={{ color: usernameColor }}
            >
              {flag && (
                <img
                  src={`https://flagcdn.com/w40/${flag}.png`}
                  alt="flag"
                  className="h-5 w-8 object-cover rounded-sm mr-1"
                />
              )}
              {username}
            </div>

            <span
              className="text-sm text-left mt-1 ml-2 break-words break-all"
              style={{ color: commentColor }}
            >
              {comment}
            </span>
          </div>
          <div className="flex justify-end">
            <h4 className="text-gray-400 text-xs">{time}</h4>
          </div>
        </div>
      </div>

      {showPopup && isLoggedIn && (
        <UsernamePopUp
          visible={showPopup}
          onClose={() => setShowPopup(false)}
          username={username}
          isAdmin={isAdmin}
          position={popupPosition}
          links={links}
          isUserSupported={isUserSupported}
          onToggleSupport={handleToggleSupport}
        />
      )}
    </>
  );
};

export default UserCommentBox;
