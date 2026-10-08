import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { equipmentService } from '../../services/equipmentService';
import { bookingService } from '../../services/bookingService';
import { userService } from '../../services/userService';
import Loader from '../../components/Loader/Loader';
import CategoryManagement from '../../components/Admin/CategoryManagement';
import { 
  Shield, Users, Tractor, Calendar, CheckCircle2, 
  RefreshCw, AlertCircle, UserCheck, DollarSign, 
  Edit, Trash2, Search, Filter, Loader2, X 
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // User Management State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '', location: '', role: 'user' });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete User Modal State
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const [eqData, bookingsData, usersData] = await Promise.all([
        equipmentService.getAll({}),
        bookingService.getAllBookings(),
        userService.getUsers()
      ]);

      setEquipment(Array.isArray(eqData) ? eqData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setUsersList(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setError(err.message || 'Failed to access platform administration metrics.');
    } finally {
      setLoading(false);
    }
  };

  const getBookingStatus = (b) => {
    if (!b) return '';
    const raw = b.bookingStatus || b.booking_status || b.status || '';
    return typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  };

  // User Management Modal Handlers
  const handleOpenEditModal = (usr) => {
    setEditingUser(usr);
    setEditFormData({
      name: usr.name || '',
      email: usr.email || '',
      phone: usr.phone || '',
      location: usr.location || '',
      role: (usr.role === 'farmer' ? 'user' : (usr.role || 'user'))
    });
    setEditError('');
  };

  const handleCloseEditModal = () => {
    if (editSubmitting) return;
    setEditingUser(null);
    setEditError('');
  };

  const handleSubmitEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setEditSubmitting(true);
    setEditError('');
    try {
      const userId = editingUser._id || editingUser.id;
      const updated = await userService.updateUser(userId, editFormData);
      
      setUsersList(prev => prev.map(u => {
        const uId = u._id || u.id;
        return String(uId) === String(userId) ? { ...u, ...updated } : u;
      }));

      setEditingUser(null);
    } catch (err) {
      console.error('Failed to update user:', err);
      setEditError(err.message || 'Failed to update user profile & role');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleOpenDeleteModal = (usr) => {
    setDeletingUser(usr);
    setDeleteError('');
  };

  const handleCloseDeleteModal = () => {
    if (deleteSubmitting) return;
    setDeletingUser(null);
    setDeleteError('');
  };

  const handleConfirmDeleteUser = async () => {
    if (!deletingUser) return;
    const targetId = deletingUser._id || deletingUser.id;
    const currentAdminId = user?._id || user?.id;

    if (String(targetId) === String(currentAdminId)) {
      setDeleteError('Self-deletion disabled: You cannot delete your currently logged-in account.');
      return;
    }

    setDeleteSubmitting(true);
    setDeleteError('');
    try {
      await userService.deleteUser(targetId);
      setUsersList(prev => prev.filter(u => String(u._id || u.id) !== String(targetId)));
      setDeletingUser(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setDeleteError(err.message || 'Failed to delete user account');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  if (loading) return <Loader message="Accessing platform administration & governance metrics..." />;

  // Role Access Restriction Guard
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center space-y-4">
          <Shield className="w-16 h-16 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Administrator Access Restricted</h2>
          <p className="text-sm text-slate-600">
            System audit & platform governance console is reserved for Super Administrator personnel.
          </p>
          <div className="text-xs text-slate-500">
            Current session role: <strong className="text-amber-700 uppercase font-bold">{user?.role || 'Guest'}</strong>
          </div>
        </div>
      </div>
    );
  }

  // Calculated Real Statistics
  const pendingCount = bookings.filter(b => getBookingStatus(b) === 'pending').length;
  const approvedCount = bookings.filter(b => getBookingStatus(b) === 'approved').length;
  const completedCount = bookings.filter(b => getBookingStatus(b) === 'completed').length;
  const totalRevenue = bookings
    .filter(b => {
      const s = getBookingStatus(b);
      return s === 'approved' || s === 'completed';
    })
    .reduce((sum, b) => sum + Number(b.totalPrice || b.totalAmount || b.total_amount || b.total_price || 0), 0);

  const usersCount = usersList.filter(u => u.role === 'user' || u.role === 'farmer').length;
  const ownersCount = usersList.filter(u => u.role === 'owner').length;
  const adminCount = usersList.filter(u => u.role === 'admin').length;

  // Filtered Users List
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = 
      (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.location || '').toLowerCase().includes(userSearch.toLowerCase());

    const matchesRole = userRoleFilter === 'all' || 
      u.role === userRoleFilter || 
      (userRoleFilter === 'user' && u.role === 'farmer');

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-bold text-green-700 uppercase tracking-wider">Super Administrator</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Platform Governance & Audit Console</h1>
        </div>

        <button 
          onClick={fetchAdminData}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer w-fit"
          title="Refresh Platform Audit Metrics"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Audit Data
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-600 shrink-0" /> {error}</span>
          <button onClick={fetchAdminData} className="underline text-green-700 font-semibold cursor-pointer">Retry</button>
        </div>
      )}

      {/* Metrics Row (Real Dynamic Counts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-green-700" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{usersList.length} Accounts</div>
          <div className="text-[11px] text-slate-500 pt-1">
            {usersCount} Users • {ownersCount} Owners • {adminCount} Admins
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Platform Fleet Inventory</span>
            <Tractor className="w-4 h-4 text-green-700" />
          </div>
          <div className="text-2xl font-extrabold text-green-700">{equipment.length} Units</div>
          <div className="text-[11px] text-slate-500 pt-1">
            Listed Across All Districts
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Platform Booking Requests</span>
            <Calendar className="w-4 h-4 text-green-700" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{bookings.length} Total</div>
          <div className="text-[11px] text-slate-500 pt-1">
            {approvedCount} Approved • {pendingCount} Pending • {completedCount} Completed
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Approved Volume</span>
            <DollarSign className="w-4 h-4 text-green-700" />
          </div>
          <div className="text-2xl font-extrabold text-green-700">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 pt-1">
            Estimated Platform Volume
          </div>
        </div>

      </div>

      {/* Audit Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition border-b-2 cursor-pointer ${activeTab === 'overview' ? 'text-green-700 border-green-700 font-bold' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
        >
          Registered Accounts Audit ({usersList.length})
        </button>
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 transition border-b-2 cursor-pointer ${activeTab === 'bookings' ? 'text-green-700 border-green-700 font-bold' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
        >
          All Rental Requests ({bookings.length})
        </button>
        <button 
          onClick={() => setActiveTab('equipment')}
          className={`pb-3 transition border-b-2 cursor-pointer ${activeTab === 'equipment' ? 'text-green-700 border-green-700 font-bold' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
        >
          Machinery Fleet Inventory ({equipment.length})
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`pb-3 transition border-b-2 cursor-pointer ${activeTab === 'categories' ? 'text-green-700 border-green-700 font-bold' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
        >
          Category Governance
        </button>
      </div>

      {/* Tab: Category Governance */}
      {activeTab === 'categories' && <CategoryManagement />}

      {/* Tab 1: Registered Users Audit & Governance Table */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-700" /> Registered User Accounts ({filteredUsers.length})
            </h2>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-green-600 transition w-48 sm:w-64"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700">
                <Filter className="w-3.5 h-3.5 text-green-700" />
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="bg-transparent text-slate-900 text-xs focus:outline-none cursor-pointer font-semibold"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="owner">Owners</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-xs text-slate-500 py-8 text-center space-y-1">
              <p className="font-semibold text-slate-700">No matching user accounts found.</p>
              <p className="text-[11px] text-slate-400">Try adjusting your search query or role filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 font-semibold tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="p-3">User ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Role Persona</th>
                    <th className="p-3">Location / District</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((usr) => {
                    const usrId = usr._id || usr.id;
                    const isSelf = String(usrId) === String(user?._id || user?.id);

                    return (
                      <tr key={usrId} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono text-slate-400 text-[10px]">#{usrId}</td>
                        <td className="p-3 font-semibold text-slate-900 flex items-center gap-1.5">
                          {usr.name}
                          {isSelf && (
                            <span className="text-[9px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-1.5 py-0.2 rounded">
                              YOU
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-600 font-mono text-[11px]">{usr.email}</td>
                        <td className="p-3 text-slate-500">{usr.phone || 'N/A'}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${usr.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : usr.role === 'owner' ? 'bg-teal-100 text-teal-800 border border-teal-200' : 'bg-green-100 text-green-800 border border-green-200'}`}>
                            {usr.role}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{usr.location || 'Not Specified'}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(usr)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-green-700 rounded-lg border border-slate-200 transition cursor-pointer"
                              title="Edit User Profile & Role"
                            >
                              <Edit className="w-3.5 h-3.5 text-green-700" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(usr)}
                              disabled={isSelf}
                              className={`p-1.5 rounded-lg border transition ${isSelf ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed' : 'bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border-slate-200 hover:border-red-200 cursor-pointer'}`}
                              title={isSelf ? 'Self-deletion disabled' : 'Delete User Account'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-lg w-full space-y-5 shadow-xl relative">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-green-700 tracking-wider">User Account Management</div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Edit className="w-4 h-4 text-green-700" />
                  Edit User Profile & Role (#{editingUser._id || editingUser.id})
                </h3>
              </div>
              <button 
                onClick={handleCloseEditModal}
                disabled={editSubmitting}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitEditUser} className="space-y-4">
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-green-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-green-600 transition font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-green-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Location / District</label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-green-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Role Persona</label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-green-600 transition font-semibold cursor-pointer"
                >
                  <option value="user">🌾 User (Rental Consumer)</option>
                  <option value="owner">🚜 Equipment Owner (Lender)</option>
                  <option value="admin">🛡️ Administrator (Governance)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={editSubmitting}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {editSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving Changes...
                    </>
                  ) : (
                    'Save User Profile'
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-xl border border-red-200 max-w-md w-full space-y-4 shadow-xl relative">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Confirm User Account Deletion
              </h3>
              <button 
                onClick={handleCloseDeleteModal}
                disabled={deleteSubmitting}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {deleteError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Are you sure you want to permanently delete user account <strong className="text-slate-900">{deletingUser.name}</strong> (<span className="font-mono text-slate-500">#{deletingUser._id || deletingUser.id}</span>)?
              </p>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div>Email: <strong className="text-slate-900">{deletingUser.email}</strong></div>
                <div>Role: <strong className="text-green-700 uppercase font-bold">{deletingUser.role}</strong></div>
                <div>Location: <strong className="text-slate-900">{deletingUser.location || 'N/A'}</strong></div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                ⚠️ Warning: Deleting a user account will cascade remove their associated listings, rental requests, reviews, and notifications from the platform database.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={deleteSubmitting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                disabled={deleteSubmitting || String(deletingUser._id || deletingUser.id) === String(user?._id || user?.id)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting Account...
                  </>
                ) : (
                  'Confirm & Delete User'
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Platform Booking Requests Table */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-700" /> Platform Rental Bookings Audit ({bookings.length})
          </h2>

          {bookings.length === 0 ? (
            <div className="text-xs text-slate-500 py-6 text-center">No platform bookings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 font-semibold tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Equipment Name</th>
                    <th className="p-3">Farmer Renter</th>
                    <th className="p-3">Dates & Duration</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => {
                    const bId = b._id || b.id;
                    const normStatus = getBookingStatus(b);
                    const eqName = b.equipment?.name || b.equipmentName || 'Equipment Listing';
                    const farmerName = b.farmer?.name || 'Farmer Renter';
                    const totalFee = b.totalPrice !== undefined ? b.totalPrice : (b.totalAmount !== undefined ? b.totalAmount : (b.total_amount || 0));

                    return (
                      <tr key={bId} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono text-slate-400 text-[10px]">#{bId}</td>
                        <td className="p-3 font-semibold text-slate-900">{eqName}</td>
                        <td className="p-3 text-slate-600">{farmerName}</td>
                        <td className="p-3 text-slate-500">
                          {new Date(b.startDate || b.start_date).toLocaleDateString()} - {new Date(b.endDate || b.end_date).toLocaleDateString()} ({b.totalDays || b.total_days || 1} Days)
                        </td>
                        <td className="p-3 font-bold text-green-700">₹{Number(totalFee).toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${normStatus === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' : normStatus === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' : normStatus === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                            {normStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Equipment Inventory Audit Table */}
      {activeTab === 'equipment' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Tractor className="w-5 h-5 text-green-700" /> Platform Machinery Inventory Audit ({equipment.length})
          </h2>

          {equipment.length === 0 ? (
            <div className="text-xs text-slate-500 py-6 text-center">No equipment listings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 font-semibold tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="p-3">Eq ID</th>
                    <th className="p-3">Equipment Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Daily Rate</th>
                    <th className="p-3">Owner</th>
                    <th className="p-3">Driver Option</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {equipment.map((item) => {
                    const eqId = item._id || item.id;
                    const dailyRent = item.daily_rent !== undefined ? item.daily_rent : (item.dailyRate !== undefined ? item.dailyRate : (item.daily_rate || 0));
                    const isDriverAvail = Boolean(item.isDriverAvailable || item.is_driver_available);

                    return (
                      <tr key={eqId} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono text-slate-400 text-[10px]">#{eqId}</td>
                        <td className="p-3 font-semibold text-slate-900">{item.name}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-green-800 font-semibold text-[11px]">{item.category}</span></td>
                        <td className="p-3 text-slate-600">{item.location}</td>
                        <td className="p-3 font-bold text-green-700">₹{Number(dailyRent).toLocaleString()}/day</td>
                        <td className="p-3 text-slate-600">{item.owner?.name || 'Verified Lender'}</td>
                        <td className="p-3">
                          {isDriverAvail ? (
                            <span className="text-green-700 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Available</span>
                          ) : (
                            <span className="text-slate-400">Machine Only</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
