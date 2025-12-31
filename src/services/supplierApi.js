// services/supplierApi.js
import axios from 'axios';

const API_BASE_URL = 'https://6042f570-5be5-4780-863a-e649b5dc0a87.mock.pstmn.io/api/v1';

/**
 * Get all suppliers
 * @returns {Promise<Array>} - List of all suppliers
 */
export const getAllSuppliers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/suppliers`);
    // Transform data to match expected format
    const transformedData = response.data.map(supplier => ({
      id: supplier.id,
      name: supplier.name,
      phone: supplier.phone,
      address_line1: supplier.address || '',     // Transform here
      address_line2: '',
      city: '',
      state: '',
      pincode: '',
      gst_number: supplier.gstNo || ''           // Transform here
    }));
    
    console.log('Transformed data:', transformedData);
    return transformedData;
    
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
};

/**
 * Search suppliers by name or phone
 * @param {string} searchTerm - Supplier name or phone to search
 * @returns {Promise<Array>} - List of matching suppliers
 */
export const searchSuppliers = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/suppliers/search`, {
      params: { query: searchTerm }
    });

    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error searching suppliers:', error);
    return [];
  }
};


/**
 * Create new supplier
 * @param {Object} supplierData - Supplier data
 * @returns {Promise<Object>}
 */
export const createSupplier = async (supplierData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/suppliers`, supplierData);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to create supplier'
    };
  } catch (error) {
    console.error('Error creating supplier:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error creating supplier'
    };
  }
};

/**
 * Update supplier
 * @param {string} supplierId - Supplier ID
 * @param {Object} supplierData - Updated supplier data
 * @returns {Promise<Object>}
 */
export const updateSupplier = async (supplierId, supplierData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/suppliers/${supplierId}`, supplierData);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to update supplier'
    };
  } catch (error) {
    console.error('Error updating supplier:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error updating supplier'
    };
  }
};

/**
 * Delete supplier
 * @param {string} supplierId - Supplier ID
 * @returns {Promise<Object>}
 */
export const deleteSupplier = async (supplierId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/suppliers/${supplierId}`);

    if (response.data.success) {
      return {
        success: true
      };
    }
    return {
      success: false,
      message: 'Failed to delete supplier'
    };
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error deleting supplier'
    };
  }
};
