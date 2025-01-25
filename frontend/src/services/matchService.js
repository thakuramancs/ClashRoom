import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debug log
    if (!token) {
        return null;
    }
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };
};

const getToken = () => {
    return localStorage.getItem('token');
};

const getAuthConfig = (token) => {
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

export const matchService = {
  getAllMatches: async () => {
    try {
      const config = getAuthHeader();
      console.log('Auth config:', config); // Debug auth header
      const response = await axios.get(`${API_URL}/matches`, config);
      return response.data;
    } catch (error) {
      console.error('Get matches error details:', error.response?.data);
      throw error;
    }
  },

  createMatch: async (matchData) => {
    const config = getAuthHeader();
    if (!config) {
      throw new Error('Authentication required');
    }
    try {
      const response = await axios.post(`${API_URL}/matches`, matchData, config);
      return response.data;
    } catch (error) {
      console.error('Create match error:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteMatch: async (matchId) => {
    const config = getAuthHeader();
    if (!config) {
      throw new Error('Authentication required');
    }
    try {
      // First, get all players in the match
      const playersResponse = await axios.get(`${API_URL}/matches/${matchId}/players`);
      const players = playersResponse.data;

      // If there are players, throw an error or handle accordingly
      if (players && players.length > 0) {
        throw new Error('Cannot delete match with registered players. Please remove players first.');
      }

      // If no players, proceed with match deletion
      await axios.delete(`${API_URL}/matches/${matchId}`, config);
    } catch (error) {
      // Handle specific error cases
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to delete this match');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to delete match');
      }
    }
  },

  joinMatch: async (matchId) => {
    const config = getAuthHeader();
    if (!config) {
      throw new Error('Authentication required');
    }
    try {
      const response = await axios.post(`${API_URL}/matches/${matchId}/join`, {}, config);
      return response.data;
    } catch (error) {
      console.error('Join match error:', error.response?.data || error.message);
      throw error;
    }
  },

  getMatchPlayers: async (matchId) => {
    try {
      const response = await axios.get(`${API_URL}/matches/${matchId}/players`);
      return response.data;
    } catch (error) {
      console.error('Get match players error:', error.response?.data || error.message);
      throw error;
    }
  },

  getMatch: async (matchId) => {
    try {
      const response = await axios.get(`${API_URL}/matches/${matchId}`);
      return response.data;
    } catch (error) {
      console.error('Get match details error:', error.response?.data || error.message);
      throw error;
    }
  },

  cancelMatch: async (matchId) => {
    const config = getAuthHeader();
    if (!config) {
      throw new Error('Authentication required');
    }
    try {
      const response = await axios.patch(`${API_URL}/matches/${matchId}/cancel`, {}, config);
      return response.data;
    } catch (error) {
      console.error('Cancel match error:', error.response?.data || error.message);
      throw error;
    }
  },

  updateMatch: async (matchId, matchData) => {
    const config = getAuthHeader();
    if (!config) {
      throw new Error('Authentication required');
    }
    try {
      const response = await axios.put(`${API_URL}/matches/${matchId}`, matchData, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update match');
    }
  },

  updateRoomDetails: async (matchId, roomData) => {
    const config = getAuthHeader();
    if (!config) {
      throw new Error('Authentication required');
    }
    try {
      const response = await axios.put(
        `${API_URL}/matches/${matchId}/room-details`,
        roomData,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update room details');
    }
  },

  getMatchDetails: async (matchId) => {
    try {
      const config = getAuthHeader();
      console.log('Request config:', config); // Debug log
      if (!config) {
        throw new Error('Authentication required');
      }
      const response = await axios.get(`${API_URL}/matches/${matchId}/details`, config);
      return response.data;
    } catch (error) {
      console.error('Full error:', error); // More detailed error log
      throw new Error(error.response?.data?.message || 'Failed to fetch match details');
    }
  },

  exitMatch: async (matchId) => {
    const token = getToken();
    const config = getAuthConfig(token);
    try {
        const response = await axios.post(`${API_URL}/matches/${matchId}/exit`, {}, config);
        return response.data;
    } catch (error) {
        throw error;
    }
  }
};