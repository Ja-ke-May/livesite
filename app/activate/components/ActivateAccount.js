import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

const ActivateAccount = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();  

  const searchParams = useSearchParams();
  const token = searchParams.get('token'); 

  useEffect(() => {
    if (token) {
      activateAccount(token);
    }
  }, [token]);

  const activateAccount = async (token) => {
    try {
      const response = await axios.get(`/activate?token=${token}`);
      setMessage(response.data.message);

      
      setTimeout(() => {
        router.push('/login');  
      }, 1000); 
    } catch (err) {
      setError(err.response?.data?.message || 'Activation failed');
    }
  };

  return (
    <div className="flex w-full justify-center items-center activation-container bg-[#000110] text-white min-h-screen">
      {message ? (
        <div className="activation-success text-center">
          <h1>{message}</h1>
          <p>Your account has been activated successfully! Redirecting to the login page...</p>
          <a href="/login" className="btn">Go to Login</a>
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
