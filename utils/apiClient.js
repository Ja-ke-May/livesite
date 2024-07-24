import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Signs up a new user by sending the user data to the backend.
export const signup = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

// Logs in a user by sending their email and password to the backend.
export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

// Logs out the user by removing the token from local storage.
export const logout = () => {
    localStorage.removeItem('token');
};

// Fetches the user's profile data.
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

// Updates the user's username.
export const updateUsername = async (newUsername) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/profile/username`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName: newUsername }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update username');
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'An unknown error occurred');
    }
};

// Updates the user's bio.
export const updateBio = async (newBio) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/profile/bio`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bio: newBio }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update bio');
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'An unknown error occurred');
    }
};

// Updates the user's profile picture.
export const updateProfilePicture = async (profilePicture) => {
    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/profile-picture`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update profile picture');
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'An unknown error occurred');
    }
};

// Fetches supporters count and user support status.
export const fetchSupporters = async (username) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found, please log in');
        }

        const response = await axios.get(`${API_BASE_URL}/api/supporters`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { username },
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response from server:', error.response);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error in setup:', error.message);
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch supporters');
    }
};

// Toggles the support status.
export const toggleSupport = async (username) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found, please log in');
        }

        const response = await axios.post(`${API_BASE_URL}/api/supporters/toggle`, 
            { username },
            {
                headers: { 'Authorization': `Bearer ${token}` },
            }
        );

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response from server:', error.response);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error in setup:', error.message);
        }
        throw new Error(error.response?.data?.message || 'Failed to toggle support status');
    }
};
