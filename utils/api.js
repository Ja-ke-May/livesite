import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4001', // Auth server URL
});

export const signup = (username, password) => {
  return api.post('/signup', { username, password });
};

export const signin = (username, password) => {
  return api.post('/signin', { username, password });
};

export const getProfile = (token) => {
  return api.get('/profile', {
    headers: { 'x-access-token': token },
  });
};
