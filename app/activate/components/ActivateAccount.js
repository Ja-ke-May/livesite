"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { activateAccount } from '@/utils/apiClient';

const ActivateAccount = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      activateAccount(token)
        .then(data => {
          setMessage(data.message);
        })
        .catch(err => {
          setError(err.message);
        });
    }
  }, [token]);

  return (
    <div className="flex w-full justify-center items-center activation-container bg-[#000110] text-white min-h-screen">
      {message ? (
        <div className="activation-success text-center">
          <h1>{message}</h1>
          <p>Your account has been activated successfully! You can now log in.</p>
          <a href="/login" className="bg-yellow-400 p-2 font-black rounded text-xl hover:bg-yellow-500 text-[#000110]">Go to Login</a>
        </div>
      ) : (
        <div className="activation-error text-center">
          <h1>{error}</h1>
          <p>There was a problem with activating your account. The activation link may have expired.</p>
        </div>
      )}
    </div>
  );
};

export default ActivateAccount;
