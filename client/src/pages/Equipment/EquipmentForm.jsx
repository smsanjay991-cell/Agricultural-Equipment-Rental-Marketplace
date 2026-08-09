import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { equipmentService } from '../../services/equipmentService';
import { getImageUrl } from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { 
  Tractor, Upload, ArrowLeft, CheckCircle, AlertCircle, Save, Image as ImageIcon 
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  'Tractor',
  'Harvester',
  'Tiller',
  'Seeder',
  'Sprayer',
  'General'
];

const FUEL_OPTIONS = [
  'Diesel',
  'Petrol',
  'Electric',
  'N/A'
];

const EquipmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Tractor',
    category_id: '',
    description: '',
    brand: '',
    model: '',
    daily_rent: '',
    deposit: '0',
    location: '',
    horsepower: '0',
    fuel_type: 'Diesel',
    is_driver_available: false,
    driver_rate_per_day: '0',
    imageUrl: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isEdit) {
      loadExistingData();
    }
  }, [id]);

  const loadExistingData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await equipmentService.getById(id);
      if (!data) throw new Error('Equipment not found');

      const rentVal = data.daily_rent !== undefined ? data.daily_rent : (data.dailyRent !== undefined ? data.dailyRent : data.daily_rate);
      const fuelVal = data.fuel_type || data.fuelType || 'Diesel';
      const driverVal = data.is_driver_available !== undefined ? data.is_driver_available : Boolean(data.isDriverAvailable);
      const driverRateVal = data.driver_rate_per_day !== undefined ? data.driver_rate_per_day : (data.driverRatePerDay || 0);

      setFormData({
        name: data.name || '',
        category: data.category || 'Tractor',
        category_id: data.category_id || data.categoryId || '',
        description: data.description || '',
        brand: data.brand || '',
        model: data.model || '',
        daily_rent: rentVal || '',
        deposit: data.deposit || '0',
        location: data.location || '',
        horsepower: data.horsepower || '0',
        fuel_type: fuelVal,
        is_driver_available: Boolean(driverVal),
        driver_rate_per_day: driverRateVal || '0',
        imageUrl: data.image || (Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : '')
      });

      if (data.image || (Array.isArray(data.images) && data.images.length > 0)) {
        setImagePreview(getImageUrl(data.image || data.images[0]));
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch equipment details for editing');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size exceeds 5MB limit.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Equipment name is required.';
    if (!formData.description.trim()) return 'Description is required.';
    if (!formData.location.trim()) return 'Location is required.';
    
    const rent = Number(formData.daily_rent);
    if (isNaN(rent) || rent <= 0) return 'Daily rent must be a positive number.';

    const deposit = Number(formData.deposit);
    if (isNaN(deposit) || deposit < 0) return 'Deposit must be a non-negative number.';

    const hp = Number(formData.horsepower);
    if (isNaN(hp) || hp < 0) return 'Horsepower must be a valid number.';

    if (formData.is_driver_available) {
      const driverRate = Number(formData.driver_rate_per_day);
      if (isNaN(driverRate) || driverRate < 0) return 'Driver rate must be a non-negative number.';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const valError = validateForm();
    if (valError) {
      setError(valError);
      return;
    }

    setSubmitting(true);

    try {
      const submitPayload = new FormData();
      submitPayload.append('name', formData.name.trim());
      submitPayload.append('category', formData.category);
      if (formData.category_id) submitPayload.append('category_id', formData.category_id);
      submitPayload.append('description', formData.description.trim());
      submitPayload.append('brand', formData.brand.trim());
      submitPayload.append('model', formData.model.trim());
      submitPayload.append('daily_rent', Number(formData.daily_rent));
      submitPayload.append('dailyRate', Number(formData.daily_rent));
      submitPayload.append('deposit', Number(formData.deposit || 0));
      submitPayload.append('location', formData.location.trim());
      submitPayload.append('horsepower', Number(formData.horsepower || 0));
      submitPayload.append('fuel_type', formData.fuel_type);
      submitPayload.append('fuelType', formData.fuel_type);
      submitPayload.append('is_driver_available', formData.is_driver_available ? '1' : '0');
      submitPayload.append('isDriverAvailable', formData.is_driver_available ? 'true' : 'false');
      submitPayload.append('driver_rate_per_day', Number(formData.driver_rate_per_day || 0));
      submitPayload.append('driverRatePerDay', Number(formData.driver_rate_per_day || 0));

      if (imageFile) {
        submitPayload.append('image', imageFile);
      } else if (formData.imageUrl) {
        submitPayload.append('image', formData.imageUrl);
      }

      let result;
      if (isEdit) {
        result = await equipmentService.update(id, submitPayload);
        setSuccess('Equipment listing updated successfully!');
      } else {
        result = await equipmentService.create(submitPayload);
        setSuccess('Equipment listing created successfully!');
      }

      const createdId = result._id || result.id || id;

      setTimeout(() => {
        if (createdId) {
          navigate(`/equipment/${createdId}`);
        } else {
          navigate('/owner-dashboard');
        }
      }, 1200);

    } catch (err) {
      console.error('Error submitting equipment form:', err);
      setError(err.message || 'Failed to save equipment. Please verify inputs and permissions.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader message="Fetching equipment specifications..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel & Back
          </button>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Tractor className="w-6 h-6 text-emerald-400" />
            {isEdit ? 'Edit Machinery Listing' : 'List New Machinery'}
          </h1>
        </div>

        <div className="text-xs text-slate-400">
          Role: <strong className="text-emerald-400 uppercase">Owner / Admin</strong>
        </div>
      </div>

      {/* Alert Notifications */}
      {error && (
        <div className="glass-panel p-4 rounded-2xl border border-red-800/60 bg-red-950/40 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="glass-panel p-4 rounded-2xl border border-emerald-800/60 bg-emerald-950/40 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800/80 pb-2">1. Basic Machine Details</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Equipment Name <span className="text-red-400">*</span>
            </label>
            <input 
              type="text" 
              name="name"
              required
              placeholder="e.g. John Deere 5050D 50HP Tractor"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category <span className="text-red-400">*</span>
              </label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition"
              >
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Brand / Manufacturer
              </label>
              <input 
                type="text" 
                name="brand"
                placeholder="e.g. Mahindra, Sonalika"
                value={formData.brand}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Model Variant
              </label>
              <input 
                type="text" 
                name="model"
                placeholder="e.g. Rotavator 6ft, DC-68G"
                value={formData.model}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Machine Description <span className="text-red-400">*</span>
            </label>
            <textarea 
              name="description"
              required
              rows={4}
              placeholder="Describe machine condition, attachments included, ideal crop applications..."
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Pricing & Location */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base font-bold text-white border-b border-slate-800/80 pb-2">2. Pricing & Location</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Daily Rent (₹) <span className="text-red-400">*</span>
              </label>
              <input 
                type="number" 
                name="daily_rent"
                required
                min="1"
                placeholder="e.g. 1500"
                value={formData.daily_rent}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Security Deposit (₹)
              </label>
              <input 
                type="number" 
                name="deposit"
                min="0"
                placeholder="e.g. 2000"
                value={formData.deposit}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location / District <span className="text-red-400">*</span>
              </label>
              <input 
                type="text" 
                name="location"
                required
                placeholder="e.g. Ludhiana, Punjab"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Specifications & Driver */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base font-bold text-white border-b border-slate-800/80 pb-2">3. Technical Specs & Operator</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Horsepower (HP)
              </label>
              <input 
                type="number" 
                name="horsepower"
                min="0"
                placeholder="e.g. 50"
                value={formData.horsepower}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Fuel Type
              </label>
              <select 
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition"
              >
                {FUEL_OPTIONS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox"
                id="is_driver_available"
                name="is_driver_available"
                checked={formData.is_driver_available}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 rounded border-slate-700 bg-slate-900 focus:ring-emerald-500"
              />
              <label htmlFor="is_driver_available" className="text-xs font-bold text-slate-200 cursor-pointer">
                Machine Operator / Driver Available for Hire?
              </label>
            </div>

            {formData.is_driver_available && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Driver Operator Daily Rate (₹)
                </label>
                <input 
                  type="number" 
                  name="driver_rate_per_day"
                  min="0"
                  placeholder="e.g. 400"
                  value={formData.driver_rate_per_day}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100"
                />
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base font-bold text-white border-b border-slate-800/80 pb-2">4. Machinery Photo</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            
            {/* File Upload Trigger */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Upload Image File (Max 5MB: JPG, PNG, WEBP)
              </label>
              
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-emerald-500/80 bg-slate-800/50 hover:bg-slate-800 p-6 rounded-2xl cursor-pointer transition text-center space-y-2">
                <Upload className="w-8 h-8 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-300">Click to Select Image File</span>
                <span className="text-[10px] text-slate-500">Supports JPG, JPEG, PNG, WEBP</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Preview Window */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Image Preview</label>
              <div className="h-40 bg-slate-800/60 rounded-2xl border border-slate-700 overflow-hidden flex items-center justify-center relative">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                ) : (
                  <div className="text-center text-slate-500 space-y-1">
                    <ImageIcon className="w-8 h-8 mx-auto text-slate-600" />
                    <span className="text-xs block">No Image Selected</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Form Controls */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-4">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
          >
            Cancel
          </button>

          <button 
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {submitting ? 'Saving Listing...' : (isEdit ? 'Update Machinery' : 'Publish Machinery Listing')}
          </button>
        </div>

      </form>

    </div>
  );
};

export default EquipmentForm;
