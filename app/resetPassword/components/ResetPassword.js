"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation'; 
import { resetPassword } from '@/utils/apiClient';
import MyMeLogo from '@/app/components/MyMeLogo';

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPasswordSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      setErrorMessage('Invalid token.');
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#000110] text-white p-4">
      <MyMeLogo />
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

        <button 
          type="submit" 
          className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
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
  );
};

export default ResetPassword;
