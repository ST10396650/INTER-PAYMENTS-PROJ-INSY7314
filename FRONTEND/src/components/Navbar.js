import React from 'react';
import { useAuth } from '../contexts/AuthContext'
import {Link, useNavigate} from 'react-router-dom'

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to={user.role === 'customer' ? '/customer/dashboard' : '/employee/dashboard'}>
          International Payments
        </Link>
      </div>

      <div className="nav-links">
        {user.role === 'customer' && (
          <>
            <Link to="/customer/dashboard">Dashboard</Link>
            <Link to="/make-payment">Make Payment</Link>
            <Link to="/transactions">Transaction History</Link>
          </>
        )}

        {user.role === 'employee' && (
          <>
            <Link to="/employee/dashboard">Dashboard</Link>
            <Link to="/transactions">Transaction History</Link>
          </>
        )}

        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;