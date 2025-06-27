
import React, { useEffect, useState } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminProductManagement from '@/components/admin/AdminProductManagement';
import AdminOrderManagement from '@/components/admin/AdminOrderManagement';
import AdminCouponManagement from '@/components/admin/AdminCouponManagement';

const Admin: React.FC = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for admin session
    const adminSession = localStorage.getItem('galaxy_store_admin_session');
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession);
        if (session.isAdmin) {
          setIsAdminAuthenticated(true);
        }
      } catch (error) {
        console.error('Invalid admin session:', error);
        localStorage.removeItem('galaxy_store_admin_session');
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-black flex items-center justify-center">
        <div className="text-white">Loading admin panel...</div>
      </div>
    );
  }

  // Redirect if not authenticated as admin
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-theme-black">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/products" element={<AdminProductManagement />} />
            <Route path="/orders" element={<AdminOrderManagement />} />
            <Route path="/coupons" element={<AdminCouponManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
