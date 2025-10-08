import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paymentService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [stats, setStats] = useState({
        totalTransactions: 0,
        pendingTransactions: 0,
        totalAmount: 0
    });
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await paymentService.getAll();
            const transactions = response.data;

            setRecentTransactions(transactions.slice(0, 5));

            setStats({
                totalTransactions: transactions.length,
                pendingTransactions: transactions.filter(t => t.status === 'pending').length,
                totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0)
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Welcome back, {user?.full_name}!</h1>
                <p>Here's your payment activity summary</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Transactions</h3>
                    <div className="stat-value">{stats.totalTransactions}</div>
                </div>

                <div className="stat-card">
                    <h3>Pending</h3>
                    <div className="stat-value">{stats.pendingTransactions}</div>
                </div>

                <div className="stat-card">
                    <h3>Total Amount</h3>
                    <div className="stat-value">
                        {formatCurrency(stats.totalAmount, 'USD')}
                    </div>
                </div>
            </div>

            <div className="dashboard-actions">
                <Link to="/make-payment" className="action-card">
                    <div className="action-icon">??</div>
                    <h3>Make Payment</h3>
                    <p>Create new international payment</p>
                </Link>

                <Link to="/transaction-history" className="action-card">
                    <div className="action-icon">??</div>
                    <h3>View History</h3>
                    <p>Check all transactions</p>
                </Link>

                <Link to="/profile" className="action-card">
                    <div className="action-icon">??</div>
                    <h3>Profile</h3>
                    <p>Manage your account</p>
                </Link>
            </div>

            {recentTransactions.length > 0 && (
                <div className="recent-transactions">
                    <h2>Recent Transactions</h2>
                    <div className="transactions-list">
                        {recentTransactions.map(transaction => (
                            <div key={transaction._id} className="transaction-item">
                                <div className="transaction-main">
                                    <span className="beneficiary">{transaction.beneficiary_name}</span>
                                    <span className="amount">
                                        {formatCurrency(transaction.amount, transaction.currency)}
                                    </span>
                                </div>
                                <div className="transaction-details">
                                    <span className={`status ${transaction.status}`}>
                                        {transaction.status}
                                    </span>
                                    <span className="date">
                                        {new Date(transaction.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;