import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { equipmentService } from '../../services/equipmentService';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { Calendar, User, MapPin, Gauge, CheckCircle, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const equipmentId = searchParams.get('equipmentId');

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Dynamic default dates (today & 3 days later)
  const todayStr = new Date().toISOString().split('T')[0];
  const futureStr = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(futureStr);
  const [includeDriver, setIncludeDriver] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!equipmentId) {
      navigate('/equipment');
      return;
    }
    loadEquipment();
  }, [equipmentId]);

  const loadEquipment = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await equipmentService.getById(equipmentId);
      if (!data) throw new Error('Equipment not found');
      setItem(data);
      if (data?.isDriverAvailable || data?.is_driver_available) {
        setIncludeDriver(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to load equipment details.');
    } finally {
      setLoading(false);
    }
  };

  // Calculation Logic
  const calculateDurationAndCosts = () => {
    if (!startDate || !endDate) return { days: 1, baseCost: 0, driverTotal: 0, grandTotal: 0, dailyRent: 0, driverRate: 0 };
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const rawDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const days = rawDays > 0 ? rawDays : 1;

    const dailyRent = item ? (item.daily_rent !== undefined ? item.daily_rent : (item.dailyRate !== undefined ? item.dailyRate : (item.daily_rate || 0))) : 0;
    const baseCost = days * Number(dailyRent);

    const isDriverAvail = item ? Boolean(item.isDriverAvailable || item.is_driver_available) : false;
    const driverRate = (includeDriver && isDriverAvail) ? Number(item?.driverRatePerDay || item?.driver_rate_per_day || 0) : 0;
    const driverTotal = days * driverRate;
    const grandTotal = baseCost + driverTotal;

    return { days, baseCost, driverTotal, grandTotal, dailyRent, driverRate };
  };

  const { days, baseCost, driverTotal, grandTotal, dailyRent, driverRate } = calculateDurationAndCosts();

  const validateDates = () => {
    if (!startDate) return 'Start date is required.';
    if (!endDate) return 'End date is required.';

    if (startDate < todayStr) {
      return 'Start date cannot be in the past.';
    }

    if (endDate < startDate) {
      return 'End date cannot be earlier than start date.';
    }

    return null;
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    const dateErr = validateDates();
    if (dateErr) {
      setError(dateErr);
      return;
    }

    setSubmitting(true);

    try {
      await bookingService.create({
        equipmentId,
        startDate,
        endDate,
        includeDriver,
        notes
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/farmer-dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error creating booking request:', err);
      setError(err.message || 'Failed to submit booking request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Preparing reservation details..." />;

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-14 h-14 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Equipment Not Found</h2>
          <p className="text-sm text-slate-600">The machinery requested for booking could not be located.</p>
          <Link to="/equipment" className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm transition">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const rawImg = item.image || (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '');
  const imgSrc = getImageUrl(rawImg);
  const isDriverAvail = Boolean(item.isDriverAvailable || item.is_driver_available);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-green-700 transition mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Reserve {item.name}</h1>
        </div>

        <div className="text-xs text-slate-500">
          Logged in as: <strong className="text-green-700">{user?.name || 'Farmer'}</strong>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-5 h-5 text-green-700 shrink-0" /> 
          <span>Booking request submitted successfully! Redirecting to your dashboard...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Equipment Summary */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 h-fit">
          <img 
            src={imgSrc} 
            alt={item.name} 
            className="w-full h-48 object-cover rounded-lg border border-slate-200 bg-slate-100" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
            }}
          />

          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 bg-slate-100 text-green-800 text-xs font-semibold rounded-md border border-slate-200">
              {item.category || 'General'}
            </span>
            <h2 className="text-lg font-bold text-slate-900 pt-1">{item.name}</h2>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{item.description}</p>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Location</span>
              <span className="font-semibold text-slate-900">{item.location}</span>
            </div>
            {item.horsepower > 0 && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-green-700" /> Horsepower</span>
                <span className="font-semibold text-slate-900">{item.horsepower} HP</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-green-700" /> Equipment Owner</span>
              <span className="font-semibold text-slate-900">{item.owner?.name || 'Verified Lender'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Form & Cost Calculator */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-700" /> Select Reservation Dates & Options
            </h3>

            {/* Date Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  required
                  min={todayStr}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  required
                  min={startDate || todayStr}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                />
              </div>
            </div>

            {/* Driver Option Toggle */}
            {isDriverAvail && (
              <div className="p-3.5 rounded-lg bg-green-50/70 border border-green-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Include Trained Machine Operator / Driver</div>
                  <div className="text-[11px] text-slate-600">
                    Additional driver rate: +₹{Number(item.driverRatePerDay || item.driver_rate_per_day || 0)} / day
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={includeDriver}
                  onChange={(e) => setIncludeDriver(e.target.checked)}
                  className="w-4 h-4 text-green-700 rounded border-slate-300 focus:ring-green-600 cursor-pointer"
                />
              </div>
            )}

            {/* Special Instructions / Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Delivery Notes & Special Instructions</label>
              <textarea 
                rows={3}
                placeholder="Mention crop type, field address, or early delivery request..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
              />
            </div>

            {/* Price Estimation Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2 flex justify-between">
                <span>Cost Breakdown</span>
                <span className="text-green-700 font-bold">{days} {days === 1 ? 'Day' : 'Days'} Duration</span>
              </div>

              <div className="flex justify-between text-xs text-slate-600">
                <span>Machine Rental (₹{Number(dailyRent).toLocaleString()} × {days} days)</span>
                <span className="font-semibold text-slate-900">₹{baseCost.toLocaleString()}</span>
              </div>

              {includeDriver && isDriverAvail && (
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Operator Fee (₹{Number(driverRate).toLocaleString()} × {days} days)</span>
                  <span className="font-semibold text-slate-900">₹{driverTotal.toLocaleString()}</span>
                </div>
              )}

              {item.deposit > 0 && (
                <div className="flex justify-between text-xs text-slate-500 pt-1">
                  <span>Refundable Security Deposit</span>
                  <span className="font-semibold text-slate-800">₹{Number(item.deposit).toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2.5">
                <span>Estimated Total Fee</span>
                <span className="text-green-700 text-lg font-extrabold">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold text-sm py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Submitting Reservation Request...' : 'Confirm & Request Rental'} <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        </div>

      </div>

    </div>
  );
};

export default Booking;

