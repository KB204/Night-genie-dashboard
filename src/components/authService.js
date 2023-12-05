
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}token/`, {
      username,
      password,
    });
    const { access, refresh } = response.data;
    // Store tokens securely (e.g., in local storage)
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    return true;
  } catch (error) {
    console.error('Login error:', error.message);
    return false;
  }
};

export const logout = () => {
  // Remove tokens from local storage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const isAuthenticated = () => {
  // Check if the user is authenticated based on the presence of access token
  return localStorage.getItem('access_token') !== null;
};
