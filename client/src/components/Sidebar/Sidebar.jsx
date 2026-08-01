import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Tractor, Calendar, PlusCircle, Users, Settings, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 space-y-6 shrink-0 min-h-[calc(100vh-4rem)]">
      
      {/* User Status Card */}
      <div className="glass-panel p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30">
          {user?.name ? user.name.charAt(0) : 'U'}
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-bold text-white truncate">{user?.name || 'Agri User'}</div>
          <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">{user?.role || 'Guest'}</div>
        </div>
      </div>

      {/* Dynamic Nav Items */}
      <div className="space-y-1 text-xs">
        <div className="px-3 py-1 font-semibold text-slate-500 uppercase tracking-wider">Navigation</div>
        
        <Link 
          to="/" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${isActive('/') ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'}`}
        >
          <Tractor className="w-4 h-4" /> Marketplace Home
        </Link>

        {user?.role === 'farmer' && (
          <Link 
            to="/farmer-dashboard" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${isActive('/farmer-dashboard') ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Calendar className="w-4 h-4" /> My Active Rentals
          </Link>
        )}

        {user?.role === 'owner' && (
          <>
            <Link 
              to="/owner-dashboard" 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${isActive('/owner-dashboard') ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Fleet Management
            </Link>
          </>
        )}

        {user?.role === 'admin' && (
          <Link 
            to="/admin-dashboard" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${isActive('/admin-dashboard') ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Users className="w-4 h-4" /> User & System Audit
          </Link>
        )}

        <Link 
          to="/profile" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${isActive('/profile') ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'}`}
        >
          <User className="w-4 h-4" /> Profile Settings
        </Link>
      </div>

    </aside>
  );
};

export default Sidebar;
