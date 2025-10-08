import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MakePayment from './pages/MakePayment';
import TransactionHistory from './pages/TransactionHistory';
import './App.css';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <Router>
                    <div className="App">
                        <Header />
                        <main className="main-content">
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <Profile />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/make-payment"
                                    element={
                                        <ProtectedRoute>
                                            <MakePayment />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/transaction-history"
                                    element={
                                        <ProtectedRoute>
                                            <TransactionHistory />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="/" element={<Navigate to="/dashboard" />} />
                                <Route path="*" element={
                                    <div className="not-found">
                                        <h2>404 - Page Not Found</h2>
                                        <p>The page you're looking for doesn't exist.</p>
                                        <Navigate to="/dashboard" replace />
                                    </div>
                                } />
                            </Routes>
                        </main>
                    </div>
                </Router>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;