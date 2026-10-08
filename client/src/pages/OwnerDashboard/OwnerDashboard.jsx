import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { equipmentService } from '../../services/equipmentService';
import { bookingService } from '../../services/bookingService';
import { getImageUrl } from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { PlusCircle, Tractor, CheckCircle, XCircle, Clock, MapPin, Trash2, Edit3, Eye, RefreshCw, AlertCircle } from 'lucide-react';

const OwnerDashboard = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    setActionError('');
    try {
      const eq = await equipmentService.getMyEquipment();
      const b = await bookingService.getOwnerBookings();
      setEquipmentList(Array.isArray(eq) ? eq : []);
      setBookings(Array.isArray(b) ? b : []);
    } catch (err) {
      console.error('Error loading owner dashboard data:', err);
      setError(err.message || 'Failed to load fleet listings and booking requests.');
    } finally {
      setLoading(false);
    }
  };

  // Robust Status Extraction Utility
  const getBookingStatus = (b) => {
    if (!b) return '';
    const raw = b.bookingStatus || b.booking_status || b.status || '';
    return typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  };

  const handleApproveBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to approve this booking request?')) return;
    setActionError('');
    setActionSuccess('');

    // Optimistic state update for instant UI feedback
    setBookings(prev => prev.map(b => {
      const bId = b._id || b.id;
      if (String(bId) === String(bookingId)) {
        return { ...b, bookingStatus: 'approved', booking_status: 'approved', status: 'Approved' };
      }
      return b;
    }));

    try {
      await bookingService.approve(bookingId);
      setActionSuccess('Booking request approved successfully!');
      loadData();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      console.error('Error approving booking:', err);
      setActionError(err.message || 'Failed to approve booking request.');
      loadData(); // Revert back on error
    }
  };

  const handleRejectBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to decline this booking request?')) return;
    setActionError('');
    setActionSuccess('');

    // Optimistic state update
    setBookings(prev => prev.map(b => {
      const bId = b._id || b.id;
      if (String(bId) === String(bookingId)) {
        return { ...b, bookingStatus: 'rejected', booking_status: 'rejected', status: 'Rejected' };
      }
      return b;
    }));

    try {
      await bookingService.reject(bookingId);
      setActionSuccess('Booking request declined.');
      loadData();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      console.error('Error rejecting booking:', err);
      setActionError(err.message || 'Failed to decline booking request.');
      loadData(); // Revert back on error
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment listing?')) return;
    setActionError('');
    try {
      await equipmentService.delete(id);
      setActionSuccess('Equipment listing removed.');
      loadData();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setActionError(err.message || 'Failed to delete equipment');
    }
  };

  if (loading) return <Loader message="Loading your machinery fleet & rental requests..." />;

  const totalRevenue = bookings
    .filter(b => {
      const s = getBookingStatus(b);
      return s === 'approved' || s === 'completed';
    })
    .reduce((sum, b) => sum + Number(b.totalPrice || b.totalAmount || b.total_amount || b.total_price || 0), 0);

  const pendingRequests = bookings.filter(b => getBookingStatus(b) === 'pending');

  return (
    <div className="space-y-6">
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-bold text-green-700 uppercase tracking-wider">Fleet Owner Portal</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Machinery & Bookings Manager</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
            title="Refresh Fleet Data"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          
          <Link 
            to="/equipment/new"
            className="bg-green-700 hover:bg-green-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer w-fit"
          >
            <PlusCircle className="w-4 h-4" /> Add New Equipment
          </Link>
        </div>
      </div>

      {/* Revenue & Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Approved Revenue</div>
          <div className="text-2xl font-extrabold text-green-700">₹{totalRevenue.toLocaleString()}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Listed Machines</div>
          <div className="text-2xl font-extrabold text-slate-900">{equipmentList.length} Units</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Pending Requests</div>
          <div className="text-2xl font-extrabold text-amber-600">
            {pendingRequests.length} Requests
          </div>
        </div>
      </div>

      {/* Action Alerts */}
      {actionSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-4 h-4 text-green-700 shrink-0" /> {actionSuccess}
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" /> {actionError}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-600 shrink-0" /> {error}</span>
          <button onClick={loadData} className="underline text-green-700 font-semibold cursor-pointer">Retry</button>
        </div>
      )}

      {/* Incoming Rental Requests */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-green-700" /> Incoming Rental Requests ({bookings.length})
        </h2>

        {bookings.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-500 shadow-xs">
            No rental requests received yet for your listed equipment.
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const bookingId = booking._id || booking.id;
              const normStatus = getBookingStatus(booking);
              const isPending = normStatus === 'pending';

              const eqName = booking.equipment?.name || booking.equipmentName || 'Equipment Listing';
              const farmerName = booking.farmer?.name || 'Farmer Renter';
              const farmerPhone = booking.farmer?.phone || 'Contact Private';
              const totalFee = booking.totalPrice !== undefined ? booking.totalPrice : (booking.totalAmount !== undefined ? booking.totalAmount : (booking.total_amount || 0));

              return (
                <div 
                  key={bookingId} 
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{eqName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">#{bookingId}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${normStatus === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' : normStatus === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' : normStatus === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                        {normStatus}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Renter: <strong className="text-slate-800">{farmerName}</strong> ({farmerPhone})
                    </p>
                    <p className="text-xs text-slate-500">
                      Dates: {new Date(booking.startDate || booking.start_date).toLocaleDateString()} - {new Date(booking.endDate || booking.end_date).toLocaleDateString()} ({booking.totalDays || booking.total_days || 1} Days)
                    </p>
                    {(booking.notes || booking.remarks) && (
                      <p className="text-[11px] text-slate-600 italic pt-0.5">"{booking.notes || booking.remarks}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-semibold text-slate-500">Total Price</div>
                      <div className="text-base font-bold text-green-700">₹{Number(totalFee).toLocaleString()}</div>
                    </div>

                    {isPending && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveBooking(bookingId)}
                          className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => handleRejectBooking(bookingId)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Owner Listed Equipment */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Tractor className="w-4 h-4 text-green-700" /> My Equipment Listings ({equipmentList.length})
          </span>
          <Link to="/equipment/new" className="text-xs text-green-700 hover:underline flex items-center gap-1 font-semibold">
            + Add New
          </Link>
        </h2>

        {equipmentList.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center space-y-3 border border-slate-200 shadow-xs">
            <Tractor className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Equipment Listed Yet</h3>
            <p className="text-xs text-slate-500">List your tractors or harvesters to start earning rental income.</p>
            <Link to="/equipment/new" className="inline-block bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm">
              Create First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentList.map((item) => {
              const itemId = item._id || item.id;
              const rawImg = item.image || (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '');
              const imgSrc = getImageUrl(rawImg);
              const dailyRent = item.daily_rent !== undefined ? item.daily_rent : (item.dailyRate !== undefined ? item.dailyRate : item.daily_rate);

              return (
                <div key={itemId} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs relative group flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition">
                  <div>
                    <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                      <img 
                        src={imgSrc} 
                        alt={item.name} 
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      
                      <div className="absolute top-3 left-3 bg-white/95 px-2 py-0.5 rounded-md text-[10px] font-bold text-green-800 border border-slate-200 shadow-xs">
                        {item.category || 'General'}
                      </div>

                      <button 
                        onClick={() => handleDeleteEquipment(itemId)}
                        className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-red-50 text-red-600 rounded-md border border-slate-200 transition cursor-pointer shadow-xs"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.location}
                        </span>
                        <span className="text-green-700 font-bold text-sm">₹{Number(dailyRent).toLocaleString()}/day</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
                    <Link 
                      to={`/equipment/${itemId}`} 
                      className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium py-2 rounded-lg text-center flex items-center justify-center gap-1 transition border border-slate-200"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Specs
                    </Link>
                    <Link 
                      to={`/equipment/${itemId}/edit`} 
                      className="flex-1 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold py-2 rounded-lg text-center flex items-center justify-center gap-1 transition shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default OwnerDashboard;



