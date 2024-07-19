import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const SignUpForm = () => {
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [dob, setDob] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userNameRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]*$/;

  const handleSignUpSubmit = (event) => {
    event.preventDefault();

    const errors = [];

    // Validate terms acceptance
    if (!termsAccepted) {
      errors.push('Please accept the terms and conditions.');
    }

    // Validate username for allowed characters
    if (!userNameRegex.test(userName)) {
      errors.push("Username can only contain letters, numbers, and special characters.");
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
      errors.push('You must be at least 18 years old to sign up.');
    }

    if (signUpPassword !== confirmPassword) {
      errors.push('Passwords do not match.');
    }

    // Password requirements
    const passwordRequirements = [
      { regex: /.{6,}/, message: 'Password must be at least 6 characters long.' },
      { regex: /[A-Z]/, message: 'Password must contain at least one uppercase letter.' },
      { regex: /[a-z]/, message: 'Password must contain at least one lowercase letter.' },
      { regex: /[0-9]/, message: 'Password must contain at least one number.' },
      { regex: /[!@#$%^&*(),.?":{}|<>]/, message: 'Password must contain at least one special character.' },
    ];

    for (const requirement of passwordRequirements) {
      if (!requirement.regex.test(signUpPassword)) {
        errors.push(requirement.message);
      }
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(' '));
      setSuccessMessage('');
      return;
    }

    // Handle sign-up logic here (simulated success message)
    setSuccessMessage('Welcome to MyMe! Please check your email to activate your account.');
    setErrorMessage('');

    // Reset form fields
    setSignUpEmail('');
    setSignUpPassword('');
    setConfirmPassword('');
    setUserName('');
    setDob('');
    setTermsAccepted(false);
  };

  return (
    <form onSubmit={handleSignUpSubmit} className="max-w-sm mx-auto mt-10 pl-5 pr-5">
      <div className="flex justify-center align-center pt-5 text-lg font-bold text-gray-200">
        Sign Up
      </div>
      {errorMessage && (
        <div className="m-2 text-red-500 text-sm">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="m-2 text-green-500 text-sm">
          {successMessage}
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="userName" className="block text-sm font-medium text-gray-200">Username</label>
        <input
          type="text"
          id="userName"
          className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          minLength={3}
          maxLength={12}
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
        <label htmlFor="termsConditions" className="text-gray-200">
          Please confirm you have read our <span className='underline'>Terms and Conditions</span>
        </label>
      </div>
      <button
        type="submit"
        className="w-full mb-4 py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;
