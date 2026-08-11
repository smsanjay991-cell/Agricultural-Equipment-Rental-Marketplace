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
import NotFound from "../pages/NotFound";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
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
        <Route path="/equipment/new" element={<ProtectedRoute><MainLayout><EquipmentForm /></MainLayout></ProtectedRoute>} />
        <Route path="/equipment/:id/edit" element={<ProtectedRoute><MainLayout><EquipmentForm /></MainLayout></ProtectedRoute>} />

        {/* Dashboard Routes */}
        <Route path="/farmer-dashboard" element={<ProtectedRoute><DashboardLayout><FarmerDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/farmer" element={<ProtectedRoute><DashboardLayout><FarmerDashboard /></DashboardLayout></ProtectedRoute>} />
        
        <Route path="/owner-dashboard" element={<ProtectedRoute><DashboardLayout><OwnerDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/owner" element={<ProtectedRoute><DashboardLayout><OwnerDashboard /></DashboardLayout></ProtectedRoute>} />
        
        <Route path="/admin-dashboard" element={<ProtectedRoute><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />

        <Route path="/booking" element={<MainLayout><Booking /></MainLayout>} />
        <Route path="/bookings" element={<ProtectedRoute><DashboardLayout><FarmerDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/bookings/my" element={<ProtectedRoute><DashboardLayout><FarmerDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;

