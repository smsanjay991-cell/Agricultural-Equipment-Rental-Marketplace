import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, ShieldCheck, CheckCircle, AlertCircle, Save, Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, switchDemoRole } = useAuth();
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || ''
      });
    }
  }, [user]);

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Full name is required.';
    }
    if (formData.phone && !/^[+0-9\s-]{8,15}$/.test(formData.phone.trim())) {
      return 'Please enter a valid phone number.';
    }
    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim()
      });
      setSuccessMsg('Profile settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setErrorMsg(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-slate-800 pb-4">
        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">User Account Profile</div>
        <h1 className="text-3xl font-extrabold text-white">Account Settings & Role</h1>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-emerald-400 text-sm font-bold flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/60 border border-red-500/50 rounded-2xl text-red-300 text-xs font-medium flex items-center gap-2 shadow-lg">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        
        {/* User Role Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 font-extrabold text-xl flex items-center justify-center border border-emerald-500/30">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{user?.name || 'User Account'}</h3>
              <div className="text-xs text-emerald-400 font-semibold uppercase">{user?.role || 'Member'} Persona</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Demo Roles:</span>
            <button onClick={() => switchDemoRole('farmer')} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition">Farmer</button>
            <button onClick={() => switchDemoRole('owner')} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition">Owner</button>
            <button onClick={() => switchDemoRole('admin')} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition">Admin</button>
          </div>
        </div>

        {/* Profile Update Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 pl-10 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 transition"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 pl-10 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 pl-10 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 transition"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Location / District</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ludhiana, Punjab"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 pl-10 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 transition"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Profile Changes
              </>
            )}
          </button>
        </form>

      </div>

    </div>
  );
};

export default Profile;

