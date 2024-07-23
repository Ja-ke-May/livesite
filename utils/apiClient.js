//apiClient.js
const API_BASE_URL = 'http://localhost:5000';

/**
 * Signs up a new user by sending the user data to the backend.
 * @param {Object} userData - An object containing user details.
 * @param {string} userData.userName - The user's username.
 * @param {string} userData.email - The user's email.
 * @param {string} userData.password - The user's password.
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
            body: JSON.stringify({
                userName: userData.userName,
                email: userData.email,
                password: userData.password,
                dob: userData.dob,
            }),
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

/**
 * Logs in a user by sending their email and password to the backend.
 * @param {Object} credentials - An object containing email and password.
 * @returns {Promise<Object>} - The response from the backend, including a token.
 */
export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to log in');
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'An unknown error occurred');
    }
};

/**
 * Logs out the user by removing the token from local storage.
 */
export const logout = () => {
    localStorage.removeItem('token');
};

/**
 * Fetches the user's profile data.
 * @returns {Promise<Object>} - The user data.
 */
export const fetchUserProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch user profile');
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'An unknown error occurred');
    }
};
