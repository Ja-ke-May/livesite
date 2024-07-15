"use client";

// components/AuthForm.js
import React, { useState } from 'react';
import Navbar from './Navbar';
import Link from 'next/link';
import SignUpForm from './SignUpForm';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize to false
  const [currentPath, setCurrentPath] = useState('/login');

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
    setEmail('');
    setPassword('');
  };

  return (
    <>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        currentPath={currentPath} 
        setCurrentPath={setCurrentPath} 
      />
      <form onSubmit={handleLoginSubmit} className="max-w-sm mx-auto mt-20 pt-5 pl-5 pr-5">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
          <input
            type="email"
            id="email"
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
          <input
            type="password"
            id="password"
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Link href="/profile">
            <button
              type="submit"
              className="w-full mt-4 py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
            >
              Log In
            </button>
          </Link>
        </div>
      </form>
      <SignUpForm />
    </>
  );
};

export default AuthForm;
