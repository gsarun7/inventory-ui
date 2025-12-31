import apiClient from './apiClient';
import axios from 'axios';
const API_BASE_URL = 'https://6042f570-5be5-4780-863a-e649b5dc0a87.mock.pstmn.io/api/v1';

export const getInvoicesByCustomer = async (customerId) => {
  try {
    const response = await  axios.get(`${API_BASE_URL}/sales-invoices/customer/${customerId}`);
   console.log('Raw API response:', response.data);
    
    // ✅ Check if response is an array or single object
    let invoices = [];
    
    if (Array.isArray(response.data)) {
      // If it's already an array
      invoices = response.data;
    } else if (response.data && typeof response.data === 'object') {
      // If it's a single object, wrap it in an array
      invoices = [response.data];
    }
    
    // Transform to simple format for autocomplete
    const transformedInvoices = invoices.map(invoice => ({
      id: invoice.id,
      invoiceNo: invoice.invoiceNo,
      invoiceDate: invoice.invoiceDate,
      // Keep reference to full data if needed
      customer: invoice.customer,
      warehouse: invoice.warehouse,
      totalAmount: invoice.totalAmount
    }));
    
    console.log('Transformed invoices:', transformedInvoices);
    return transformedInvoices;
    
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
};


export const getInvoiceDetails = async (invoiceId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sales-invoices/${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice details:', error);
    return null;
  }
};