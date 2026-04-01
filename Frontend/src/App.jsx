import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Placeholder pages for other routes
const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
    <div className="w-20 h-20 bg-brand/10 rounded-3xl flex items-center justify-center mb-6">
       <span className="text-3xl">🚀</span>
    </div>
    <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
    <p className="text-slate-500 max-w-md">This page is currently being integrated with the Spring Boot backend APIs. Check back soon!</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Admin Routes */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Placeholder title="Analytics" />} />
          <Route path="customers" element={<Placeholder title="Customer Management" />} />
          <Route path="orders" element={<Placeholder title="Order Management" />} />
          <Route path="products" element={<Placeholder title="Product Management" />} />
          <Route path="invoices" element={<Placeholder title="Invoice Management" />} />
          <Route path="coupons" element={<Placeholder title="Coupon Management" />} />
          <Route path="calendar" element={<Placeholder title="Calendar" />} />
          <Route path="cms" element={<Placeholder title="CMS Content" />} />
          <Route path="settings" element={<Placeholder title="Settings" />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
