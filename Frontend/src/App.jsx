import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/* ─── Admin / Dashboard ─── */
import AdminLayout    from './components/AdminLayout';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Dashboard      from './pages/Dashboard';
import Customers      from './pages/Customers';
import Orders         from './pages/Orders';
import Products       from './pages/Products';
import Coupons        from './pages/Coupons';
import Invoices       from './pages/Invoices';
import Analytics      from './pages/Analytics';
import CMS            from './pages/CMS';
import Settings       from './pages/Settings';
import Catalog        from './pages/Catalog';
import Payments       from './pages/Payments';
import Checkout       from './pages/Checkout';

/* ─── Public Website ─── */
import WebsiteLayout  from './components/website/WebsiteLayout';
import Home           from './pages/website/Home';
import Shop           from './pages/website/Shop';
import ProductDetail  from './pages/website/ProductDetail';
import Cart           from './pages/website/Cart';
import Wishlist       from './pages/website/Wishlist';
import About          from './pages/website/About';
import Contact        from './pages/website/Contact';

/* Smart root redirect */
const RootRedirect = () => {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('customer_token');
  return <Navigate to={token ? '/dashboard' : '/home'} replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* ══════════════ Public Website ══════════════ */}
        <Route element={<WebsiteLayout />}>
          <Route path="/home"            element={<Home />} />
          <Route path="/shop"            element={<Shop />} />
          <Route path="/product/:id"     element={<ProductDetail />} />
          <Route path="/cart"            element={<Cart />} />
          <Route path="/wishlist"        element={<Wishlist />} />
          <Route path="/about"           element={<About />} />
          <Route path="/contact"         element={<Contact />} />
        </Route>

        {/* ══════════════ Auth pages ══════════════ */}
        <Route path="/login"                   element={<Login />} />
        <Route path="/register"                element={<Register />} />
        <Route path="/checkout/:invoiceNo"     element={<Checkout />} />

        {/* ══════════════ Protected Dashboard ══════════════ */}
        <Route path="/" element={<AdminLayout />}>
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
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
