// services/unitApi.js
import axios from 'axios';

const API_BASE_URL =  'http://localhost:5000/api';

/**
 * Get all units
 * @returns {Promise<Array>}
 */
export const getAllUnits = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/units`);

    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching units:', error);
    return [];
  }
};

/**
 * Create new unit
 * @param {Object} unitData
 * @returns {Promise<Object>}
 */
export const createUnit = async (unitData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/units`, unitData);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to create unit'
    };
  } catch (error) {
    console.error('Error creating unit:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error creating unit'
    };
  }
};

/**
 * Update unit
 * @param {string} unitId
 * @param {Object} unitData
 * @returns {Promise<Object>}
 */
export const updateUnit = async (unitId, unitData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/units/${unitId}`, unitData);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to update unit'
    };
  } catch (error) {
    console.error('Error updating unit:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error updating unit'
    };
  }
};

/**
 * Delete unit
 * @param {string} unitId
 * @returns {Promise<Object>}
 */
export const deleteUnit = async (unitId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/units/${unitId}`);

    if (response.data.success) {
      return {
        success: true
      };
    }
    return {
      success: false,
      message: 'Failed to delete unit'
    };
  } catch (error) {
    console.error('Error deleting unit:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error deleting unit'
    };
  }
};
