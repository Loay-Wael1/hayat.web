import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/Auth/login', credentials);
    return response.data;
  },
};
