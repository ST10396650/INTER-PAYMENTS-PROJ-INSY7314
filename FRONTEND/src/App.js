import React from 'react';


function App() {
  return (
    <Router>
      <AuthProvider>
        <PaymentProvider>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/customer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employee/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['employee']}>
                      <EmployeeDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/make-payment"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <MakePayment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute allowedRoles={['customer', 'employee']}>
                      <TransactionHistory />
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
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
            </main>
          </div>
        </PaymentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;