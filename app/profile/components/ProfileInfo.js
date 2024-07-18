import React, { useState } from 'react';

const ProfileInfo = ({
  profilePicture,
  username,
  bio,
  handleFileChange,
  handleUsernameChange,
  handleBioChange,
}) => {
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [showBioInput, setShowBioInput] = useState(false);
  const [newUsername, setNewUsername] = useState(username); // State to handle input value

  const toggleUsernameInput = () => {
    setShowUsernameInput(!showUsernameInput);
  };

  const toggleBioInput = () => {
    setShowBioInput(!showBioInput);
  };

  const userNameRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]*$/; // Regex pattern

  return (
    <div className="flex justify-center mt-4">
      <div className="bg-gray-800/80 rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-2xl text-blue-600 font-bold text-center">{username}</h2>
        <div className="flex items-center">
          <img 
            src={profilePicture} 
            alt="Profile Picture" 
            className="w-32 h-32 rounded-[10%] border-2 border-blue-600" 
          />
          <div className="ml-6 text-right">
            <p className="text-yellow-400 brightness-125 mt-2">Tokens: 1000</p>
            <p className="text-gray-300 mt-2 max-w-xs">
              {bio}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center mt-4">
          <label htmlFor="fileInput" className="cursor-pointer bg-[#000110] text-white px-4 py-2 rounded mb-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
            Change Profile Picture
          </label>
          <input 
            id="fileInput" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange} 
          />
          <button 
            onClick={toggleUsernameInput}
            className="bg-[#000110] text-white px-4 py-2 rounded mb-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
            {showUsernameInput ? 'Hide Username Input' : 'Change Username'}
          </button>
          {showUsernameInput && (
            <input 
              type="text"
              className="bg-gray-800/80 text-white px-4 py-2 rounded mb-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
              placeholder="New Username"
              value={newUsername}
              onChange={(e) => {
                const { value } = e.target;
                if (userNameRegex.test(value)) {
                  setNewUsername(value); // Update local state with valid input
                  handleUsernameChange(e); // Optionally, update parent state
                }
                // You can add additional handling for invalid input
              }}
              maxLength={12}
            />
          )}
          <button 
            onClick={toggleBioInput}
            className="bg-[#000110] text-white px-4 py-2 rounded mb-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
            {showBioInput ? 'Hide Bio Input' : 'Change Bio'}
          </button>
          {showBioInput && (
            <textarea
              className="bg-gray-800/80 text-white px-4 py-2 rounded mb-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
              placeholder="New Bio"
              value={bio}
              onChange={handleBioChange}
              maxLength={150}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
