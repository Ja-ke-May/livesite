import React, { useState, useEffect, useContext } from 'react';
import Navbar from '@/app/components/Navbar';
import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';
import { AuthContext, AuthProvider } from '@/utils/AuthContext';

const AuthFormContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { username } = useContext(AuthContext);
  const [currentPath, setCurrentPath] = useState('/login');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleForgotPasswordSubmit = (event) => {
    event.preventDefault();
    setSuccessMessage('Please check your email to reset your password.');
    setForgotPasswordEmail('');
    setShowForgotPasswordModal(false);
  };

  return (
    <>
      <Navbar 
        isLoggedIn={isLoggedIn}
        username={username} // Pass the username to Navbar
        currentPath={currentPath}
        setCurrentPath={setCurrentPath}
      />
      {successMessage && (
        <div className="text-green-500 text-sm mt-5 flex justify-center">
          {successMessage}
        </div>
      )}
      
      <LogInForm 
        setIsLoggedIn={setIsLoggedIn}
        setShowForgotPasswordModal={setShowForgotPasswordModal}
      />

      <SignUpForm />


      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-[#000110]/80 flex items-center justify-center z-50">
          <div className="p-6 bg-[#000110] rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-medium mb-4">Reset Password</h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              <label htmlFor="forgotPasswordEmail" className="block text-sm font-medium text-gray-300">Enter your email</label>
              <input
                type="email"
                id="forgotPasswordEmail"
                className="mt-1 block w-full px-3 py-2 border text-[#000110] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="mr-2 py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                >
                  Reset My Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const AuthForm = () => (
  <AuthProvider>
    <AuthFormContent />
  </AuthProvider>
);

export default AuthForm;
