import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, ShieldCheck, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, switchDemoRole } = useAuth();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-slate-800 pb-4">
        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">User Account Profile</div>
        <h1 className="text-3xl font-extrabold text-white">Account Settings & Role</h1>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> Profile settings updated successfully!
        </div>
      )}

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        
        {/* User Role Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 font-extrabold text-xl flex items-center justify-center border border-emerald-500/30">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{user?.name}</h3>
              <div className="text-xs text-emerald-400 font-semibold uppercase">{user?.role} Persona</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Switch Demo Role:</span>
            <button onClick={() => switchDemoRole('farmer')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded">Farmer</button>
            <button onClick={() => switchDemoRole('owner')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded">Owner</button>
            <button onClick={() => switchDemoRole('admin')} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded">Admin</button>
          </div>
        </div>

        {/* Profile Update Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Phone Number</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Location / District</label>
            <input 
              type="text" 
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
            />
          </div>

          <button 
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition cursor-pointer"
          >
            Save Profile Changes
          </button>
        </form>

      </div>

    </div>
  );
};

export default Profile;
