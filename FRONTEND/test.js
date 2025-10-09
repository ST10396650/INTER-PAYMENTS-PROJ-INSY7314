//API.js

import axios from 'axios';

// Base URL for your backend
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;



//authService.js

import api from './api';

// Customer Registration
export const registerCustomer = async (userData) => {
  try {
    const response = await api.post('/customer/register', {
      full_name: userData.fullName,
      id_number: userData.idNumber,
      account_number: userData.accountNumber,
      username: userData.username,
      password: userData.password,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Registration failed' 
    };
  }
};

// Customer Login
export const loginCustomer = async (credentials) => {
  try {
    const response = await api.post('/customer/login', {
      username: credentials.username,
      account_number: credentials.accountNumber,
      password: credentials.password,
    });
    
    // Save token and user data to localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      localStorage.setItem('userType', 'customer');
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Login failed' 
    };
  }
};

// Employee Login
export const loginEmployee = async (credentials) => {
  try {
    const response = await api.post('/employee/login', {
      username: credentials.username,
      password: credentials.password,
    });
    
    // Save token and user data to localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      localStorage.setItem('userType', 'employee');
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Login failed' 
    };
  }
};

// Get Customer Profile
export const getCustomerProfile = async () => {
  try {
    const response = await api.get('/customer/profile');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch profile' 
    };
  }
};

// Get Employee Profile
export const getEmployeeProfile = async () => {
  try {
    const response = await api.get('/employee/profile');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch profile' 
    };
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userType');
  window.location.href = '/login';
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get user type
export const getUserType = () => {
  return localStorage.getItem('userType');
};



//paymentService.js

// 1. CREATE A PAYMENT
export const createPayment = async (paymentData) => {
  const response = await api.post('/customer/payment', {
    amount: paymentData.amount,
    currency: paymentData.currency,
    beneficiary_name: paymentData.beneficiaryName,
    // ... sends payment data to backend
  });
  return response.data;
};

// 2. GET ALL YOUR TRANSACTIONS
export const getTransactions = async (filters = {}) => {
  // Can filter by status, page, limit
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.limit) params.append('limit', filters.limit);
  
  const response = await api.get(`/customer/transactions?${params}`);
  return response.data;
};

// 3. GET ONE TRANSACTION BY ID
export const getTransactionById = async (transactionId) => {
  const response = await api.get(`/customer/transactions/${transactionId}`);
  return response.data;
};

// 4. GET STATISTICS (how many pending, verified, etc.)
export const getTransactionStats = async () => {
  const response = await api.get('/customer/transactions/stats');
  return response.data;
};
