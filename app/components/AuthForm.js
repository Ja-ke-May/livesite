// components/AuthForm.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';
import Link from 'next/link';

const AuthForm = ({ isSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize to false
  const currentPath = '/login';

  const handleSubmit = (event) => {
    event.preventDefault();
    // Simulate login success (for demonstration purposes)
    // In a real app, you would handle authentication and state management differently
    setIsLoggedIn(true);
    // Reset form fields after submission
    setEmail('');
    setPassword('');
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} currentPath={currentPath} />
      <BottomNavbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} currentPath={currentPath} />
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 pl-5 pr-5">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
          <input
            type="email"
            id="email"
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
            <Link href="/profile"
            >
          <button
            type="submit"
            className="w-full mt-4 py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
            
          >
            Log In
          </button>
          </Link>
        </div>
      </form>
      <from>
        <div className='flex justify-center align-center pt-10'>
            Sign Up Form
        </div>
      </from>
    </>
  );
};

export default AuthForm;
