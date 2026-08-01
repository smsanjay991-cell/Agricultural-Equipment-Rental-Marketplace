import React, { useEffect, useState } from 'react';
import { equipmentService } from '../../services/equipmentService';
import { bookingService } from '../../services/bookingService';
import Loader from '../../components/Loader/Loader';
import { PlusCircle, Tractor, CheckCircle, XCircle, Clock, MapPin, Trash2 } from 'lucide-react';

const Owner = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Equipment Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tractor',
    description: '',
    dailyRate: '',
    location: '',
    horsepower: '',
    fuelType: 'Diesel',
    isDriverAvailable: false,
    driverRatePerDay: '',
    imageUrl: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const eq = await equipmentService.getAll({});
      const b = await bookingService.getMyBookings();
      setEquipmentList(eq);
      setBookings(b);
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
    if (!window.confirm('Delete this equipment listing?')) return;
    try {
      await equipmentService.delete(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await equipmentService.create({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        dailyRate: Number(formData.dailyRate),
        location: formData.location,
        horsepower: Number(formData.horsepower || 0),
        fuelType: formData.fuelType,
        isDriverAvailable: formData.isDriverAvailable,
        driverRatePerDay: Number(formData.driverRatePerDay || 0),
        images: formData.imageUrl ? [formData.imageUrl] : ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80']
      });
      setShowAddModal(false);
      setFormData({
        name: '', category: 'Tractor', description: '', dailyRate: '', location: '', horsepower: '', fuelType: 'Diesel', isDriverAvailable: false, driverRatePerDay: '', imageUrl: ''
      });
      loadData();
    } catch (err) {
      alert('Failed to add equipment: ' + err.message);
    }
  };

  if (loading) return <Loader message="Loading your machinery fleet & rental requests..." />;

  const totalRevenue = bookings
    .filter(b => b.status === 'Approved' || b.status === 'Completed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div className="space-y-8">
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Fleet Owner Portal</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Machinery & Fleet Management</h1>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer w-fit"
        >
          <PlusCircle className="w-4 h-4" /> Add New Equipment
        </button>
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
            {bookings.filter(b => b.status === 'Pending').length} Requests
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
                key={booking._id} 
                className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{booking.equipment?.name || 'Equipment'}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${booking.status === 'Pending' ? 'bg-amber-950 text-amber-400 border border-amber-800' : booking.status === 'Approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'}`}>
                      {booking.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Renter: <strong className="text-slate-200">{booking.farmer?.name || 'Farmer'}</strong> ({booking.farmer?.phone || 'N/A'})
                  </p>
                  <p className="text-xs text-slate-400">
                    Dates: {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()} ({booking.totalDays} Days)
                  </p>
                </div>

                <div className="flex items-center gap-4 justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Price</div>
                    <div className="text-lg font-bold text-emerald-400">₹{booking.totalPrice?.toLocaleString()}</div>
                  </div>

                  {booking.status === 'Pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusUpdate(booking._id, 'Approved')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking._id, 'Rejected')}
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
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Tractor className="w-5 h-5 text-emerald-400" /> My Equipment Listings ({equipmentList.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipmentList.map((item) => (
            <div key={item._id} className="glass-card rounded-2xl overflow-hidden border border-slate-800 relative group">
              <img src={item.images?.[0]} alt={item.name} className="h-40 w-full object-cover" />
              
              <button 
                onClick={() => handleDeleteEquipment(item._id)}
                className="absolute top-3 right-3 p-2 bg-red-950/80 hover:bg-red-900 text-red-400 rounded-lg border border-red-800 transition"
                title="Delete Listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="p-4 space-y-2">
                <div className="text-xs text-emerald-400 font-semibold">{item.category}</div>
                <h3 className="text-base font-bold text-white">{item.name}</h3>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{item.location}</span>
                  <span className="text-emerald-400 font-extrabold text-sm">₹{item.dailyRate}/day</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">List New Machinery</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Machine Name</label>
                <input 
                  type="text" required placeholder="e.g. Sonalika 60HP Tractor"
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select 
                    value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
                  >
                    <option value="Tractor">Tractor</option>
                    <option value="Harvester">Harvester</option>
                    <option value="Tiller">Tiller</option>
                    <option value="Seeder">Seeder</option>
                    <option value="Sprayer">Sprayer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Daily Rate (₹)</label>
                  <input 
                    type="number" required placeholder="1800"
                    value={formData.dailyRate} onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Location / District</label>
                <input 
                  type="text" required placeholder="Karnal, Haryana"
                  value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea 
                  rows={3} required placeholder="State machine condition, attachments included..."
                  value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" id="driverCheck"
                  checked={formData.isDriverAvailable} onChange={(e) => setFormData({ ...formData, isDriverAvailable: e.target.checked })}
                />
                <label htmlFor="driverCheck" className="text-slate-300 font-medium">Trained Driver Available?</label>
              </div>

              {formData.isDriverAvailable && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Driver Rate per Day (₹)</label>
                  <input 
                    type="number" placeholder="400"
                    value={formData.driverRatePerDay} onChange={(e) => setFormData({ ...formData, driverRatePerDay: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">Save Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Owner;
