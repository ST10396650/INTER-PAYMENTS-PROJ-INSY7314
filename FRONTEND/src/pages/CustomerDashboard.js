import React, { useState, useEffect } from 'react';


const CustomerDashboard = () => {
  const { user } = useAuth();
  const { getTransactions, transactions } = usePayment();
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    pendingTransactions: 0,
    totalAmount: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const result = await getTransactions({ limit: 5 });
    if (result.success) {
      setRecentTransactions(result.data.slice(0, 5));

      const total = result.data.length;
      const pending = result.data.filter(t => t.status === 'pending').length;
      const totalAmount = result.data
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({
        totalTransactions: total,
        pendingTransactions: pending,
        totalAmount: totalAmount
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = {
      pending: 'status-pending',
      verified: 'status-verified',
      submitted_to_swift: 'status-submitted',
      completed: 'status-completed',
      failed: 'status-failed'
    }[status] || 'status-pending';

    return <span className={`status-badge ${statusClass}`}>{status.replace('_', ' ')}</span>;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <p>Account: {maskAccountNumber(user?.accountNumber)}</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p className="stat-number">{stats.totalTransactions}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number">{stats.pendingTransactions}</p>
        </div>
        <div className="stat-card">
          <h3>Total Sent</h3>
          <p className="stat-number">${stats.totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/make-payment" className="action-card primary">
          <h3>Make Payment</h3>
          <p>Create new international payment</p>
        </Link>
        <Link to="/transactions" className="action-card">
          <h3>View History</h3>
          <p>See all transactions</p>
        </Link>
        <Link to="/profile" className="action-card">
          <h3>Profile</h3>
          <p>Manage your account</p>
        </Link>
      </div>

      <div className="recent-transactions">
        <h2>Recent Transactions</h2>
        {recentTransactions.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          <div className="transactions-list">
            {recentTransactions.map(transaction => (
              <div key={transaction._id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-main">
                    <span className="amount">{transaction.currency} {transaction.amount}</span>
                    <span className="beneficiary">To: {transaction.beneficiary.name}</span>
                  </div>
                  <div className="transaction-meta">
                    {getStatusBadge(transaction.status)}
                    <span className="date">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Link to="/transactions" className="view-all-link">
          View All Transactions →
        </Link>
      </div>
    </div>
  );
};

export default CustomerDashboard;