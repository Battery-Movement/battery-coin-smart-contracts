import axios from 'axios';

export const getEthPrice = async () => {
  try {
    const response = await fetch(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (data && data["USD"]) {
      return data["USD"];
    } else {
      console.error("Failed to fetch ETH price:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    return null;
  }
};

// Get the backend URL from environment variables, with a fallback for local development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';



const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Centralized API calls
export const auth = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
};

export const user = {
  getProfile: () => api.get('/user'),
  updateProfile: (profileData) => api.put('/user', profileData),
  changePassword: (passwordData) => api.post('/user/password', passwordData),
};

export const presale = {
  getPresaleInfo: () => api.get('/get-presale-info.php'),
  approveToken: (data) => api.post('/presale/approve', data),
  buyToken: (data) => api.post('/presale/buy', data),
};

export const payment = {
  createCheckout: (checkoutData) => api.post('/payments/create-checkout', checkoutData),
  getPayment: (id) => api.get(`/payments/${id}`),
  getPurchaseHistory: (address) => api.get(`/get-purchase-history.php?address=${address}`),
};

export const notification = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export default api;
