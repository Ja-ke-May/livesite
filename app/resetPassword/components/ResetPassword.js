"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation'; 
import { resetPassword } from '@/utils/apiClient';

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
    <div>
      <h1>Reset Your Password</h1>
      <form onSubmit={handleResetPasswordSubmit}>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default ResetPassword;
