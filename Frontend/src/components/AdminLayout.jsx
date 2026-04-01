import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  const isAuthenticated = !!localStorage.getItem('admin_token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-700">
      <Sidebar />
      <div className="flex-1 ml-72 flex flex-col min-w-0">
        <Header />
        <main className="p-8 pb-12 overflow-y-auto h-[calc(100vh-80px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
