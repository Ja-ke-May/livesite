"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import ProfileInfo from './ProfileInfo';
import ProfileStarResults from './StarResults';
import RecentActivity from './RecentActivity';
import MyMeLogo from '../../components/MyMeLogo';
import Menu from '../../components/menu/Menu';
import LinksSection from './Links';
import Support from './Support';

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentPath, setCurrentPath] = useState('/profile');
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const [profilePicture, setProfilePicture] = useState("/vercel.svg");
  const [username, setUsername] = useState("Username");
  const [bio, setBio] = useState(`Hi, I'm ${username}! Welcome to my profile 😊`);
  const [links, setLinks] = useState([
    { id: 1, text: "Twitter", url: "https://twitter.com/username", imageUrl: 'vercel.svg' },
    { id: 2, text: "Instagram", url: "https://instagram.com/username", imageUrl: 'vercel.svg' },
    { id: 3, text: "LinkedIn", url: "https://linkedin.com/in/username", imageUrl: 'vercel.svg' }
  ]);
  const [newLinkText, setNewLinkText] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkImage, setNewLinkImage] = useState("");

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicture(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUsernameChange = useCallback((newUsername) => {
    setUsername(newUsername);
  }, []);

  const handleBioChange = useCallback((event) => {
    setBio(event.target.value);
  }, []);

  const handleAddLink = useCallback(() => {
    if (newLinkText && newLinkUrl) {
      const newLink = {
        id: links.length + 1,
        text: newLinkText,
        url: newLinkUrl,
        imageUrl: newLinkImage
      };
      setLinks(prevLinks => [...prevLinks, newLink]);
      setNewLinkText("");
      setNewLinkUrl("");
      setNewLinkImage("");
    }
  }, [newLinkText, newLinkUrl, newLinkImage, links]);

  const handleDeleteLink = useCallback((id) => {
    setLinks(prevLinks => prevLinks.filter(link => link.id !== id));
  }, []);

  useEffect(() => {
    setBio(`Hi, I'm ${username}! Welcome to my profile! 😊`);
  }, [username]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 10;
      setIsDarkBackground(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          handleFileChange={handleFileChange}
          handleUsernameChange={handleUsernameChange}
          handleBioChange={handleBioChange}
          links={links}
        />

        <Support username={username} />
        
        <LinksSection
          links={links}
          handleAddLink={handleAddLink}
          newLinkText={newLinkText}
          setNewLinkText={setNewLinkText}
          newLinkUrl={newLinkUrl}
          setNewLinkUrl={setNewLinkUrl}
          newLinkImage={newLinkImage}
          setNewLinkImage={setNewLinkImage}
          handleDeleteLink={handleDeleteLink}
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
