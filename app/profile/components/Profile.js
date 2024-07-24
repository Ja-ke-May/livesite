"use client";

import React, { useContext, useEffect, useCallback, useState } from 'react';
import Navbar from '../../components/Navbar';
import ProfileInfo from './ProfileInfo';
import ProfileStarResults from './StarResults';
import RecentActivity from './RecentActivity';
import MyMeLogo from '../../components/MyMeLogo';
import Menu from '../../components/menu/Menu';
import Support from './Support';
import LinksSection from './Links';
import { fetchUserProfile, fetchSupporters, toggleSupport, updateProfilePicture } from '../../../utils/apiClient';
import { AuthContext, AuthProvider } from '../../../utils/AuthContext';

const ProfileContent = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [currentPath, setCurrentPath] = useState('/profile');
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState([]);
  const [tokens, setTokens] = useState(0);

  const [supportersCount, setSupportersCount] = useState(0);
  const [isUserSupported, setIsUserSupported] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setProfilePicture(userProfile.profilePicture || "/vercel.svg");
        setUsername(userProfile.userName);
        setBio(userProfile.bio || `Hi, I'm ${userProfile.userName}! Welcome to my profile 😊`);
        setLinks(userProfile.links || []);
        setTokens(userProfile.tokens || 0);

        // Fetch supporters data
        const supportersData = await fetchSupporters(userProfile.userName);
        setSupportersCount(supportersData.supportersCount);
        setIsUserSupported(supportersData.isUserSupported);
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    };

    loadUserProfile();
  }, []);

  const handleToggleSupport = async () => {
    // Optimistically update the UI
    const newIsUserSupported = !isUserSupported;
    const newSupportersCount = isUserSupported ? supportersCount - 1 : supportersCount + 1;
    
    setIsUserSupported(newIsUserSupported);
    setSupportersCount(newSupportersCount);

    try {
      const data = await toggleSupport(username);
      // Confirm the state with the actual response from the API
      setIsUserSupported(data.isSupported);
      setSupportersCount(data.supportersCount);
    } catch (error) {
      console.error('Failed to toggle support status:', error.message);
      // Revert the optimistic update if the API call fails
      setIsUserSupported(!newIsUserSupported);
      setSupportersCount(supportersCount);
    }
  };

  const handleFileChange = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const response = await updateProfilePicture(file);
        setProfilePicture(response.profilePicture);
      } catch (error) {
        console.error('Failed to update profile picture:', error);
      }
    }
  }, []);

  const handleUsernameChange = useCallback((newUsername) => {
    setUsername(newUsername);
  }, []);

  const handleBioChange = useCallback((event) => {
    setBio(event.target.value);
  }, []);

  return (
    <>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        currentPath={currentPath} 
        setCurrentPath={setCurrentPath} 
      />
      <main className="max-w-4xl mx-auto p-4">
        <ProfileInfo
          profilePicture={profilePicture}
          username={username}
          bio={bio}
          handleFileChange={handleFileChange}
          handleUsernameChange={handleUsernameChange}
          handleBioChange={handleBioChange}
          links={links}
          tokens={tokens} 
          supportersCount={supportersCount}   // Added prop
          isUserSupported={isUserSupported}  // Added prop
          onToggleSupport={handleToggleSupport}  // Added prop
        />
        <Support 
          username={username} 
          supportersCount={supportersCount}
          isUserSupported={isUserSupported}
          onToggleSupport={handleToggleSupport}
        />
        <LinksSection links={links} />
        <ProfileStarResults />
        <RecentActivity />
      </main>
      <MyMeLogo isDarkBackground={isDarkBackground} />
      <Menu 
        isLoggedIn={isLoggedIn} 
        currentPath={currentPath} 
        setCurrentPath={setCurrentPath} 
        isDarkBackground={isDarkBackground} 
      />
    </>
  );
};

const Profile = () => (
  <AuthProvider>
    <ProfileContent />
  </AuthProvider>
);

export default Profile;
