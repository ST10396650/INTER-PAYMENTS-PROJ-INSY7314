import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/CustomerDashboard'
import MakePayment from './pages/MakePayment'
import TransactionHistory from './pages/TransactionHistory'
import Navbar from './components/Navbar'
import Footer from './components/Layout/Footer'
import { AuthProvider } from './contexts/AuthContext'
import { SecurityProvider } from './contexts/SecurityContext'
import { HelmetProvider } from 'react-helmet-async'

function App() {
  return (
    <AuthProvider>
      <SecurityProvider>
        <HelmetProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Navbar />
              <main className="flex-grow container mx-auto px-4 py-6">
                <Routes>
                  {/* ✅ Add /login route explicitly */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/make-payment" element={<MakePayment />} />
                  <Route path="/transactions" element={<TransactionHistory />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </HelmetProvider>
      </SecurityProvider>
    </AuthProvider>
  )
}

export default App
