//apiClient.js 

import axios from 'axios';

const API_BASE_URL = 'https://livesite-backend.onrender.com';

const getToken = () => localStorage.getItem('token');

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Signs up a new user by sending the user data to the backend.
export const signup = async (userData) => {
  try {
    const response = await axiosInstance.post('/api/signup', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to sign up');
  }
};

export const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('/api/login', credentials);
      const { token, username } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username); // Store username in local storage
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to log in');
    }
  };  

// Logs out the user by removing the token from local storage.
export const logout = () => {
  localStorage.removeItem('token');
};


// Fetches user profile.
export const fetchUserProfile = async (username) => {
  try {
    const token = getToken();
    const response = await axiosInstance.get(`/api/profile/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};

// Updates the user's username.
export const updateUsername = async (newUsername) => {
  try {
    const token = getToken();
    const response = await axiosInstance.put('/api/profile/username', { userName: newUsername }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update username');
  }
};

// Updates the user's bio.
export const updateBio = async (newBio) => {
  try {
    const token = getToken();
    const response = await axiosInstance.put('/api/profile/bio', { bio: newBio }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update bio');
  }
};

// Fetches supporters count and user support status.
export const fetchSupporters = async (username) => {
  try {
    const token = getToken();
    const response = await axiosInstance.get('/api/supporters', {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { username },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch supporters');
  }
};

// Toggles the support status.
export const toggleSupport = async (username) => {
  try {
    const token = getToken();
    const response = await axiosInstance.post('/api/supporters/toggle', { username }, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to toggle support status');
  }
};

// Add a new link.
export const addLink = async (link) => {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append('text', link.text);
    formData.append('url', link.url);
    if (link.imageFile) {
      formData.append('image', link.imageFile);
    }

    const response = await axiosInstance.post('/api/profile/link', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to add link');
  }
};

// Delete a link.
export const deleteLink = async (linkId) => {
  try {
    const token = getToken();
    const response = await axiosInstance.delete(`/api/profile/link/${linkId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to delete link');
  }
};

export const fetchRecentActivity = async (username) => {
  try {
    const token = getToken();
    const response = await axiosInstance.get(`/api/recent-activity/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch recent activity');
  }
};

// Updates the user's profile picture.
export const updateProfilePicture = async (file) => {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await axiosInstance.post('/api/profile-picture', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to update profile picture');
  }
};


// main 

export const fetchOnlineUsers = async () => {
  try {
    const response = await axiosInstance.get('/api/online-users');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch online users');
  }
};

// Send Tokens

export const sendTokens = async (recipientUsername, tokenAmount) => {
  try {
    const token = getToken();
    const response = await axiosInstance.post('/api/send-tokens', {
      recipientUsername,
      tokenAmount
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to send tokens');
  }
};

// Deduct Tokens
export const deductTokens = async (amount) => {
  try {
    const token = getToken();
    const response = await axiosInstance.post('/api/deduct-tokens', {
      amount
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to deduct tokens');
  }
};
