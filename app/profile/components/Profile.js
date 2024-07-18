
"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProfileInfo from './ProfileInfo';
import ProfileStarResults from './ProfileStarResults';
import RecentActivity from './RecentActivity';
import MyMeLogo from '../../components/MyMeLogo';
import Menu from '../../components/menu/Menu';
import LinksSection from './Links';
import Support from './Support';

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Example initial state
  const [currentPath, setCurrentPath] = useState('/profile');
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const [profilePicture, setProfilePicture] = useState("/path-to-profile-pic.jpg"); // Initial profile picture URL
  const [username, setUsername] = useState("Username");
  const [bio, setBio] = useState("This is a brief bio about the user. It provides some background information and other relevant details.");
  const [links, setLinks] = useState([
    { id: 1, text: "Twitter", url: "https://twitter.com/username" },
    { id: 2, text: "GitHub", url: "https://github.com/username" },
    { id: 3, text: "LinkedIn", url: "https://linkedin.com/in/username" }
  ]);
  const [newLinkText, setNewLinkText] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleAddLink = () => {
    if (newLinkText && newLinkUrl) {
      const newLink = {
        id: links.length + 1,
        text: newLinkText,
        url: newLinkUrl
      };
      setLinks([...links, newLink]);
      setNewLinkText("");
      setNewLinkUrl("");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 10; 
      if (scrollY > threshold && !isDarkBackground) {
        setIsDarkBackground(true);
      } else if (scrollY <= threshold && isDarkBackground) {
        setIsDarkBackground(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDarkBackground]);

  return (
    <>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        currentPath={currentPath} 
        setCurrentPath={setCurrentPath} 
      />
      <main className="max-w-4xl mx-auto p-4">
        <ProfileInfo
          profilePicture={profilePicture}
          username={username}
          bio={bio}
          links={links}
          handleFileChange={handleFileChange}
          handleUsernameChange={handleUsernameChange}
          handleBioChange={handleBioChange}
          handleAddLink={handleAddLink}
          newLinkText={newLinkText}
          setNewLinkText={setNewLinkText}
          newLinkUrl={newLinkUrl}
          setNewLinkUrl={setNewLinkUrl}
        />

        <Support 
        username={username}
        />

<LinksSection
          links={links}
          handleAddLink={handleAddLink}
          newLinkText={newLinkText}
          setNewLinkText={setNewLinkText}
          newLinkUrl={newLinkUrl}
          setNewLinkUrl={setNewLinkUrl}
        />
        <ProfileStarResults />
        <RecentActivity />
      </main>
      <MyMeLogo isDarkBackground={isDarkBackground} />
      <Menu 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        currentPath={currentPath} 
        setCurrentPath={setCurrentPath} 
        isDarkBackground={isDarkBackground} 
      />
    </>
  );
};

export default Profile;
