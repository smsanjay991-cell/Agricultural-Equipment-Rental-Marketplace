import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { equipmentService } from '../../services/equipmentService';
import { bookingService } from '../../services/bookingService';
import { userService } from '../../services/userService';
import Loader from '../../components/Loader/Loader';
import { Shield, Users, Tractor, Calendar, CheckCircle2, Clock, XCircle, RefreshCw, AlertCircle, UserCheck, DollarSign, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

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

  if (loading) return <Loader message="Accessing platform administration & governance metrics..." />;

  // Role Access Restriction Guard
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 space-y-4">
          <Shield className="w-16 h-16 text-amber-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Administrator Access Restricted</h2>
          <p className="text-sm text-slate-400">
            System audit & platform governance console is reserved for Super Administrator personnel.
          </p>
          <div className="text-xs text-slate-500">
            Current session role: <strong className="text-amber-400 uppercase">{user?.role || 'Guest'}</strong>
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

  const farmersCount = usersList.filter(u => u.role === 'farmer').length;
  const ownersCount = usersList.filter(u => u.role === 'owner').length;
  const adminCount = usersList.filter(u => u.role === 'admin').length;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Super Administrator</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Platform Governance & Audit Console</h1>
        </div>

        <button 
          onClick={fetchAdminData}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition flex items-center gap-1 text-xs font-semibold cursor-pointer w-fit"
          title="Refresh Platform Audit Metrics"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Audit Data
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/50 rounded-2xl text-red-300 text-xs font-medium flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-400 shrink-0" /> {error}</span>
          <button onClick={fetchAdminData} className="underline text-emerald-400 font-bold">Retry</button>
        </div>
      )}

      {/* Metrics Row (Real Dynamic Counts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{usersList.length} Accounts</div>
          <div className="text-[11px] text-slate-400 pt-1">
            {farmersCount} Farmers • {ownersCount} Owners • {adminCount} Admins
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Platform Fleet Inventory</span>
            <Tractor className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{equipment.length} Units</div>
          <div className="text-[11px] text-slate-400 pt-1">
            Listed Across All Districts
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Platform Booking Requests</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-teal-400">{bookings.length} Total</div>
          <div className="text-[11px] text-slate-400 pt-1">
            {approvedCount} Approved • {pendingCount} Pending
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Approved Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 pt-1">
            Estimated Platform Volume
          </div>
        </div>

      </div>

      {/* Audit Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-xs font-bold">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition border-b-2 cursor-pointer ${activeTab === 'overview' ? 'text-emerald-400 border-emerald-400' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
        >
          Registered Accounts Audit ({usersList.length})
        </button>
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 transition border-b-2 cursor-pointer ${activeTab === 'bookings' ? 'text-emerald-400 border-emerald-400' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
        >
          All Rental Requests ({bookings.length})
        </button>
        <button 
          onClick={() => setActiveTab('equipment')}
          className={`pb-3 transition border-b-2 cursor-pointer ${activeTab === 'equipment' ? 'text-emerald-400 border-emerald-400' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
        >
          Machinery Fleet Inventory ({equipment.length})
        </button>
      </div>

      {/* Tab 1: Registered Users Audit Table */}
      {activeTab === 'overview' && (
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" /> Registered Platform Users Directory ({usersList.length})
          </h2>

          {usersList.length === 0 ? (
            <div className="text-xs text-slate-400 py-6 text-center">No user accounts found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 uppercase text-[10px] text-slate-400 tracking-wider">
                  <tr>
                    <th className="p-3">User ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Role Persona</th>
                    <th className="p-3">Location / District</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {usersList.map((usr) => (
                    <tr key={usr._id || usr.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-mono text-slate-500 text-[10px]">#{usr._id || usr.id}</td>
                      <td className="p-3 font-semibold text-white">{usr.name}</td>
                      <td className="p-3 text-slate-300">{usr.email}</td>
                      <td className="p-3 text-slate-400">{usr.phone || 'N/A'}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${usr.role === 'admin' ? 'bg-purple-950 text-purple-400 border border-purple-800' : usr.role === 'owner' ? 'bg-teal-950 text-teal-400 border border-teal-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{usr.location || 'Not Specified'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Platform Booking Requests Table */}
      {activeTab === 'bookings' && (
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" /> Platform Rental Bookings Audit ({bookings.length})
          </h2>

          {bookings.length === 0 ? (
            <div className="text-xs text-slate-400 py-6 text-center">No platform bookings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 uppercase text-[10px] text-slate-400 tracking-wider">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Equipment Name</th>
                    <th className="p-3">Farmer Renter</th>
                    <th className="p-3">Dates & Duration</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {bookings.map((b) => {
                    const bId = b._id || b.id;
                    const normStatus = getBookingStatus(b);
                    const eqName = b.equipment?.name || b.equipmentName || 'Equipment Listing';
                    const farmerName = b.farmer?.name || 'Farmer Renter';
                    const totalFee = b.totalPrice !== undefined ? b.totalPrice : (b.totalAmount !== undefined ? b.totalAmount : (b.total_amount || 0));

                    return (
                      <tr key={bId} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-mono text-slate-500 text-[10px]">#{bId}</td>
                        <td className="p-3 font-semibold text-white">{eqName}</td>
                        <td className="p-3 text-slate-300">{farmerName}</td>
                        <td className="p-3 text-slate-400">
                          {new Date(b.startDate || b.start_date).toLocaleDateString()} - {new Date(b.endDate || b.end_date).toLocaleDateString()} ({b.totalDays || b.total_days || 1} Days)
                        </td>
                        <td className="p-3 font-bold text-emerald-400">₹{Number(totalFee).toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${normStatus === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : normStatus === 'pending' ? 'bg-amber-950 text-amber-400 border border-amber-800' : normStatus === 'rejected' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
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
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Tractor className="w-5 h-5 text-emerald-400" /> Platform Machinery Inventory Audit ({equipment.length})
          </h2>

          {equipment.length === 0 ? (
            <div className="text-xs text-slate-400 py-6 text-center">No equipment listings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 uppercase text-[10px] text-slate-400 tracking-wider">
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
                <tbody className="divide-y divide-slate-800">
                  {equipment.map((item) => {
                    const eqId = item._id || item.id;
                    const dailyRent = item.daily_rent !== undefined ? item.daily_rent : (item.dailyRate !== undefined ? item.dailyRate : (item.daily_rate || 0));
                    const isDriverAvail = Boolean(item.isDriverAvailable || item.is_driver_available);

                    return (
                      <tr key={eqId} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-mono text-slate-500 text-[10px]">#{eqId}</td>
                        <td className="p-3 font-semibold text-white">{item.name}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-semibold">{item.category}</span></td>
                        <td className="p-3 text-slate-300">{item.location}</td>
                        <td className="p-3 font-bold text-emerald-400">₹{Number(dailyRent).toLocaleString()}/day</td>
                        <td className="p-3 text-slate-300">{item.owner?.name || 'Verified Lender'}</td>
                        <td className="p-3">
                          {isDriverAvail ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Available</span>
                          ) : (
                            <span className="text-slate-500">Machine Only</span>
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

