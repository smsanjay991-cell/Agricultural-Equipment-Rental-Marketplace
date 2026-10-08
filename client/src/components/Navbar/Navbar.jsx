import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Tractor, User, LogOut, Menu, X, Bell, Check, CheckCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); 
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-green-700 flex items-center justify-center text-white shadow-xs group-hover:bg-green-800 transition">
              <Tractor className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                AgriRent
              </span>
              <span className="block text-[10px] uppercase font-bold text-green-700 tracking-wider">Equipment Marketplace</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors py-1 ${isActive('/') ? 'text-green-700 font-bold border-b-2 border-green-700' : 'text-slate-600 hover:text-green-700'}`}
            >
              Home
            </Link>
            <Link
              to="/equipment"
              className={`transition-colors py-1 ${isActive('/equipment') ? 'text-green-700 font-bold border-b-2 border-green-700' : 'text-slate-600 hover:text-green-700'}`}
            >
              Browse Equipment
            </Link>
            {(user?.role?.toLowerCase() === 'owner' || user?.role?.toLowerCase() === 'admin') && (
              <Link
                to="/owner-dashboard"
                className={`transition-colors py-1 ${isActive('/owner-dashboard') ? 'text-green-700 font-bold border-b-2 border-green-700' : 'text-slate-600 hover:text-green-700'}`}
              >
                Owner Dashboard
              </Link>
            )}

            {(user?.role?.toLowerCase() === 'user' || user?.role?.toLowerCase() === 'farmer') && (
              <Link
                to="/user-dashboard"
                className={`transition-colors py-1 ${isActive('/user-dashboard') || isActive('/farmer-dashboard') ? 'text-green-700 font-bold border-b-2 border-green-700' : 'text-slate-600 hover:text-green-700'}`}
              >
                My Rentals
              </Link>
            )}

            {user?.role?.toLowerCase() === 'admin' && (
              <Link
                to="/admin-dashboard"
                className={`transition-colors py-1 ${isActive('/admin-dashboard') ? 'text-green-700 font-bold border-b-2 border-green-700' : 'text-slate-600 hover:text-green-700'}`}
              >
                Admin Console
              </Link>
            )}
          </div>

          {/* User Controls */}
          <div className="hidden md:flex items-center gap-4">

            {user ? (
              <div className="flex items-center gap-3" ref={notifRef}>

                {/* Notification Bell Button & Popover */}
                <div className="relative">
                  <button
                    id="notification-bell-btn"
                    onClick={handleToggleNotif}
                    className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition cursor-pointer"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4 text-slate-700" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-xs">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown Popover */}
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-200 shadow-xl z-50 overflow-hidden text-xs">

                      {/* Header */}
                      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-green-700" />
                          <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
                          {unreadCount > 0 && (
                            <span className="bg-green-100 text-green-800 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>

                        {notifications.some(n => !(n.isRead || n.is_read)) && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-[11px] text-green-700 hover:text-green-800 font-semibold flex items-center gap-1 transition cursor-pointer"
                          >
                            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                          </button>
                        )}
                      </div>

                      {/* Notification Body List */}
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {loadingNotifs ? (
                          <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin text-green-700" />
                            <span>Loading notifications...</span>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                            <Bell className="w-8 h-8 text-slate-400 stroke-[1.5]" />
                            <span className="font-semibold text-slate-700">No notifications yet</span>
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
                                  isItemRead ? 'bg-white hover:bg-slate-50 text-slate-600' : 'bg-green-50/70 hover:bg-green-50 text-slate-900 border-l-2 border-green-600'
                                }`}
                              >
                                <div className="mt-0.5 shrink-0">
                                  {!isItemRead ? (
                                    <span className="w-2 h-2 rounded-full bg-green-600 block"></span>
                                  ) : (
                                    <Check className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <h5 className={`font-semibold text-xs ${!isItemRead ? 'text-slate-900' : 'text-slate-600'}`}>
                                      {item.title}
                                    </h5>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {item.createdAt || item.created_at ? new Date(item.createdAt || item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 leading-relaxed">
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
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-sm font-medium px-3.5 py-1.5 rounded-lg transition"
                >
                  <User className="w-4 h-4 text-green-700" />
                  <span>{user.name ? user.name.split(' ')[0] : 'User'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-green-700 text-sm font-semibold px-3 py-1.5 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-xs transition"
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
                className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              >
                <Bell className="w-5 h-5 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-lg font-medium ${isActive('/') ? 'text-green-700 bg-green-50 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}>Home</Link>
          <Link to="/equipment" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-lg font-medium ${isActive('/equipment') ? 'text-green-700 bg-green-50 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}>Browse Equipment</Link>
          {(user?.role?.toLowerCase() === 'owner' || user?.role?.toLowerCase() === 'admin') && <Link to="/owner-dashboard" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-lg font-medium ${isActive('/owner-dashboard') ? 'text-green-700 bg-green-50 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}>Owner Dashboard</Link>}
          {(user?.role?.toLowerCase() === 'user' || user?.role?.toLowerCase() === 'farmer') && <Link to="/user-dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg font-medium">My Rentals</Link>}
          {user?.role?.toLowerCase() === 'admin' && <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg font-medium">Admin Dashboard</Link>}

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            {user ? (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-red-600 px-3 py-2 font-medium">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-green-700 px-3 py-2 font-semibold">Sign In / Register</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
