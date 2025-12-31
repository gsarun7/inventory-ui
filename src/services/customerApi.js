// services/customerApi.js
import axios from 'axios';

const API_BASE_URL = 'https://6042f570-5be5-4780-863a-e649b5dc0a87.mock.pstmn.io/api/v1';

/**
 * Search customers by name or phone
 * @param {string} searchTerm - Customer name or phone to search
 * @returns {Promise<Array>} - List of matching customers
 */
export const searchCustomers = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customers/search`, {
      params: { query: searchTerm }
    });

    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error searching customers:', error);
    return [];
  }
};

/**
 * Get all customers
 * @returns {Promise<Array>} - List of all customers
 */
// export const getAllCustomers = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/customers`);

//     if (response.data.success) {
//       return response.data.data;
//     }
//     return [];
//   } catch (error) {
//     console.error('Error fetching customers:', error);
//     return [];
//   }
// };


export const getAllCustomers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customers`);
    console.log('Raw API Response:', response.data);
    
    // Transform data to match expected format
    const transformedData = response.data.map(customer => ({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      address_line1: customer.address || '',     // Transform here
      address_line2: '',
      city: '',
      state: '',
      pincode: '',
      gst_number: customer.gstNo || ''           // Transform here
    }));
    
    console.log('Transformed data:', transformedData);
    return transformedData;
    
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

/**
 * Get customer by ID
 * @param {string} customerId - Customer ID
 * @returns {Promise<Object>} - Customer object
 */
export const getCustomerById = async (customerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customers/${customerId}`);

    if (response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
};

/**
 * Create new customer
 * @param {Object} customerData - Customer data
 * @returns {Promise<Object>} - Created customer object
 */
export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/customers`, customerData);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to create customer'
    };
  } catch (error) {
    console.error('Error creating customer:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error creating customer'
    };
  }
};


/**
 * Update customer
 * @param {string} customerId - Customer ID
 * @param {Object} customerData - Updated customer data
 * @returns {Promise<Object>}
 */
export const updateCustomer = async (customerId, customerData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/customers/${customerId}`, customerData);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    return {
      success: false,
      message: 'Failed to update customer'
    };
  } catch (error) {
    console.error('Error updating customer:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error updating customer'
    };
  }
};

/**
 * Delete customer
 * @param {string} customerId - Customer ID
 * @returns {Promise<Object>}
 */
export const deleteCustomer = async (customerId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/customers/${customerId}`);

    if (response.data.success) {
      return {
        success: true
      };
    }
    return {
      success: false,
      message: 'Failed to delete customer'
    };
  } catch (error) {
    console.error('Error deleting customer:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error deleting customer'
    };
  }
};
