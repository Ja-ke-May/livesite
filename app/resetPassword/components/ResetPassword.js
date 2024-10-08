"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; 
import { resetPassword } from '@/utils/apiClient';

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-3YM558MVY4';
    script.async = true;
    document.body.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-3YM558MVY4');

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleResetPasswordSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setErrorMessage('Invalid token.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      await resetPassword(token, newPassword);
      setSuccessMessage('Password reset successfully.');
      setErrorMessage(''); 

     
    } catch (error) {
      setErrorMessage(error.message || 'Failed to reset password.');
      setSuccessMessage(''); 
    }
  };

  return (
    <>
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#000110] text-white p-4">
    
      <h1 className="text-3xl font-bold mb-6 text-center">Reset Your Password</h1>
      
      <form 
        onSubmit={handleResetPasswordSubmit} 
        className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg space-y-6"
      >
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
            New Password:
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-yellow-400 hover:bg-yellow-500 brightness-125 text-black font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
        >
          Reset Password
        </button>
      </form>

      {successMessage && (
        <p className="text-green-500 text-center mt-4">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-500 text-center mt-4">{errorMessage}</p>
      )}
    </div>

<a href="/" className={`fixed text-white font-black flex items-center top-0 z-[150]`}>
<div className="flex items-center justify-center">
  <p className="text-5xl">M</p>
</div>
<div className="flex flex-col items-center justify-center">
  <p className="text-xl leading-none">Y</p>
  <p className="text-xl leading-none">E</p>
</div>
</a>

</>
  );
};

export default ResetPassword;
