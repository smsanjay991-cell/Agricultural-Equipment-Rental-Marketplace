import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';

import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Farmer from '../pages/Farmer/Farmer';
import Owner from '../pages/Owner/Owner';
import Admin from '../pages/Admin/Admin';
import Equipment from '../pages/Equipment/Equipment';
import Booking from '../pages/Booking/Booking';
import Profile from '../pages/Profile/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages wrapped in MainLayout */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
      <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
      <Route path="/equipment" element={<MainLayout><Equipment /></MainLayout>} />
      <Route path="/booking" element={<MainLayout><Booking /></MainLayout>} />

      {/* Role Dashboard & Management Pages wrapped in DashboardLayout */}
      <Route path="/farmer-dashboard" element={<DashboardLayout><Farmer /></DashboardLayout>} />
      <Route path="/owner-dashboard" element={<DashboardLayout><Owner /></DashboardLayout>} />
      <Route path="/admin-dashboard" element={<DashboardLayout><Admin /></DashboardLayout>} />
      <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
