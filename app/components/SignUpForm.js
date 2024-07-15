import React, { useState } from 'react';

const SignUpForm = () => {
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [dob, setDob] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false); // State for terms acceptance
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUpSubmit = (event) => {
    event.preventDefault();

    // Validate terms acceptance
    if (!termsAccepted) {
      setErrorMessage('Please accept the terms and conditions.');
      return;
    }

    // Calculate age based on DOB
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age < 18) {
      setErrorMessage('You must be at least 18 years old to sign up.');
      return;
    }

    if (signUpPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Handle sign-up logic here
    setSignUpEmail('');
    setSignUpPassword('');
    setConfirmPassword('');
    setSignUpName('');
    setDob('');
    setTermsAccepted(false);
    setErrorMessage('');
  };

  return (
    <form onSubmit={handleSignUpSubmit} className="max-w-sm mx-auto mt-10 pl-5 pr-5">
      <div className="flex justify-center align-center pt-10 text-lg font-bold text-gray-200">
        Sign Up Form
      </div>
      {errorMessage && (
        <div className="m-2 text-red-500 text-sm">
          {errorMessage}
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="signUpName" className="block text-sm font-medium text-gray-200">Name</label>
        <input
          type="text"
          id="signUpName"
          className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
          value={signUpName}
          onChange={(e) => setSignUpName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="signUpEmail" className="block text-sm font-medium text-gray-200">Email</label>
        <input
          type="email"
          id="signUpEmail"
          className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
          value={signUpEmail}
          onChange={(e) => setSignUpEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="dob" className="block text-sm font-medium text-gray-200">Date of Birth</label>
        <input
          type="date"
          id="dob"
          className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="signUpPassword" className="block text-sm font-medium text-gray-200">Password</label>
        <input
          type="password"
          id="signUpPassword"
          className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
          value={signUpPassword}
          onChange={(e) => setSignUpPassword(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <div className="m-4">
        <input
          type="checkbox"
          id="termsConditions"
          className="mr-2"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          required
        />
        <label htmlFor="termsConditions" className="text-gray-200 underline">
          Please confirm you have read our terms and conditions
        </label>
      </div>
      <div className="mb-4">
        <button
          type="submit"
          className="w-full mt-4 py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
