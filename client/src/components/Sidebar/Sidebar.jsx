import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Tractor, Calendar, Users, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-4 space-y-6 shrink-0 min-h-[calc(100vh-4rem)]">

      {/* User Status Card */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-green-100 text-green-800 font-bold flex items-center justify-center border border-green-200">
          {user?.name ? user.name.charAt(0) : 'U'}
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Agri User'}</div>
          <div className="text-[10px] font-semibold text-green-700 uppercase tracking-wider">{user?.role || 'Guest'}</div>
        </div>
      </div>

      {/* Dynamic Nav Items */}
      <div className="space-y-1 text-xs">
        <div className="px-3 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">Navigation</div>

        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${isActive('/') ? 'bg-green-50 text-green-800 font-semibold border-l-4 border-green-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <Tractor className="w-4 h-4 text-green-700" /> Marketplace Home
        </Link>

        {(user?.role === 'user' || user?.role === 'farmer') && (
          <Link
            to="/user-dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${isActive('/user-dashboard') || isActive('/farmer-dashboard') ? 'bg-green-50 text-green-800 font-semibold border-l-4 border-green-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Calendar className="w-4 h-4 text-green-700" /> My Active Rentals
          </Link>
        )}

        {(user?.role === 'owner' || user?.role === 'admin') && (
          <>
            <Link
              to="/owner-dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${isActive('/owner-dashboard') ? 'bg-green-50 text-green-800 font-semibold border-l-4 border-green-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <LayoutDashboard className="w-4 h-4 text-green-700" /> Fleet Management
            </Link>
          </>
        )}

        {user?.role === 'admin' && (
          <Link
            to="/admin-dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${isActive('/admin-dashboard') ? 'bg-green-50 text-green-800 font-semibold border-l-4 border-green-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Users className="w-4 h-4 text-green-700" /> User & System Audit
          </Link>
        )}

        <Link
          to="/profile"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${isActive('/profile') ? 'bg-green-50 text-green-800 font-semibold border-l-4 border-green-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <User className="w-4 h-4 text-green-700" /> Profile Settings
        </Link>
      </div>

    </aside>
  );
};

export default Sidebar;
