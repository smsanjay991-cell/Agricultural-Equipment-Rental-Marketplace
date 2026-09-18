import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Tractor, User, LogOut, Menu, X, Shield, ChevronDown, Bell, Check, CheckCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';

const Navbar = () => {
  const { user, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate(); 
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const notifRef = useRef(null);

  // Fetch unread count for badge
  const loadUnreadCount = async () => {
    if (!user) return;
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    }
  };

  // Fetch full notification list
  const loadNotifications = async () => {
    if (!user) return;
    setLoadingNotifs(true);
    try {
      const res = await notificationService.getNotifications();
      const list = res.data || res.notifications || [];
      setNotifications(list);
      const unread = typeof res.unreadCount === 'number' ? res.unreadCount : list.filter(n => !(n.isRead || n.is_read)).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000); // 30s polling
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleNotif = () => {
    const nextState = !notifOpen;
    setNotifOpen(nextState);
    if (nextState) {
      loadNotifications();
    }
  };

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true, is_read: 1 } : n)));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

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
                className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition cursor-pointer"
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
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200 flex items-center gap-2 cursor-pointer"
                  >
                    🌾 Farmer Persona
                  </button>
                  <button
                    onClick={() => { switchDemoRole('owner'); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200 flex items-center gap-2 cursor-pointer"
                  >
                    🚜 Owner Persona
                  </button>
                  <button
                    onClick={() => { switchDemoRole('admin'); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200 flex items-center gap-2 cursor-pointer"
                  >
                    🛡️ Admin Persona
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3" ref={notifRef}>

                {/* Notification Bell Button & Popover */}
                <div className="relative">
                  <button
                    id="notification-bell-btn"
                    onClick={handleToggleNotif}
                    className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4 text-emerald-400" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-lg shadow-red-500/40 animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown Popover */}
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50 overflow-hidden text-xs">

                      {/* Header */}
                      <div className="p-3.5 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-emerald-400" />
                          <h4 className="font-bold text-slate-100 text-sm">Notifications</h4>
                          {unreadCount > 0 && (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>

                        {notifications.some(n => !(n.isRead || n.is_read)) && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition cursor-pointer"
                          >
                            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                          </button>
                        )}
                      </div>

                      {/* Notification Body List */}
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
                        {loadingNotifs ? (
                          <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                            <span>Loading notifications...</span>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                            <Bell className="w-8 h-8 text-slate-600 stroke-[1.5]" />
                            <span className="font-medium text-slate-300">No notifications yet</span>
                            <span className="text-[11px] text-slate-500">You're all caught up! Updates about bookings, payments, and reviews will appear here.</span>
                          </div>
                        ) : (
                          notifications.map((item) => {
                            const isItemRead = Boolean(item.isRead || item.is_read);
                            return (
                              <div
                                key={item.id}
                                onClick={() => handleMarkAsRead(item.id, isItemRead)}
                                className={`p-3.5 transition flex items-start gap-3 cursor-pointer ${
                                  isItemRead ? 'bg-slate-900/60 hover:bg-slate-800/40 text-slate-400' : 'bg-slate-800/60 hover:bg-slate-800/90 text-slate-100 border-l-2 border-emerald-400'
                                }`}
                              >
                                <div className="mt-0.5 shrink-0">
                                  {!isItemRead ? (
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 block shadow-sm shadow-emerald-400/80"></span>
                                  ) : (
                                    <Check className="w-3.5 h-3.5 text-slate-500" />
                                  )}
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <h5 className={`font-semibold text-xs ${!isItemRead ? 'text-white' : 'text-slate-300'}`}>
                                      {item.title}
                                    </h5>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      {item.createdAt || item.created_at ? new Date(item.createdAt || item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {item.message}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                    </div>
                  )}
                </div>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-sm font-medium px-3.5 py-1.5 rounded-lg transition"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>{user.name ? user.name.split(' ')[0] : 'User'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
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
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <button
                onClick={handleToggleNotif}
                className="relative p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition"
              >
                <Bell className="w-5 h-5 text-emerald-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-extrabold px-1 rounded-full min-w-[14px] text-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
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
