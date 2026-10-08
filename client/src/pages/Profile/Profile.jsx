import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, CheckCircle, AlertCircle, Save, Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="border-b border-slate-200 pb-4">
        <div className="text-xs font-bold text-green-700 uppercase tracking-wider">User Account Profile</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Account Settings & Profile</h1>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-5 h-5 text-green-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        
        {/* User Role Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-800 font-extrabold text-xl flex items-center justify-center border border-green-200">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{user?.name || 'User Account'}</h3>
              <div className="text-xs text-green-700 font-semibold uppercase">{user?.role || 'Member'} Persona</div>
            </div>
          </div>
        </div>

        {/* Profile Update Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-medium mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 pl-10 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 pl-10 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Phone Number</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 pl-10 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1.5">Location / District</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Trichy, Tamil Nadu"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2.5 pl-10 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
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

