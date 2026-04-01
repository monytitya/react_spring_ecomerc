import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for JWT tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/admin/login', credentials),
  customerLogin: (credentials) => api.post('/auth/customer/login', credentials),
  register: (data) => api.post('/auth/customer/register', data),
};

export const dashboardApi = {
  getStats: () => api.get('/admin/dashboard/stats'),
};

export const orderApi = {
  getAll: () => api.get('/orders/admin/all'),
  updateStatus: (id, status) => api.put(`/orders/admin/${id}/status`, null, { params: { status } }),
  getCustomerOrders: (id) => api.get(`/orders/my/${id}`),
};

export const productApi = {
  getProducts: () => api.get('/products'),
  getFeatured: () => api.get('/products/featured'),
  getById: (id) => api.get(`/products/${id}`),
  search: (query) => api.get('/products/search', { params: { query } }),
  admin: {
    create: (data) => api.post('/admin/products', data),
    createWithFile: (formData) => api.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => api.put(`/admin/products/${id}`, data),
    delete: (id) => api.delete(`/admin/products/${id}`),
  }
};

export const customerApi = {
  getAll: () => api.get('/customers/admin/all'),
  getById: (id) => api.get(`/customers/${id}`),
  update: (id, data) => api.put(`/customers/${id}`, data),
  getPayments: () => api.get('/customers/payments'),
};

export const catalogApi = {
  getCategories: () => api.get('/categories'),
  getManufacturers: () => api.get('/manufacturers'),
};

export const couponApi = {
  getAll: () => api.get('/coupons/admin/all'),
  apply: (code) => api.post(`/coupons/apply/${code}`),
  validate: (code) => api.get(`/coupons/validate/${code}`),
};

export default api;
