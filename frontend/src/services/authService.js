import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';
const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

export const authService = {
    login: async (credentials) => {
        console.log('Sending login request:', credentials); // Debug log
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            console.log('Login API response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Login API error:', error.response || error); // Debug log
            throw error;
        }
    },

    registerUser: async (username, email, password) => {
        console.log('Sending registration request:', { username, email }); // Debug log
        try {
            const response = await axios.post(`${API_URL}/register`, {
                username,
                email,
                password
            });
            console.log('Registration response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Registration error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return !!(token && user);
    },

    checkBanStatus: async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/check-ban`, {
                headers: { Authorization: `Bearer ${authService.getToken()}` }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 403) {
                // User is banned, force logout
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            throw error;
        }
    }
}; 