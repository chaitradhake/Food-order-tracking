import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to append appropriate JWT if available
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('authToken');
    const deliveryToken = localStorage.getItem('deliveryToken');

    const isDeliveryRoute = config.url && (config.url.startsWith('/delivery') || config.url.startsWith('delivery'));
    // Admin-specific actions: settings, order status updates, or fetching all orders (GET /orders)
    const isAdminRoute =
      config.url && (
        config.url.includes('/settings') ||
        config.url.includes('/status') ||
        (config.url === '/orders' && config.method?.toLowerCase() === 'get')
      );

    if (isDeliveryRoute) {
      if (deliveryToken) {
        config.headers['Authorization'] = `Bearer ${deliveryToken}`;
      }
    } else if (isAdminRoute && adminToken) {
      config.headers['Authorization'] = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers['Authorization'] = `Bearer ${userToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
