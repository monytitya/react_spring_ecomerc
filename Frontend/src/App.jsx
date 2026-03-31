import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import ShopLayout from './layouts/ShopLayout';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import Ecommerce from './pages/Ecommerce';

// Shop Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<ShopLayout><Home /></ShopLayout>} />
        <Route path="/shop" element={<ShopLayout><Shop /></ShopLayout>} />
        <Route path="/product/:id" element={<ShopLayout><ProductDetail /></ShopLayout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
        <Route path="/admin/ecommerce" element={<DashboardLayout><Ecommerce /></DashboardLayout>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
