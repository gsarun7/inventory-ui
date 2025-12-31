// services/warehouseApi.js
import axios from 'axios';

const API_BASE_URL =  'http://localhost:5000/api';

/**
 * Get all warehouses
 * @returns {Promise<Array>}
 */
export const getAllWarehouses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/warehouses`);

    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return [];
  }
};

/**
 * Create new warehouse
 * @param {Object} warehouseData
 * @returns {Promise<Object>}
 */
export const createWarehouse = async (warehouseData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/warehouses`, warehouseData);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to create warehouse'
    };
  } catch (error) {
    console.error('Error creating warehouse:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error creating warehouse'
    };
  }
};

/**
 * Update warehouse
 * @param {string} warehouseId
 * @param {Object} warehouseData
 * @returns {Promise<Object>}
 */
export const updateWarehouse = async (warehouseId, warehouseData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/warehouses/${warehouseId}`, warehouseData);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to update warehouse'
    };
  } catch (error) {
    console.error('Error updating warehouse:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error updating warehouse'
    };
  }
};

/**
 * Delete warehouse
 * @param {string} warehouseId
 * @returns {Promise<Object>}
 */
export const deleteWarehouse = async (warehouseId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/warehouses/${warehouseId}`);

    if (response.data.success) {
      return {
        success: true
      };
    }
    return {
      success: false,
      message: 'Failed to delete warehouse'
    };
  } catch (error) {
    console.error('Error deleting warehouse:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error deleting warehouse'
    };
  }
};
