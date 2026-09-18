import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { reviewService } from '../../services/reviewService';
import { getImageUrl } from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { 
  Calendar, Clock, CheckCircle, XCircle, AlertCircle, MapPin, RefreshCw, ShoppingBag, Star, Loader2, X 
} from 'lucide-react';

const FarmerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    fetchMyData();
  }, []);

  const fetchMyData = async () => {
    setLoading(true);
    setError('');
    setActionError('');
    try {
      const [bookingsData, reviewsData] = await Promise.all([
        bookingService.getMyBookings(),
        reviewService.getMyReviews().catch(() => [])
      ]);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setMyReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      console.error('Error fetching farmer dashboard data:', err);
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
      fetchMyData();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      console.error('Cancellation error:', err);
      setActionError(err.message || 'Failed to cancel booking.');
    }
  };

  const handleOpenReviewModal = (booking) => {
    setSelectedBooking(booking);
    setRating(5);
    setComment('');
    setReviewError('');
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    if (reviewSubmitting) return;
    setIsReviewModalOpen(false);
    setSelectedBooking(null);
    setRating(5);
    setComment('');
    setReviewError('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setActionSuccess('');

    if (!selectedBooking) return;
    if (!comment || !comment.trim()) {
      setReviewError('Please enter a comment describing your rental experience.');
      return;
    }

    const bId = selectedBooking._id || selectedBooking.id;
    const eqId = selectedBooking.equipment_id || selectedBooking.equipmentId || (selectedBooking.equipment ? (selectedBooking.equipment._id || selectedBooking.equipment.id) : null);

    setReviewSubmitting(true);
    try {
      await reviewService.create({
        bookingId: bId,
        equipmentId: eqId,
        rating,
        comment: comment.trim()
      });

      setActionSuccess('Review submitted successfully! Thank you for your feedback.');
      handleCloseReviewModal();
      fetchMyData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error('Review submission error:', err);
      setReviewError(err.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
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
            onClick={fetchMyData}
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
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> {actionSuccess}
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-red-950/60 border border-red-500/50 rounded-2xl text-red-300 text-xs font-medium flex items-center gap-2 shadow-lg">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" /> {actionError}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/50 rounded-2xl text-red-300 text-xs font-medium flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-400 shrink-0" /> {error}</span>
          <button onClick={fetchMyData} className="underline text-emerald-400 font-bold">Retry</button>
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
            const isCompleted = normStatus === 'completed';
            
            const eqName = booking.equipment?.name || booking.equipmentName || 'Agricultural Machinery';
            const eqLoc = booking.equipment?.location || 'Local District';
            const rawImg = booking.equipment?.images?.[0] || booking.equipment_images?.[0] || '';
            const imgSrc = getImageUrl(rawImg);

            const totalFee = booking.totalPrice !== undefined ? booking.totalPrice : (booking.totalAmount !== undefined ? booking.totalAmount : (booking.total_amount || 0));

            // Check if review already submitted for this booking
            const existingRev = myReviews.find(r => String(r.booking) === String(bookingId) || String(r.booking_id) === String(bookingId));

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

                  {isCompleted && (
                    existingRev ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-lg">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Review Submitted
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenReviewModal(booking)}
                        className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> Leave Review
                      </button>
                    )
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Review Submission Modal */}
      {isReviewModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700 max-w-lg w-full space-y-5 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Completed Rental Feedback</div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Submit Equipment Review
                </h3>
              </div>
              <button 
                onClick={handleCloseReviewModal}
                disabled={reviewSubmitting}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewError && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{reviewError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              
              {/* Equipment & Booking Context */}
              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Machine Rented</span>
                <span className="text-sm font-bold text-white block">
                  {selectedBooking.equipment?.name || selectedBooking.equipmentName || 'Equipment'}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Booking ID #{selectedBooking._id || selectedBooking.id}
                </span>
              </div>

              {/* Star Rating Picker */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Rating <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setRating(starVal)}
                      className="p-1 text-slate-600 hover:text-amber-400 transition cursor-pointer focus:outline-none"
                      title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                    >
                      <Star 
                        className={`w-7 h-7 transition ${starVal <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} 
                      />
                    </button>
                  ))}
                  <span className="ml-auto text-xs font-bold text-amber-400">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Your Review & Feedback <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about machine performance, condition, fuel efficiency, or operator quality..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseReviewModal}
                  disabled={reviewSubmitting}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {reviewSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default FarmerDashboard;
