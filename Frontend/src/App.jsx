import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Coupons from './pages/Coupons';
import Invoices from './pages/Invoices';
import Analytics from './pages/Analytics';
import CMS from './pages/CMS';
import Settings from './pages/Settings';
import Catalog from './pages/Catalog';
import Payments from './pages/Payments';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout/:invoiceNo" element={<Checkout />} />

        {/* Protected Admin Routes */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"  element={<Dashboard />} />
          <Route path="analytics"  element={<Analytics />} />
          <Route path="customers"  element={<Customers />} />
          <Route path="orders"     element={<Orders />} />
          <Route path="products"   element={<Products />} />
          <Route path="invoices"   element={<Invoices />} />
          <Route path="payments"   element={<Payments />} />
          <Route path="coupons"    element={<Coupons />} />
          <Route path="catalog"    element={<Catalog />} />
          <Route path="cms"        element={<CMS />} />
          <Route path="settings"   element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
