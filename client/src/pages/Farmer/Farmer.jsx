import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
import Loader from '../../components/Loader/Loader';
import { Calendar, Clock, CheckCircle, XCircle, MapPin, IndianRupee } from 'lucide-react';

const Farmer = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) return;
    try {
      await bookingService.updateStatus(id, 'Cancelled');
      fetchMyBookings();
    } catch (err) {
      alert('Failed to cancel booking: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold px-2.5 py-1 rounded-full"><CheckCircle className="w-3.5 h-3.5" /> Approved</span>;
      case 'Pending':
        return <span className="flex items-center gap-1 text-amber-400 bg-amber-950/80 border border-amber-500/30 text-xs font-semibold px-2.5 py-1 rounded-full"><Clock className="w-3.5 h-3.5" /> Pending Approval</span>;
      case 'Rejected':
        return <span className="flex items-center gap-1 text-red-400 bg-red-950/80 border border-red-500/30 text-xs font-semibold px-2.5 py-1 rounded-full"><XCircle className="w-3.5 h-3.5" /> Declined</span>;
      case 'Completed':
        return <span className="flex items-center gap-1 text-teal-400 bg-teal-950/80 border border-teal-500/30 text-xs font-semibold px-2.5 py-1 rounded-full"><CheckCircle className="w-3.5 h-3.5" /> Completed</span>;
      default:
        return <span className="flex items-center gap-1 text-slate-400 bg-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  if (loading) return <Loader message="Fetching your machinery rentals..." />;

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Farmer Portal</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Active Rentals & Bookings</h1>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="glass-panel px-4 py-2 rounded-xl border border-slate-800 text-center">
            <span className="block text-slate-400">Total Bookings</span>
            <span className="text-lg font-bold text-white">{bookings.length}</span>
          </div>
          <div className="glass-panel px-4 py-2 rounded-xl border border-slate-800 text-center">
            <span className="block text-slate-400">Approved</span>
            <span className="text-lg font-bold text-emerald-400">
              {bookings.filter(b => b.status === 'Approved').length}
            </span>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">No Rental Requests Found</h3>
          <p className="text-xs text-slate-400">Explore our equipment catalog to book tractors or harvesters for your farm.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div 
              key={booking._id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition"
            >
              
              {/* Equipment Info */}
              <div className="flex items-start gap-4">
                <img 
                  src={booking.equipment?.images?.[0] || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'} 
                  alt={booking.equipment?.name}
                  className="w-24 h-20 rounded-xl object-cover border border-slate-700 shrink-0 bg-slate-800"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white">{booking.equipment?.name || 'Machinery'}</h3>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()} ({booking.totalDays} Days)
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {booking.equipment?.location || 'Local'}
                    </span>
                  </div>

                  {booking.includeDriver && (
                    <span className="inline-block text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                      + Machine Operator Included
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-slate-800 pt-4 md:pt-0 gap-3">
                <div className="text-left md:text-right">
                  <span className="text-xs text-slate-400 block">Total Rental Fee</span>
                  <span className="text-xl font-extrabold text-emerald-400">
                    ₹{booking.totalPrice?.toLocaleString()}
                  </span>
                </div>

                {booking.status === 'Pending' && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="text-xs font-medium text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Farmer;
