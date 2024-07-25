"use client";

import React, { useContext, useEffect, useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import ProfileInfo from '../components/ProfileInfo';
import ProfileStarResults from '../components/StarResults';
import RecentActivity from '../components/RecentActivity';
import MyMeLogo from '@/app/components/MyMeLogo';
import Menu from '@/app/components/menu/Menu';
import Support from '../components/Support';
import LinksSection from '../components/Links';
import { fetchUserProfile, fetchSupporters, toggleSupport, updateProfilePicture } from '@/utils/apiClient';
import { AuthContext, AuthProvider } from '@/utils/AuthContext';

const ProfileContent = ({ profileUsername }) => {
  const router = useRouter();
  const { username, isLoggedIn, isInitialized } = useContext(AuthContext);
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState([]);
  const [tokens, setTokens] = useState(0);
  const [supportersCount, setSupportersCount] = useState(0);
  const [isUserSupported, setIsUserSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const loadUserProfile = async () => {
      try {
        const userProfile = await fetchUserProfile(profileUsername);
        setProfilePicture(userProfile.profilePicture || "/vercel.svg");
        setBio(userProfile.bio || `Hi, I'm ${userProfile.userName}! Welcome to my profile 😊`);
        setLinks(userProfile.links || []);
        setTokens(userProfile.tokens || 0);

        const supportersData = await fetchSupporters(userProfile.userName);
        setSupportersCount(supportersData.supportersCount);
        setIsUserSupported(supportersData.isUserSupported);
      } catch (error) {
        console.error('Failed to load user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (profileUsername) {
      loadUserProfile();
    }
  }, [profileUsername, isInitialized]);

  const handleToggleSupport = async () => {
    const newIsUserSupported = !isUserSupported;
    const newSupportersCount = isUserSupported ? supportersCount - 1 : supportersCount + 1;

    setIsUserSupported(newIsUserSupported);
    setSupportersCount(newSupportersCount);

    try {
      const data = await toggleSupport(username);
      setIsUserSupported(data.isSupported);
      setSupportersCount(data.supportersCount);
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
    return <div className='bg-[#000110] w-screen h-screen flex justify-center items-center'>Loading...</div>; // Show a loading state while the profile is being loaded
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
        />
        <Support 
          username={profileUsername} 
          supportersCount={supportersCount}
          isUserSupported={isUserSupported}
          onToggleSupport={handleToggleSupport}
        />
        <LinksSection links={links} setLinks={setLinks} />
        <ProfileStarResults />
        <RecentActivity />
      </main>
      <MyMeLogo isDarkBackground={isDarkBackground} />
      <Menu isLoggedIn={isLoggedIn} isDarkBackground={isDarkBackground} />
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
