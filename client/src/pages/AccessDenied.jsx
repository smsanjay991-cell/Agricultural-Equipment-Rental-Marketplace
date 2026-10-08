import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AccessDenied = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    const role = (user?.role || '').toLowerCase();
    if (role === 'admin') return '/admin-dashboard';
    if (role === 'owner') return '/owner-dashboard';
    return '/user-dashboard';
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-16">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 max-w-lg w-full text-center space-y-6 shadow-sm">
        
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto text-red-600">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider font-mono">
            403 - Forbidden
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Access Denied
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            You do not have authorization to view this area. Access is restricted based on your platform account role.
          </p>
        </div>

        {user && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 inline-block">
            Current account role: <strong className="text-slate-900 uppercase font-semibold">{user.role || 'User'}</strong>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(getDashboardPath())}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded-lg transition shadow-xs cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" /> Go to My Dashboard
          </button>
          
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition border border-slate-200 cursor-pointer"
          >
            <Home className="w-4 h-4" /> Return to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AccessDenied;
