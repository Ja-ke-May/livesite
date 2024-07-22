// apiClient.js

const API_BASE_URL = 'http://localhost:5000';

/**
 * Signs up a new user by sending the user data to the backend.
 * @param {Object} userData - An object containing user details.
 * @param {string} userData.userName - The user's username.
 * @param {string} userData.signUpEmail - The user's email.
 * @param {string} userData.signUpPassword - The user's password.
 * @param {string} userData.dob - The user's date of birth.
 * @returns {Promise<Response>} - The response from the backend.
 */
export const signup = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign up');
      }
  
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'An unknown error occurred');
    }
  };
