import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

export const getHello = async () => {
  const response = await api.get('/hello');
  return response.data;
};

export default api; 