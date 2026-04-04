import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  const isAdmin = !!localStorage.getItem('admin_token');
  const isCustomer = !!localStorage.getItem('customer_token');
  const isAuthenticated = isAdmin || isCustomer;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen bg-[#f8fafc] flex font-sans text-slate-700 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 ml-72 flex flex-col h-full min-w-0 relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth pb-12 transition-all duration-300">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
