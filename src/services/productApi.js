// services/productApi.js
import axios from 'axios';

const API_BASE_URL =  'http://localhost:5000/api';

/**
 * Get all products
 * @returns {Promise<Array>}
 */
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);

    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

/**
 * Create new product
 * @param {Object} productData
 * @returns {Promise<Object>}
 */
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products`, productData);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to create product'
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error creating product'
    };
  }
};

/**
 * Update product
 * @param {string} productId
 * @param {Object} productData
 * @returns {Promise<Object>}
 */
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/products/${productId}`, productData);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to update product'
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error updating product'
    };
  }
};

/**
 * Delete product
 * @param {string} productId
 * @returns {Promise<Object>}
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/products/${productId}`);

    if (response.data.success) {
      return {
        success: true
      };
    }
    return {
      success: false,
      message: 'Failed to delete product'
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error deleting product'
    };
  }
};
