import React, { useEffect, useState } from 'react';

export default function TransactionHistory() {
    // State to store transactions fetched from backend, loading status while fetching data and hold any error messages during fetch
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch transactions from backend when component mounts
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Call the API endpoint to fetch transactions
                const response = await fetch('/api/transactions'); // This will be replaced with our api directory
                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }
                const data = await response.json();
                // Update state with fetched transactions
                setTransactions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                // Stop loading indicator once fetch is complete
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []); // Empty dependency array ensures this runs once on mount

    // Function to return Tailwind CSS color class based on transaction status (Im not sure if it is necessary but I will remove it if its not)
    const statusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-yellow-600'; // Pending = yellow
            case 'verified': return 'text-green-600'; // Verified = green
            case 'submitted': return 'text-blue-600'; // Submitted = blue
            default: return ''; // Default = no color
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Transaction History</h2>

            {/* Show loading message while fetching transactions */}
            {loading && <p>Loading transactions...</p>}

            {/* Show error message if fetch fails */}
            {error && <p className="text-red-600">{error}</p>}

            {/* Show message if no transactions exist */}
            {!loading && !error && transactions.length === 0 && (
                <p>No transactions found.</p>
            )}

            {/* Render transaction table if transactions exist */}
            {!loading && !error && transactions.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Amount</th>
                                <th className="px-4 py-2">Currency</th>
                                <th className="px-4 py-2">Beneficiary Name</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Map through transactions and display each in a table row */}
                            {transactions.map((tx) => (
                                <tr key={tx._id} className="border-t">
                                    {/* Format date to local string */}
                                    <td className="px-4 py-2">{new Date(tx.createdAt).toLocaleString()}</td>
                                    {/* Display amount with 2 decimal places */}
                                    <td className="px-4 py-2">{tx.amount.toFixed(2)}</td>
                                    {/* Display currency */}
                                    <td className="px-4 py-2">{tx.currency}</td>
                                    {/* Display beneficiary name */}
                                    <td className="px-4 py-2">{tx.beneficiary_name}</td>
                                    {/* Display status with color based on status */}
                                    <td className={`px-4 py-2 font-semibold ${statusColor(tx.status)}`}>
                                        {/* Capitalize first letter of status */}
                                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}