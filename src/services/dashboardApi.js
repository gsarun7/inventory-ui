// services/dashboardApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get dashboard statistics
 * @returns {Promise<Object>}
 */
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/stats`);

    if (response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
};
