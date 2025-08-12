import axios from 'axios';

// Base API URL - adjust according to your backend server
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
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

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
export const API_CONFIG = {
  // Base URL for the API - update this with your actual backend URL
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // API Version
  VERSION: 'v1',
  
  // Timeout for requests (in milliseconds)
  TIMEOUT: 30000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    GOOGLE_LOGIN: '/auth/google',
    REFRESH_TOKEN: '/auth/refresh-token',
  },

  // Dashboard
  DASHBOARD: {
    METRICS: '/dashboard/metrics',
    ACTION_ITEMS: '/dashboard/action-items',
    CHARTS: {
      JOBS_POSTED: '/dashboard/charts/jobs-posted',
      REVENUE: '/dashboard/charts/revenue',
    },
    RECENT: {
      SIGNUPS: '/dashboard/recent-signups',
      JOBS: '/dashboard/recent-jobs',
      DISPUTES: '/dashboard/recent-disputes',
    }
  },

  // Users
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    BASIC_UPDATE: (id: string) => `/users/profile/basic/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    SUSPEND: (id: string) => `/users/${id}/suspend`,
    ACTIVATE: (id: string) => `/users/${id}/activate`,
  },

  // Jobs
  JOBS: {
    LIST: '/jobs',
    DETAIL: (id: string) => `/jobs/${id}`,
    CREATE: '/jobs',
    UPDATE: (id: string) => `/jobs/${id}`,
    DELETE: (id: string) => `/jobs/${id}`,
    FLAG: (id: string) => `/jobs/${id}/flag`,
    TAKEDOWN: (id: string) => `/jobs/${id}/takedown`,
  },

  // Freelancers
  FREELANCERS: {
    LIST: '/freelancers',
    DETAIL: (id: string) => `/freelancers/${id}`,
    REVIEWS: (id: string) => `/freelancers/${id}/reviews`,
  },

  // Payments
  PAYMENTS: {
    LIST: '/payments',
    DETAIL: (id: string) => `/payments/${id}`,
    PENDING_PAYOUTS: '/payments/pending-payouts',
    REFUND_REQUESTS: '/payments/refund-requests',
    DISPUTES: '/payments/disputes',
    PROCESS_PAYOUT: (id: string) => `/payments/${id}/process-payout`,
    PROCESS_REFUND: (id: string) => `/payments/${id}/process-refund`,
  },

  // Actions
  ACTIONS: {
    HANDLE_PENDING_PAYOUTS: '/actions/handle-pending-payouts',
    HANDLE_REFUND_REQUESTS: '/actions/handle-refund-requests',
    HANDLE_PAYMENT_DISPUTES: '/actions/handle-payment-disputes',
    HANDLE_PAYMENT_DISCREPANCIES: '/actions/handle-payment-discrepancies',
  },

  // Flags & Reports
  FLAGS: {
    LIST: '/flags',
    RESOLVE: (id: string) => `/flags/${id}/resolve`,
  },

  // Disputes
  DISPUTES: {
    LIST: '/disputes',
    DETAIL: (id: string) => `/disputes/${id}`,
    RESOLVE: (id: string) => `/disputes/${id}/resolve`,
  }
}
