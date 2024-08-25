import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import UsernamePopUp from '../../components/UsernamePopUp';
import { updateUsername, updateBio } from '@/utils/apiClient';
import { AuthContext } from '@/utils/AuthContext';

const ProfileInfo = ({
  profilePicture,
  username,
  bio,
  handleFileChange,
  handleUsernameChange,
  handleBioChange,
  links,
  tokens,
  supportersCount,
  isUserSupported,
  onToggleSupport,
  isLoggedIn,
  loggedInUsername 
}) => {
  const router = useRouter(); 
  const { login } = useContext(AuthContext);
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [showBioInput, setShowBioInput] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [newBio, setNewBio] = useState(bio);
  const [usernameError, setUsernameError] = useState('');
  const [fileError, setFileError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const toggleUsernameInput = () => {
    setShowUsernameInput(!showUsernameInput);
    setUsernameError('');
  };

  const toggleBioInput = () => {
    setShowBioInput(!showBioInput);
  };

  const togglePopup = (event) => {
    if (event) {
      setPopupPosition({ x: event.clientX, y: event.clientY });
    }
    setShowPopup(!showPopup);
  };

  const userNameRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]*$/;

  const handleUsernameChangeInternal = (e) => {
    const { value } = e.target;
    if (userNameRegex.test(value)) {
      setNewUsername(value);
    }
  };

  const handleBioChangeInternal = (e) => {
    const { value } = e.target;
    setNewBio(value);
  };

  const confirmUsernameChange = async () => {
    if (newUsername.length >= 3) {
      try {
        const updatedUser = await updateUsername(newUsername);
        handleUsernameChange(updatedUser.userName);
        setShowUsernameInput(false); 
        login(localStorage.getItem('token'), updatedUser.userName); 
        router.push(`/profile/${updatedUser.userName}`);
      } catch (error) {
        setUsernameError(error.message);
      }
    } else {
      setUsernameError('Username must be at least 3 characters long.');
    }
  };

  const confirmBioChange = async () => {
    try {
      const updatedUser = await updateBio(newBio);
      handleBioChange({ target: { value: updatedUser.bio } });
      setShowBioInput(false);
    } catch (error) {
      console.error('Failed to update bio:', error);
    }
  };

  const handleFileChangeInternal = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        setFileError('Only JPEG, PNG, and GIF files are allowed.');
        return;
      }
      setFileError('');
      try {
        await handleFileChange(e); 
      } catch (error) {
        console.error('Failed to update profile picture:', error);
      }
    } else {
      console.error('Failed to retrieve file from event');
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <div className="bg-gray-800/80 rounded-lg shadow-md p-4 md:p-6 w-full max-w-lg">
        <div className="text-center relative">
          <h2 className="text-2xl font-bold cursor-pointer" onClick={(e) => togglePopup(e)}>
            {username}
          </h2>
          {isLoggedIn && loggedInUsername === username && (
            <div>
              <p className="text-yellow-400 brightness-125 mt-2">Tokens: {tokens}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center md:flex-row md:items-start mt-4">
          <img
            src={profilePicture ? `data:image/jpeg;base64,${profilePicture}` : ''}
            alt="Profile Picture"
            className="max-w-60 max-h-60 rounded-[10%] mb-4 md:mb-0 md:mr-6"
          />
          <p className="mt-2 text-center md:text-left max-w-[75%] md:max-w-[50%] break-words">
            {bio}
          </p>
        </div>
        {isLoggedIn && loggedInUsername === username && (
          <div className="flex flex-col items-center mt-4">
            <button
              onClick={toggleUsernameInput}
              className="bg-[#000110] text-white px-4 py-2 rounded mb-4 rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
            >
              {showUsernameInput ? 'Hide Username Input' : 'Change Username'}
            </button>
            {showUsernameInput && (
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  className="bg-[#000110] text-white px-4 py-2 rounded mb-2 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                  value={newUsername}
                  onChange={handleUsernameChangeInternal}
                  maxLength={12}
                />
                {usernameError && <p className="text-red-500 text-sm mb-2">{usernameError}</p>}
                <button
                  onClick={confirmUsernameChange}
                  className="bg-[#000110] text-white px-4 py-2 rounded shadow-sm text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
                >
                  Confirm Username
                </button>
              </div>
            )}
            <label htmlFor="fileInput" className="text-center cursor-pointer bg-[#000110] text-white px-4 py-2 rounded mt-2 mb-4 shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
              Change Profile Picture
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChangeInternal}
            />
            {fileError && <p className="text-red-500 text-sm mb-2">{fileError}</p>}
            <button
              onClick={toggleBioInput}
              className="bg-[#000110] text-white px-4 py-2 rounded mt-2 mb-4 shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
            >
              {showBioInput ? 'Hide Bio Input' : 'Change Bio'}
            </button>
            {showBioInput && (
              <div className="flex flex-col items-center">
                <textarea
                  className="bg-[#000110] text-white px-4 py-2 rounded mb-4 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                  value={newBio}
                  placeholder={bio}
                  onChange={handleBioChangeInternal}
                  maxLength={145}
                />
                <button
                  onClick={confirmBioChange}
                  className="bg-[#000110] text-white px-4 py-2 rounded shadow-sm text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 mb-6"
                >
                  Confirm Bio
                </button>
              </div>
            )}
          </div>
        )}
        <UsernamePopUp 
          visible={showPopup} 
          onClose={togglePopup} 
          links={links} 
          username={username} 
          position={popupPosition}
          supportersCount={supportersCount}
          isUserSupported={isUserSupported}
          onToggleSupport={onToggleSupport}
        />
      </div>
    </div>
  );
};

export default ProfileInfo;
