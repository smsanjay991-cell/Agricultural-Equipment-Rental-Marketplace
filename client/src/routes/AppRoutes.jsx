import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

import Equipment from "../pages/Equipment/Equipment";
import EquipmentDetails from "../pages/Equipment/EquipmentDetails";
import EquipmentForm from "../pages/Equipment/EquipmentForm";

import FarmerDashboard from "../pages/FarmerDashboard/FarmerDashboard";
import OwnerDashboard from "../pages/OwnerDashboard/OwnerDashboard";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";

import Booking from "../pages/Booking/Booking";
import Profile from "../pages/Profile/Profile";
import AccessDenied from "../pages/AccessDenied";
import NotFound from "../pages/NotFound";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const rawRole = (user.role || '').toLowerCase();
    const normalizedRole = rawRole === 'farmer' ? 'user' : rawRole;
    const isAllowed = allowedRoles.some((role) => {
      const target = role.toLowerCase();
      return target === normalizedRole || (target === 'user' && rawRole === 'farmer');
    });

    if (!isAllowed) {
      return <MainLayout><AccessDenied /></MainLayout>;
    }
  }

  return children;
}

function RoleDashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const role = (user.role || '').toLowerCase();
  if (role === 'admin') return <Navigate to="/admin-dashboard" replace />;
  if (role === 'owner') return <Navigate to="/owner-dashboard" replace />;
  return <Navigate to="/user-dashboard" replace />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public & Catalog Routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/equipment" element={<MainLayout><Equipment /></MainLayout>} />
        <Route path="/equipment/:id" element={<MainLayout><EquipmentDetails /></MainLayout>} />

        {/* Protected Owner/Admin Equipment CRUD Routes */}
        <Route
          path="/equipment/new"
          element={
            <ProtectedRoute allowedRoles={['owner', 'admin']}>
              <MainLayout><EquipmentForm /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipment/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['owner', 'admin']}>
              <MainLayout><EquipmentForm /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Central Dashboard Redirect */}
        <Route path="/dashboard" element={<RoleDashboardRedirect />} />

        {/* User / Farmer Rental Dashboard Routes */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={['user', 'farmer', 'admin']}>
              <DashboardLayout><FarmerDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={['user', 'farmer', 'admin']}>
              <DashboardLayout><FarmerDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer-dashboard"
          element={
            <ProtectedRoute allowedRoles={['user', 'farmer', 'admin']}>
              <DashboardLayout><FarmerDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer"
          element={
            <ProtectedRoute allowedRoles={['user', 'farmer', 'admin']}>
              <DashboardLayout><FarmerDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Equipment Owner Dashboard Routes */}
        <Route
          path="/owner-dashboard"
          element={
            <ProtectedRoute allowedRoles={['owner', 'admin']}>
              <DashboardLayout><OwnerDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRoles={['owner', 'admin']}>
              <DashboardLayout><OwnerDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Governance Dashboard Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Booking & User Actions */}
        <Route path="/booking" element={<MainLayout><Booking /></MainLayout>} />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute allowedRoles={['user', 'farmer', 'owner', 'admin']}>
              <DashboardLayout><FarmerDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/my"
          element={
            <ProtectedRoute allowedRoles={['user', 'farmer', 'owner', 'admin']}>
              <DashboardLayout><FarmerDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout><Profile /></DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* 403 Forbidden Access Page */}
        <Route path="/access-denied" element={<MainLayout><AccessDenied /></MainLayout>} />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
