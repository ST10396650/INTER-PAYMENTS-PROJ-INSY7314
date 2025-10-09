import api from './api';

// Create Payment
export const createPayment = async (paymentData) => {
  try {
    const response = await api.post('/customer/payment', {
      amount: paymentData.amount,
      currency: paymentData.currency,
      provider: paymentData.provider || 'SWIFT',
      beneficiary_account_number: paymentData.beneficiaryAccount,
      beneficiary_name: paymentData.beneficiaryName,
      swift_code: paymentData.swiftCode,
      bank_name: paymentData.bankName,
      bank_address: paymentData.bankAddress,
      bank_country: paymentData.bankCountry,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Payment creation failed' };
  }
};

// Get All Transactions
export const getTransactions = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.page) params.append('page', filters.page);
    
    const response = await api.get(`/customer/transactions?${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch transactions' };
  }
};

// Get Single Transaction
export const getTransactionById = async (transactionId) => {
  try {
    const response = await api.get(`/customer/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch transaction' };
  }
};

// Get Transaction Statistics
export const getTransactionStats = async () => {
  try {
    const response = await api.get('/customer/transactions/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch statistics' };
  }
};