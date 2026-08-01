import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Tractor, User, LogOut, Menu, X, Shield, ChevronDown, PlusCircle, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Tractor className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300 bg-clip-text text-transparent">
                AgriRent
              </span>
              <span className="block text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">Equipment Marketplace</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link 
              to="/" 
              className={`transition-colors ${isActive('/') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              Home
            </Link>
            <Link 
              to="/equipment" 
              className={`transition-colors ${isActive('/equipment') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              Browse Equipment
            </Link>

            {user?.role === 'farmer' && (
              <Link 
                to="/farmer-dashboard" 
                className={`transition-colors ${isActive('/farmer-dashboard') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}
              >
                My Rentals
              </Link>
            )}

            {user?.role === 'owner' && (
              <Link 
                to="/owner-dashboard" 
                className={`transition-colors ${isActive('/owner-dashboard') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}
              >
                Owner Dashboard
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link 
                to="/admin-dashboard" 
                className={`transition-colors ${isActive('/admin-dashboard') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}
              >
                Admin Console
              </Link>
            )}
          </div>

          {/* User & Role Controls */}
          <div className="hidden md:flex items-center gap-4">

            {/* Quick Role Switcher for Demo */}
            <div className="relative">
              <button 
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Role: <span className="text-emerald-400 uppercase">{user ? user.role : 'Guest'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3 py-1 text-slate-400 font-medium">Switch Role Demo:</div>
                  <button 
                    onClick={() => { switchDemoRole('farmer'); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200 flex items-center gap-2"
                  >
                    🌾 Farmer Persona
                  </button>
                  <button 
                    onClick={() => { switchDemoRole('owner'); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200 flex items-center gap-2"
                  >
                    🚜 Owner Persona
                  </button>
                  <button 
                    onClick={() => { switchDemoRole('admin'); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200 flex items-center gap-2"
                  >
                    🛡️ Admin Persona
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-sm font-medium px-3.5 py-1.5 rounded-lg transition"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>

                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="text-slate-300 hover:text-white text-sm font-medium px-3 py-1.5 transition"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md shadow-emerald-600/20 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-slate-800 rounded-lg">Home</Link>
          <Link to="/equipment" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-slate-800 rounded-lg">Equipment Catalog</Link>
          {user?.role === 'farmer' && <Link to="/farmer-dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-slate-800 rounded-lg">My Rentals</Link>}
          {user?.role === 'owner' && <Link to="/owner-dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-slate-800 rounded-lg">Owner Dashboard</Link>}
          {user?.role === 'admin' && <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-slate-800 rounded-lg">Admin Dashboard</Link>}
          
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            {user ? (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-red-400 px-3 py-2">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-emerald-400 px-3 py-2 font-medium">Sign In / Register</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
