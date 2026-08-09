import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { getImageUrl } from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, MapPin, RefreshCw, ShoppingBag } from 'lucide-react';

const FarmerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    setLoading(true);
    setError('');
    setActionError('');
    try {
      const data = await bookingService.getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching my bookings:', err);
      setError(err.message || 'Failed to load your booking records.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this pending rental request?')) return;
    setActionError('');
    setActionSuccess('');

    try {
      await bookingService.cancel(id);
      setActionSuccess('Booking cancelled successfully.');
      fetchMyBookings();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      console.error('Cancellation error:', err);
      setActionError(err.message || 'Failed to cancel booking.');
    }
  };

  const getStatusBadge = (bStatus, status) => {
    const norm = (bStatus || status || 'pending').toLowerCase();
    switch (norm) {
      case 'approved':
        return <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold px-2.5 py-1 rounded-full"><CheckCircle className="w-3.5 h-3.5" /> Approved</span>;
      case 'pending':
        return <span className="flex items-center gap-1 text-amber-400 bg-amber-950/80 border border-amber-500/30 text-xs font-semibold px-2.5 py-1 rounded-full"><Clock className="w-3.5 h-3.5" /> Pending Approval</span>;
      case 'rejected':
      case 'declined':
        return <span className="flex items-center gap-1 text-red-400 bg-red-950/80 border border-red-500/30 text-xs font-semibold px-2.5 py-1 rounded-full"><XCircle className="w-3.5 h-3.5" /> Declined</span>;
      case 'completed':
        return <span className="flex items-center gap-1 text-teal-400 bg-teal-950/80 border border-teal-500/30 text-xs font-semibold px-2.5 py-1 rounded-full"><CheckCircle className="w-3.5 h-3.5" /> Completed</span>;
      case 'cancelled':
        return <span className="flex items-center gap-1 text-slate-400 bg-slate-800 border border-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
      default:
        return <span className="flex items-center gap-1 text-slate-400 bg-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full">{status || bStatus}</span>;
    }
  };

  if (loading) return <Loader message="Fetching your equipment rentals..." />;

  const activeCount = bookings.filter(b => {
    const s = (b.bookingStatus || b.status || '').toLowerCase();
    return s === 'approved';
  }).length;

  const pendingCount = bookings.filter(b => {
    const s = (b.bookingStatus || b.status || '').toLowerCase();
    return s === 'pending';
  }).length;

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Farmer Portal</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Machinery Rentals</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchMyBookings}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition flex items-center gap-1 text-xs font-semibold"
            title="Refresh Bookings"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          
          <Link
            to="/equipment"
            className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Browse Catalog
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Total Rental Requests</div>
          <div className="text-2xl font-extrabold text-white">{bookings.length}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Active & Approved</div>
          <div className="text-2xl font-extrabold text-emerald-400">{activeCount}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Pending Approval</div>
          <div className="text-2xl font-extrabold text-amber-400">{pendingCount}</div>
        </div>
      </div>

      {/* Alerts */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> {actionSuccess}
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-red-950/60 border border-red-500/50 rounded-2xl text-red-300 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" /> {actionError}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/50 rounded-2xl text-red-300 text-xs font-medium flex items-center justify-between">
          <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-400 shrink-0" /> {error}</span>
          <button onClick={fetchMyBookings} className="underline text-emerald-400 font-bold">Retry</button>
        </div>
      )}

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">No Rental Requests Found</h3>
          <p className="text-xs text-slate-400">Explore our equipment catalog to book tractors or harvesters for your farm.</p>
          <Link to="/equipment" className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg">
            Rent Machinery Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const bookingId = booking._id || booking.id;
            const normStatus = (booking.bookingStatus || booking.status || 'pending').toLowerCase();
            const isPending = normStatus === 'pending';
            
            const eqName = booking.equipment?.name || booking.equipmentName || 'Agricultural Machinery';
            const eqCat = booking.equipment?.category || 'Equipment';
            const eqLoc = booking.equipment?.location || 'Local District';
            const rawImg = booking.equipment?.images?.[0] || booking.equipment_images?.[0] || '';
            const imgSrc = getImageUrl(rawImg);

            const totalFee = booking.totalPrice !== undefined ? booking.totalPrice : (booking.totalAmount !== undefined ? booking.totalAmount : (booking.total_amount || 0));

            return (
              <div 
                key={bookingId}
                className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition"
              >
                
                {/* Equipment Info */}
                <div className="flex items-start gap-4">
                  <img 
                    src={imgSrc} 
                    alt={eqName}
                    className="w-24 h-20 rounded-xl object-cover border border-slate-700 shrink-0 bg-slate-800"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base font-bold text-white">{eqName}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">#{bookingId}</span>
                      {getStatusBadge(booking.bookingStatus, booking.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        {new Date(booking.startDate || booking.start_date).toLocaleDateString()} to {new Date(booking.endDate || booking.end_date).toLocaleDateString()} ({booking.totalDays || booking.total_days || 1} Days)
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {eqLoc}
                      </span>
                    </div>

                    {(booking.includeDriver || booking.include_driver) && (
                      <span className="inline-block text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                        + Driver Operator Included
                      </span>
                    )}

                    {(booking.notes || booking.remarks) && (
                      <p className="text-[11px] text-slate-400 italic pt-0.5">"{booking.notes || booking.remarks}"</p>
                    )}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-slate-800 pt-4 md:pt-0 gap-3 shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-slate-400 block">Total Rental Fee</span>
                    <span className="text-xl font-extrabold text-emerald-400">
                      ₹{Number(totalFee).toLocaleString()}
                    </span>
                  </div>

                  {isPending && (
                    <button
                      onClick={() => handleCancelBooking(bookingId)}
                      className="text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-900/60 border border-red-800/50 px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default FarmerDashboard;

