import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { equipmentService } from '../../services/equipmentService';
import { bookingService } from '../../services/bookingService';
import { getImageUrl } from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { PlusCircle, Tractor, CheckCircle, XCircle, Clock, MapPin, DollarSign, Fuel, Gauge, Trash2, Edit3, Eye } from 'lucide-react';

const OwnerDashboard = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const eq = await equipmentService.getMyEquipment();
      const b = await bookingService.getMyBookings();
      setEquipmentList(eq || []);
      setBookings(b || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingService.updateStatus(bookingId, newStatus);
      loadData();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment listing?')) return;
    try {
      await equipmentService.delete(id);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete equipment');
    }
  };

  if (loading) return <Loader message="Loading your machinery fleet & rental requests..." />;

  const totalRevenue = bookings
    .filter(b => b.status === 'Approved' || b.status === 'Completed' || b.booking_status === 'approved' || b.booking_status === 'completed')
    .reduce((sum, b) => sum + (b.totalPrice || b.total_amount || b.total_price || 0), 0);

  return (
    <div className="space-y-8">
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Fleet Owner Portal</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Machinery & Bookings Manager</h1>
        </div>

        <Link 
          to="/equipment/new"
          className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer w-fit"
        >
          <PlusCircle className="w-4 h-4" /> Add New Equipment
        </Link>
      </div>

      {/* Revenue & Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Estimated Revenue</div>
          <div className="text-2xl font-extrabold text-emerald-400">₹{totalRevenue.toLocaleString()}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Listed Machines</div>
          <div className="text-2xl font-extrabold text-white">{equipmentList.length} Units</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Pending Requests</div>
          <div className="text-2xl font-extrabold text-amber-400">
            {bookings.filter(b => b.status === 'Pending' || b.booking_status === 'pending').length} Requests
          </div>
        </div>
      </div>

      {/* Incoming Rental Requests */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-400" /> Incoming Rental Requests
        </h2>

        {bookings.length === 0 ? (
          <div className="glass-panel p-6 rounded-2xl text-center text-xs text-slate-400">
            No rental requests received yet.
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div 
                key={booking._id || booking.id} 
                className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{booking.equipment?.name || 'Equipment'}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${(booking.status === 'Pending' || booking.booking_status === 'pending') ? 'bg-amber-950 text-amber-400 border border-amber-800' : (booking.status === 'Approved' || booking.booking_status === 'approved') ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'}`}>
                      {booking.status || booking.booking_status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Renter: <strong className="text-slate-200">{booking.farmer?.name || 'Farmer'}</strong> ({booking.farmer?.phone || 'N/A'})
                  </p>
                  <p className="text-xs text-slate-400">
                    Dates: {new Date(booking.startDate || booking.start_date).toLocaleDateString()} - {new Date(booking.endDate || booking.end_date).toLocaleDateString()} ({booking.totalDays || booking.total_days} Days)
                  </p>
                </div>

                <div className="flex items-center gap-4 justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Price</div>
                    <div className="text-lg font-bold text-emerald-400">₹{Number(booking.totalPrice || booking.total_amount || 0).toLocaleString()}</div>
                  </div>

                  {(booking.status === 'Pending' || booking.booking_status === 'pending') && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusUpdate(booking._id || booking.id, 'Approved')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking._id || booking.id, 'Rejected')}
                        className="bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Owner Listed Equipment */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Tractor className="w-5 h-5 text-emerald-400" /> My Equipment Listings ({equipmentList.length})
          </span>
          <Link to="/equipment/new" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
            + Add New
          </Link>
        </h2>

        {equipmentList.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center space-y-3 border border-slate-800">
            <Tractor className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-300">No Equipment Listed Yet</h3>
            <p className="text-xs text-slate-500">List your tractors or harvesters to start earning rental income.</p>
            <Link to="/equipment/new" className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl">
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
                <div key={itemId} className="glass-card rounded-2xl overflow-hidden border border-slate-800 relative group flex flex-col justify-between">
                  <div>
                    <div className="relative h-40 w-full overflow-hidden bg-slate-800">
                      <img 
                        src={imgSrc} 
                        alt={item.name} 
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 border border-slate-700">
                        {item.category || 'General'}
                      </div>

                      <button 
                        onClick={() => handleDeleteEquipment(itemId)}
                        className="absolute top-3 right-3 p-2 bg-red-950/90 hover:bg-red-900 text-red-400 rounded-lg border border-red-800 transition cursor-pointer"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="text-base font-bold text-white line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          {item.location}
                        </span>
                        <span className="text-emerald-400 font-extrabold text-sm">₹{Number(dailyRent).toLocaleString()}/day</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-800/80 mt-2">
                    <Link 
                      to={`/equipment/${itemId}`} 
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-xl text-center flex items-center justify-center gap-1 transition border border-slate-700"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Specs
                    </Link>
                    <Link 
                      to={`/equipment/${itemId}/edit`} 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1 transition shadow-md shadow-emerald-600/20"
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

