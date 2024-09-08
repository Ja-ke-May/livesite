import axios from 'axios';

const API_BASE_URL = 'https://livesite-backend.onrender.com';

const getToken = () => localStorage.getItem('token');

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signup = async (userData) => {
  try {
    const response = await axiosInstance.post('/signup', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to sign up');
  }
};

export const activateAccount = async (token) => {
  try {
    const response = await axiosInstance.get(`/activate?token=${token}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to activate account');
  }
};

// Login with logging for isAdmin
export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/login', credentials);

    const { token, username, isAdmin } = response.data;
    console.log('Login response:', { token, username, isAdmin });  

    localStorage.setItem('token', token);
    localStorage.setItem('username', username); 
    localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
    
    console.log('Stored isAdmin in localStorage:', localStorage.getItem('isAdmin'));  

    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to log in');
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('isAdmin');
  console.log('User logged out. Cleared token, username, and isAdmin from localStorage.');
};


export const fetchUserProfile = async (username) => {
  try {
    const token = getToken();
    const response = await axiosInstance.get(`/profile/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};


export const updateUsername = async (newUsername) => {
  try {
    const token = getToken();
    const response = await axiosInstance.put('/profile/username', { userName: newUsername }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update username');
  }
};


export const updateBio = async (newBio) => {
  try {
    const token = getToken();
    const response = await axiosInstance.put('/profile/bio', { bio: newBio }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update bio');
  }
};


export const fetchSupporters = async (username) => {
  try {
    const token = getToken();
    const response = await axiosInstance.get('/supporters', {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { username },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch supporters');
  }
};


export const toggleSupport = async (username) => {
  try {
    const token = getToken();
    const response = await axiosInstance.post('/supporters/toggle', { username }, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to toggle support status');
  }
};


export const addLink = async (link) => {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append('text', link.text);
    formData.append('url', link.url);
    if (link.imageFile) {
      formData.append('image', link.imageFile);
    }

    const response = await axiosInstance.post('/profile/link', formData, {
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


export const deleteLink = async (linkId) => {
  try {
    const token = getToken();
    const response = await axiosInstance.delete(`/profile/link/${linkId}`, {
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
    const response = await axiosInstance.get(`/recent-activity/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch recent activity');
  }
};


export const updateProfilePicture = async (file) => {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await axiosInstance.post('/profile-picture', formData, {
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



export const fetchOnlineUsers = async () => {
  try {
    const response = await axiosInstance.get('/online-users');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch online users');
  }
};



export const sendTokens = async (recipientUsername, tokenAmount) => {
  try {
    const token = getToken();
    const response = await axiosInstance.post('/send-tokens', {
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


export const deductTokens = async (amount) => {
  try {
    const token = getToken();
    const response = await axiosInstance.post('/deduct-tokens', {
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


export const awardTokens = async (username, amount) => {
  try {
    const token = getToken();
    const response = await axiosInstance.post('/award-tokens', {
      username,
      amount
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to award tokens');
  }
};

export const reportUser = async (username, reportText) => {
  try {
    const token = getToken();
    const response = await axiosInstance.post('/report', { 
      username,
      content: reportText, 
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit report');
  }
};

export const updateColor = async (username, colorType, color) => {
  try {
    const token = getToken();
    const response = await axiosInstance.put('/comment/color', 
      { 
        username, 
        colorType, 
        color // sending color directly
      }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update color');
  }
};

export const blockUser = async (username, duration) => {
  try {
    const token = getToken();
    const response = await axiosInstance.post('/block-user', 
      { username, duration }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to block user');
  }
};

// Function to fetch user's blocked status
export const fetchUserBlockedStatus = async (token, username) => {
  try {
    const response = await axiosInstance.get(`/users/${username}/status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.isBlocked; // Return the blocked status
  } catch (error) {
    console.error('Failed to fetch blocked status:', error.response?.data?.message || error);
    throw new Error('Failed to fetch blocked status');
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await axiosInstance.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send password reset email');
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axiosInstance.post('/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};

export const sendLinkToAds = async (linkId) => {
  try {
    const token = getToken();
    const response = await axiosInstance.post(`/ads/send-link/${linkId}`, null, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send link to ads');
  }
};

export const fetchAdsCount = async () => {
  try {
    const response = await axiosInstance.get('/ads/count');
    return response.data.count;
  } catch (error) {
    throw new Error('Failed to fetch ads count');
  }
};

// Fetch ads from the backend, sorted by createdAt (oldest to newest)
export const fetchUserAds = async () => {
  try {
    const token = getToken();
    const response = await axiosInstance.get('/ads', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: {
        sort: 'createdAt', // Sort by createdAt in ascending order (oldest to newest)
      },
    });
    return response.data; // Return the ads data from the response
  } catch (error) {
    throw new Error('Failed to fetch user ads');
  }
};
