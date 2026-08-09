import { BrowserRouter, Routes, Route } from "react-router-dom";

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
        <Route path="/equipment/new" element={<MainLayout><EquipmentForm /></MainLayout>} />
        <Route path="/equipment/:id/edit" element={<MainLayout><EquipmentForm /></MainLayout>} />

        {/* Dashboard Routes */}
        <Route path="/farmer-dashboard" element={<DashboardLayout><FarmerDashboard /></DashboardLayout>} />
        <Route path="/farmer" element={<DashboardLayout><FarmerDashboard /></DashboardLayout>} />
        
        <Route path="/owner-dashboard" element={<DashboardLayout><OwnerDashboard /></DashboardLayout>} />
        <Route path="/owner" element={<DashboardLayout><OwnerDashboard /></DashboardLayout>} />
        
        <Route path="/admin-dashboard" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
        <Route path="/admin" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />

        <Route path="/booking" element={<MainLayout><Booking /></MainLayout>} />
        <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;

