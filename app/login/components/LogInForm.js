import React, { useState, useContext } from 'react';
import { login as apiLogin } from '@/utils/apiClient';
import { AuthContext } from '@/utils/AuthContext';

const LogInForm = ({ setShowForgotPasswordModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Normalize email to lowercase
      const normalizedEmail = email.toLowerCase();
      console.log('Login attempt with email:', normalizedEmail);
      const data = await apiLogin({ email: normalizedEmail, password });
      // Store the token and username
      login(data.token, data.username);
      setErrorMessage('');
      window.location.href = `/profile/${data.username}`; // Redirect to /profile/<username> after successful login
    } catch (error) {
      console.error('Login error:', error.message);
      setErrorMessage(error.message || 'An unknown error occurred');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      
        <div className='bg-[#000110] w-[100%] h-[100%] mt-10 flex justify-center items-center animate-pulse'>
          Loading...
        </div>
      
    );
  }

  return (
    <>
      <form onSubmit={handleLoginSubmit} className="max-w-sm mx-auto mt-5 pl-5 pr-5">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
          <input
            type="email"
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            autoComplete="current-email"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
          <input
            type="password"
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            autoComplete="current-password"
          />
        </div>
        {errorMessage && (
          <div className="text-red-500 text-sm mt-5 flex justify-center">
            {errorMessage}
          </div>
        )}

        <button 
          type="button" 
          onClick={() => setShowForgotPasswordModal(true)} 
          className="text-gray-200 underline ml-4"
        >
          Forgot your password?
        </button>
        <button
          type="submit"
          className="w-full mt-4 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
        >
          Log In
        </button>
      </form>
    </>
  );
};

export default LogInForm;
