import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { equipmentService } from '../../services/equipmentService';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader/Loader';
import { Calendar, User, MapPin, Gauge, Fuel, CheckCircle, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

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

  // Form State
  const [startDate, setStartDate] = useState('2026-08-10');
  const [endDate, setEndDate] = useState('2026-08-14');
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
    try {
      const data = await equipmentService.getById(equipmentId);
      setItem(data);
      if (data?.isDriverAvailable) {
        setIncludeDriver(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to load equipment details.');
    } finally {
      setLoading(false);
    }
  };

  // Calculation Logic
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const baseRate = item ? item.dailyRate : 0;
  const baseCost = days * baseRate;
  const driverRate = (includeDriver && item?.isDriverAvailable) ? (item.driverRatePerDay || 400) : 0;
  const driverTotal = days * driverRate;
  const grandTotal = baseCost + driverTotal;

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    setError('');

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
      setError(err.message || 'Failed to complete booking request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Preparing reservation details..." />;

  if (!item) return <div className="p-8 text-center text-slate-400">Equipment not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-slate-800 pb-4">
        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Equipment Booking Engine</div>
        <h1 className="text-3xl font-extrabold text-white">Reserve {item.name}</h1>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> Booking request submitted successfully! Redirecting to dashboard...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Equipment Summary */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 h-fit">
          <img 
            src={item.images?.[0]} 
            alt={item.name} 
            className="w-full h-48 object-cover rounded-2xl border border-slate-700" 
          />

          <div className="space-y-2">
            <span className="px-3 py-1 bg-slate-800 text-emerald-400 text-xs font-semibold rounded-full">
              {item.category}
            </span>
            <h2 className="text-xl font-bold text-white pt-1">{item.name}</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
          </div>

          <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> Location</span>
              <span className="font-semibold text-white">{item.location}</span>
            </div>
            {item.horsepower > 0 && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-emerald-400" /> Horsepower</span>
                <span className="font-semibold text-white">{item.horsepower} HP</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-emerald-400" /> Verified Owner</span>
              <span className="font-semibold text-white">{item.owner?.name || 'Equipment Lender'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Form & Cost Calculator */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" /> Select Reservation Dates & Driver Option
            </h3>

            {/* Date Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Start Date</label>
                <input 
                  type="date" 
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">End Date</label>
                <input 
                  type="date" 
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Driver Option Toggle */}
            {item.isDriverAvailable && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Add Experienced Machine Operator</div>
                  <div className="text-[11px] text-slate-400">Includes professional driver (+₹{item.driverRatePerDay || 400}/day)</div>
                </div>
                <input 
                  type="checkbox"
                  checked={includeDriver}
                  onChange={(e) => setIncludeDriver(e.target.checked)}
                  className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            )}

            {/* Special Instructions / Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Delivery Notes & Special Instructions</label>
              <textarea 
                rows={3}
                placeholder="Mention crop type, field address, or early delivery request..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Price Estimation Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                Cost Breakdown ({days} Days)
              </div>

              <div className="flex justify-between text-xs text-slate-300">
                <span>Machine Rental (₹{baseRate} × {days} days)</span>
                <span className="font-semibold text-white">₹{baseCost.toLocaleString()}</span>
              </div>

              {includeDriver && (
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Driver Fee (₹{driverRate} × {days} days)</span>
                  <span className="font-semibold text-white">₹{driverTotal.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-extrabold text-white border-t border-slate-800 pt-3">
                <span>Estimated Total Price</span>
                <span className="text-emerald-400 text-xl">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? 'Submitting Request...' : 'Confirm & Request Rental'} <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        </div>

      </div>

    </div>
  );
};

export default Booking;
