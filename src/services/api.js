import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: 'https://localhost:7224',
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 4xx and 5xx errors dynamically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let customMessage = 'حدث خطأ أثناء الاتصال بالخادم.';
    
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle 4xx Client Errors
      if (status >= 400 && status < 500) {
        if (typeof data === 'string' && data.length > 0) {
          customMessage = data;
        } else if (data && typeof data === 'object') {
          // Check for .NET Core ValidationProblemDetails style
          if (data.errors && Object.keys(data.errors).length > 0) {
            const firstKey = Object.keys(data.errors)[0];
            const firstError = data.errors[firstKey];
            customMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          } 
          // Other common fields
          else if (data.message) {
            customMessage = data.message;
          } else if (data.detail) {
            customMessage = data.detail;
          } else if (data.title) {
            customMessage = data.title;
          }
        }
      } 
      // Handle 5xx Server Errors
      else if (status >= 500) {
        customMessage = 'حدث خطأ داخلي في الخادم. الرجاء المحاولة لاحقاً.';
      }
    } else if (error.request) {
      customMessage = 'لا يوجد استجابة من الخادم. تأكد من اتصالك بالإنترنت.';
    }

    // Attach the parsed message so it can be easily accessed by components
    error.customMessage = customMessage;
    return Promise.reject(error);
  }
);

export default api;
