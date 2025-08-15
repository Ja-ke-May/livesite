import React from 'react';
import { fetchUserProfile, fetchSupporters } from '@/utils/apiClient';

const UserCommentBox = ({
  isLoggedIn,
  username,
  comment,
  time,
  commentColor,
  borderColor,
  usernameColor,
  isAdmin,
  flag,
  onUsernameClick // passed down from Chat
}) => {
  const handleUsernameClick = async (e) => {
    if (!isLoggedIn) return;

    // Position near clicked username
    const rect = e.target.getBoundingClientRect();
    const position = { x: rect.left, y: rect.bottom };

    try {
      const [userProfile, supportersData] = await Promise.all([
        fetchUserProfile(username),
        fetchSupporters(username)
      ]);

      onUsernameClick(
        username,
        position,
        userProfile.links || [],
        supportersData.isUserSupported
      );
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  return (
    <div className="relative">
      <div
        className="flex flex-col bg-gray-800/80 text-white p-1 m-1 lg:m-2 lg:p-2 rounded-md shadow-md z-[100]"
        style={{ borderColor, borderWidth: '2px', borderStyle: 'solid' }}
      >
        <div className="flex max-w-[100%] overflow-wrap">
          <div
            id={`username-${username}`}
            className="text-md font-bold cursor-pointer flex items-center"
            onClick={handleUsernameClick}
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
  );
};

export default UserCommentBox;
