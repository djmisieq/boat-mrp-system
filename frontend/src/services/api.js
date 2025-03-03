import axios from 'axios';

// Bazowy URL dla API - empty string dla proxy w development, custom URL dla produkcji lub Codespaces
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Interceptor dodający token autoryzacyjny do nagłówków
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor do obsługi błędów
axios.interceptors.response.use(
  response => response,
  error => {
    // Jeśli odpowiedź to 401 (Unauthorized), wyloguj użytkownika
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      // Opcjonalnie: przekierowanie do strony logowania lub odświeżenie
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API dla produktów
export const productsApi = {
  getAll: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/products`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  create: async (productData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/products`, productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  update: async (id, productData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/v1/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/v1/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }
};

// API dla list materiałowych (BOM)
export const bomsApi = {
  getAll: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/boms`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching BOMs:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/boms/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching BOM ${id}:`, error);
      throw error;
    }
  },

  create: async (bomData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/boms`, bomData);
      return response.data;
    } catch (error) {
      console.error('Error creating BOM:', error);
      throw error;
    }
  },

  update: async (id, bomData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/v1/boms/${id}`, bomData);
      return response.data;
    } catch (error) {
      console.error(`Error updating BOM ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/v1/boms/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting BOM ${id}:`, error);
      throw error;
    }
  }
};

// API dla zamówień
export const ordersApi = {
  getAll: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/orders`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  create: async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/orders`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  update: async (id, orderData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/v1/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/v1/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting order ${id}:`, error);
      throw error;
    }
  }
};

// Możesz dodać tutaj więcej API dla innych zasobów
