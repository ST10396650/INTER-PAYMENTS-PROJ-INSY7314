import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { paymentService } from '../services/api';

export default function TransactionHistory() {
    const { token } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            fetchTransactions();
        } else {
            setError('Please login to view transactions');
            setLoading(false);
        };
    },  [token]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Use the paymentService instead of fetch
            const response = await paymentService.getTransactions();
            
            console.log('📊 Transactions response:', response);
            
            // Handle the response data structure
           // Handle different response structures
            const transactionsData = response.data || response.transactions || response;
            setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
            
            
        } catch (err) {
            console.error('❌ Error fetching transactions:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    const statusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'text-yellow-600';
            case 'verified': return 'text-green-600';
            case 'completed': return 'text-green-600';
            case 'submitted': return 'text-blue-600';
            case 'failed': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const statusBgColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100';
            case 'verified': return 'bg-green-100';
            case 'completed': return 'bg-green-100';
            case 'submitted': return 'bg-blue-100';
            case 'failed': return 'bg-red-100';
            default: return 'bg-gray-100';
        }
    };

    return (
        <>
            <Helmet>
                <title>Transaction History - International Payments Portal</title>
            </Helmet>
            
            <div className="p-6 max-w-7xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Transaction History</h2>
                    <p className="text-gray-600 mt-2">View all your payment transactions</p>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="ml-4 text-gray-600">Loading transactions...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                        <p className="font-semibold">Error:</p>
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && transactions.length === 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                        <p className="text-gray-600 text-lg mb-4">No transactions found.</p>
                        <a 
                            href="/make-payment" 
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Make Your First Payment
                        </a>
                    </div>
                )}

                {!loading && !error && transactions.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Currency
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Beneficiary
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Provider
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactions.map((tx, index) => (
                                        <tr 
                                            key={tx._id || tx.id || tx.transaction_id || `tx-${index}`} 
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(tx.createdAt || tx.created_at || Date.now()).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                {parseFloat(tx.amount || 0).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {tx.currency || 'USD'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                <div className="max-w-xs truncate">
                                                    {tx.beneficiary_name || tx.beneficiaryName || 'Unknown'}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">
                                                    {tx.beneficiary_account_number || tx.beneficiaryAccountNumber || ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {tx.provider || 'SWIFT'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBgColor(tx.status)} ${statusColor(tx.status)}`}>
                                                    {tx.status ? tx.status.charAt(0).toUpperCase() + tx.status.slice(1) : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{transactions.length}</span> transaction(s)
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}