"use client";

import React, { useContext, useEffect, useCallback, useState, lazy, Suspense } from 'react';
import Navbar from '@/app/components/Navbar';
import { fetchUserProfile, fetchSupporters, toggleSupport, updateProfilePicture, fetchRecentActivity } from '@/utils/apiClient';
import { AuthContext, AuthProvider } from '@/utils/AuthContext';

const ProfileInfo = lazy(() => import('../components/ProfileInfo'));
const ProfileStarResults = lazy(() => import('../components/StarResults'));
const RecentActivity = lazy(() => import('../components/RecentActivity'));
const Support = lazy(() => import('../components/Support'));
const LinksSection = lazy(() => import('../components/Links'));

const ProfileContent = ({ profileUsername }) => {
  const { isLoggedIn, username: loggedInUsername, isInitialized, isAdmin } = useContext(AuthContext);
  const [profilePicture, setProfilePicture] = useState("");
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState([]);
  const [tokens, setTokens] = useState(0);
  const [supportersCount, setSupportersCount] = useState(0);
  const [isUserSupported, setIsUserSupported] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  const [totalLiveDuration, setTotalLiveDuration] = useState(0); 
  const [longestLiveDuration, setLongestLiveDuration] = useState(0);
  const [commentColor, setCommentColor] = useState('#ffffff');
const [borderColor, setBorderColor] = useState('#000110');
const [usernameColor, setUsernameColor] = useState('#ffffff');


  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isInitialized || !profileUsername) return;

    const loadUserProfile = async () => {
      try {
        const [userProfile, supportersData, recentActivityData] = await Promise.all([
          fetchUserProfile(profileUsername),
          fetchSupporters(profileUsername),
          fetchRecentActivity(profileUsername)
        ]);

        setProfilePicture(userProfile.profilePicture ? `data:image/jpeg;base64,${userProfile.profilePicture}` : '/images/logo.jpg');
        setBio(userProfile.bio || `Hi, I'm ${userProfile.userName}! Welcome to my profile 😊`);
        setLinks(userProfile.links || []);
        setTokens(userProfile.tokens || 0);
        setSupportersCount(supportersData.supportersCount);
        setIsUserSupported(supportersData.isUserSupported);
        setRecentActivity(recentActivityData);
        setTotalLiveDuration(userProfile.totalLiveDuration || 0); 
        setLongestLiveDuration(userProfile.longestLiveDuration || 0); 

        setCommentColor(userProfile.commentColor || '#ffffff');
        setBorderColor(userProfile.borderColor || '#000110');
        setUsernameColor(userProfile.usernameColor || '#ffffff');

      } catch (error) {
        console.error('Failed to load user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();

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

  const handleToggleSupport = useCallback(async () => {
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
  }, [isUserSupported, supportersCount, profileUsername]);

  const handleFileChange = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const response = await updateProfilePicture(file);
        setProfilePicture(response.profilePicture ? `data:image/jpeg;base64,${response.profilePicture}` : '/images/logo.jpg');
      } catch (error) {
        console.error('Failed to update profile picture:', error);
        setProfilePicture('/images/logo.jpg');
      }
    }
  }, []);

  const handleBioChange = useCallback((event) => {
    setBio(event.target.value);
  }, []);

  if (isLoading || !isInitialized) {
    return (
      <div>
        <Navbar />
        <div className='bg-[#000110] w-[100%] h-[100%] flex justify-center items-center animate-pulse mt-10'>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">
        <Suspense>
          <ProfileInfo
            profilePicture={profilePicture}
            username={profileUsername}
            isAdmin={isAdmin}
            bio={bio}
            handleFileChange={handleFileChange}
            handleBioChange={handleBioChange}
            links={links}
            tokens={tokens}
            supportersCount={supportersCount}
            isUserSupported={isUserSupported}
            onToggleSupport={handleToggleSupport}
            isLoggedIn={isLoggedIn && loggedInUsername === profileUsername} 
            loggedInUsername={loggedInUsername} 
            commentColor={commentColor}
            borderColor={borderColor}
            usernameColor={usernameColor}
          />
        </Suspense>
        <Suspense>
          <Support 
            username={profileUsername} 
            supportersCount={supportersCount}
            isUserSupported={isUserSupported}
            onToggleSupport={handleToggleSupport}
            borderColor={borderColor}
            usernameColor={usernameColor}
            commentColor={commentColor}
          />
        </Suspense>
        <Suspense>
          <LinksSection links={links} setLinks={setLinks} isLoggedIn={isLoggedIn && loggedInUsername === profileUsername}
          commentColor={commentColor}
          borderColor={borderColor}
          usernameColor={usernameColor}
           />
        </Suspense>
        <Suspense>
        <ProfileStarResults 
            totalLiveDuration={totalLiveDuration} 
            longestLiveDuration={longestLiveDuration} 
            borderColor={borderColor}
            usernameColor={usernameColor}
            commentColor={commentColor}
          />
        </Suspense>
        <Suspense>
          <RecentActivity 
          recentActivity={recentActivity} 
          commentColor={commentColor}
    borderColor={borderColor}
    usernameColor={usernameColor}
    />
        </Suspense>
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

