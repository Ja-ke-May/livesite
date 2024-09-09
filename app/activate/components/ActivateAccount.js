"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { activateAccount } from '@/utils/apiClient';
import MyMeLogo from '@/app/components/MyMeLogo';

const ActivateAccount = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); 

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

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

  useEffect(() => {
    if (token) {
      activateAccount(token)
        .then(data => {
          setMessage(data.message);
          setLoading(false); 
        })
        .catch(err => {
          setError(err.message);
          setLoading(false); 
        });
    } else {
      setError('Invalid or missing token');
      setLoading(false); 
    }
  }, [token]);

  return (
    <div className="flex w-full justify-center items-center activation-container bg-[#000110] text-white min-h-screen">
      {loading ? (
        <div className="text-center">Loading...</div> 
      ) : message ? (
        <>
          <MyMeLogo />
          <div className="activation-success text-center">
            <h1>{message}</h1>
            <p>Your account has been activated successfully! You can now log in.</p>
            <br />
            <a href="/login" className="mt-6 bg-yellow-400 p-2 font-black rounded text-xl brightness-125 hover:bg-yellow-500 text-[#000110]">
              Go to Login
            </a>
          </div>
        </>
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
