// services/categoryApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
//process.env.REACT_APP_API_URL || 
/**
 * Get all categories
 * @returns {Promise<Array>}
 */
export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);

    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

/**
 * Create new category
 * @param {Object} categoryData
 * @returns {Promise<Object>}
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/categories`, categoryData);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to create category'
    };
  } catch (error) {
    console.error('Error creating category:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error creating category'
    };
  }
};

/**
 * Update category
 * @param {string} categoryId
 * @param {Object} categoryData
 * @returns {Promise<Object>}
 */
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/categories/${categoryId}`, categoryData);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to update category'
    };
  } catch (error) {
    console.error('Error updating category:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error updating category'
    };
  }
};

/**
 * Delete category
 * @param {string} categoryId
 * @returns {Promise<Object>}
 */
export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/categories/${categoryId}`);

    if (response.data.success) {
      return {
        success: true
      };
    }
    return {
      success: false,
      message: 'Failed to delete category'
    };
  } catch (error) {
    console.error('Error deleting category:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error deleting category'
    };
  }
};
