import React, { useState, useEffect } from 'react';
import { signup } from '@/utils/apiClient';
import TermsAndConditionsModal from './TermsAndConditionsModal';

const isValidUsername = (username) => /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]*$/.test(username);

const validatePassword = (password) => {
  const requirements = [
    { regex: /.{6,}/, message: 'Password must be at least 6 characters long.' },
    { regex: /[A-Z]/, message: 'Password must contain at least one uppercase letter.' },
    { regex: /[a-z]/, message: 'Password must contain at least one lowercase letter.' },
    { regex: /[0-9]/, message: 'Password must contain at least one number.' },
    { regex: /[!@#$%^&*(),.?":{}|<>]/, message: 'Password must contain at least one special character.' },
  ];

  return requirements
    .filter(({ regex }) => !regex.test(password))
    .map(({ message }) => message);
};

const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [dob, setDob] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checkUsernameAvailability = debounce(async (username) => {
    if (username.trim() === '') {
      setUsernameAvailable(true);
      setUsernameChecking(false);
      return;
    }

    setUsernameChecking(true);

    try {
      const response = await fetch(`https://livesite-backend.onrender.com/check-username/${username}`);
      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(false);
    } finally {
      setUsernameChecking(false);
    }
  }, 500); 

  useEffect(() => {
    checkUsernameAvailability(userName);
  }, [userName]);

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();

    const errors = [];

    if (!termsAccepted) {
      errors.push('Please accept the terms and conditions.');
    }

    if (!isValidUsername(userName)) {
      errors.push("Username can only contain letters, numbers, and special characters.");
    }

    if (!usernameAvailable) {
      errors.push('Username is already taken.');
    }

    const age = calculateAge(dob);
    if (age < 18) {
      errors.push('You must be at least 18 years old to sign up.');
    }

    if (password !== confirmPassword) {
      errors.push('Passwords do not match.');
    }

    const passwordErrors = validatePassword(password);
    errors.push(...passwordErrors);

    if (errors.length > 0) {
      setErrorMessages(errors);
      setSuccessMessage('');
      return;
    }

    try {
      const userData = { userName, email, password, dob, marketingConsent };
      await signup(userData);
      setSuccessMessage('Welcome to MyMe! Please check your email to activate your account.');
      setErrorMessages([]);
    } catch (error) {
      setErrorMessages([`Error: ${error.message}`]);
      setSuccessMessage('');
    }

    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUserName('');
    setDob('');
    setTermsAccepted(false);
    setMarketingConsent(false);
  };

  return (
    <>
      <form onSubmit={handleSignUpSubmit} className="max-w-sm mx-auto mt-10 pl-5 pr-5">
        <div className="flex justify-center items-center pt-5 text-lg font-bold text-gray-200">
          Sign Up
        </div>
        {errorMessages.length > 0 && (
          <div className="m-2 text-red-500 text-sm">
            {errorMessages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
        )}
        {successMessage && (
          <div className="m-2 text-green-500 text-sm">
            {successMessage}
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="userName" className="block text-sm font-medium text-gray-200">Username</label>
          {!usernameAvailable && !usernameChecking && (
            <div className="text-red-500 text-sm mt-1">Username is already taken.</div>
          )}
          <input
            type="text"
            id="userName"
            className={`text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm ${!usernameAvailable && 'border-red-500'}`}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            minLength={3}
            maxLength={12}
            required
            autoComplete="new-username"
            placeholder='max characters 12'
          />
          
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
          <input
            type="email"
            id="email"
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="your-email"
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
            autoComplete="date-of-birth"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
          <input
            type="password"
            id="password"
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
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
            autoComplete="confirm-password"
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
            Please confirm you have read our{' '}
            <span
              className="underline cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              Terms and Conditions
            </span>
          </label>
        </div>
        <div className="m-4">
          <input
            type="checkbox"
            id="marketingConsent"
            className="mr-2"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
          />
          <label htmlFor="marketingConsent" className="text-gray-200">
            Do you agree to be contacted with marketing offers and updates?
          </label>
        </div>
        <button
          type="submit"
          className="w-full mb-4 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800/80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
        >
          Sign Up
        </button>
      </form>
      <TermsAndConditionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default SignUpForm;
