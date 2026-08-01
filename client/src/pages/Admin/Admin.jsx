import React, { useEffect, useState } from 'react';
import { equipmentService } from '../../services/equipmentService';
import { bookingService } from '../../services/bookingService';
import Loader from '../../components/Loader/Loader';
import { Shield, Users, Tractor, Calendar, CheckCircle2, Activity } from 'lucide-react';

const Admin = () => {
  const [equipment, setEquipment] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eq = await equipmentService.getAll({});
        const b = await bookingService.getMyBookings();
        setEquipment(eq);
        setBookings(b);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader message="Accessing platform administration metrics..." />;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Super Administrator</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">System Audit & Governance Console</h1>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Listed Fleet</span>
            <Tractor className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{equipment.length} Units</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Bookings</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{bookings.length}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Users</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-teal-400">128 Registered</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>System Health</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">100% Operational</div>
        </div>
      </div>

      {/* Machinery Listings Audit Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" /> Verified Equipment Inventory Audit
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 uppercase text-[10px] text-slate-400 tracking-wider">
              <tr>
                <th className="p-3">Equipment Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Location</th>
                <th className="p-3">Daily Rate</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {equipment.map((item) => (
                <tr key={item._id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{item.name}</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400">{item.category}</span></td>
                  <td className="p-3">{item.location}</td>
                  <td className="p-3 font-bold text-emerald-400">₹{item.dailyRate}</td>
                  <td className="p-3">{item.owner?.name || 'Verified Lender'}</td>
                  <td className="p-3">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Admin;
