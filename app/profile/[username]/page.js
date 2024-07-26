"use client";

import React, { useContext, useEffect, useCallback, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import ProfileInfo from '../components/ProfileInfo';
import ProfileStarResults from '../components/StarResults';
import RecentActivity from '../components/RecentActivity';
import Support from '../components/Support';
import LinksSection from '../components/Links';
import { fetchUserProfile, fetchSupporters, toggleSupport, updateProfilePicture, fetchRecentActivity } from '@/utils/apiClient';
import { AuthContext, AuthProvider } from '@/utils/AuthContext';

const ProfileContent = ({ profileUsername }) => {
  const { isLoggedIn, username: loggedInUsername, isInitialized } = useContext(AuthContext);
  const [profilePicture, setProfilePicture] = useState("");
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState([]);
  const [tokens, setTokens] = useState(0);
  const [supportersCount, setSupportersCount] = useState(0);
  const [isUserSupported, setIsUserSupported] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const loadUserProfile = async () => {
      try {
        const userProfile = await fetchUserProfile(profileUsername);
        setProfilePicture(userProfile.profilePicture);
        setBio(userProfile.bio || `Hi, I'm ${userProfile.userName}! Welcome to my profile 😊`);
        setLinks(userProfile.links || []);
        setTokens(userProfile.tokens || 0);

        const supportersData = await fetchSupporters(userProfile.userName);
        setSupportersCount(supportersData.supportersCount);
        setIsUserSupported(supportersData.isUserSupported);

        const recentActivityData = await fetchRecentActivity(userProfile.userName);
        setRecentActivity(recentActivityData);
      } catch (error) {
        console.error('Failed to load user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (profileUsername) {
      loadUserProfile();
    }

    // Polling for recent activity updates every 10 seconds
    const intervalId = setInterval(async () => {
      try {
        const recentActivityData = await fetchRecentActivity(profileUsername);
        setRecentActivity(recentActivityData);
      } catch (error) {
        console.error('Failed to fetch recent activity:', error);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [profileUsername, isInitialized]);

  const handleToggleSupport = async () => {
    const newIsUserSupported = !isUserSupported;
    const newSupportersCount = isUserSupported ? supportersCount - 1 : supportersCount + 1;

    setIsUserSupported(newIsUserSupported);
    setSupportersCount(newSupportersCount);

    try {
      const data = await toggleSupport(profileUsername);
      setIsUserSupported(data.isSupported);
      setSupportersCount(data.supportersCount);

      const recentActivityData = await fetchRecentActivity(profileUsername);
      setRecentActivity(recentActivityData);
    } catch (error) {
      console.error('Failed to toggle support status:', error.message);
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
  
  

  const handleBioChange = useCallback((event) => {
    setBio(event.target.value);
  }, []);

  if (isLoading || !isInitialized) {
    return <div><Navbar /><div className='bg-[#000110] w-screen h-screen flex justify-center items-center animate-pulse'>Loading...</div></div>; // Show a loading state while the profile is being loaded
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">
        <ProfileInfo
          profilePicture={profilePicture}
          username={profileUsername}
          bio={bio}
          handleFileChange={handleFileChange}
          handleBioChange={handleBioChange}
          links={links}
          tokens={tokens}
          supportersCount={supportersCount}
          isUserSupported={isUserSupported}
          onToggleSupport={handleToggleSupport}
          isLoggedIn={isLoggedIn && loggedInUsername === profileUsername} // Only allow changes if logged in user matches profile
          loggedInUsername={loggedInUsername} // Pass the logged-in username
        />
        <Support 
          username={profileUsername} 
          supportersCount={supportersCount}
          isUserSupported={isUserSupported}
          onToggleSupport={handleToggleSupport}
        />
        <LinksSection links={links} setLinks={setLinks} isLoggedIn={isLoggedIn && loggedInUsername === profileUsername} />
        <ProfileStarResults />
        <RecentActivity recentActivity={recentActivity} />
      </main>
    </>
  );
};

const ProfilePage = ({ params }) => {
  const { username } = params;
  return (
    <AuthProvider>
      <ProfileContent profileUsername={username} />
    </AuthProvider>
  );
};

export default ProfilePage;
