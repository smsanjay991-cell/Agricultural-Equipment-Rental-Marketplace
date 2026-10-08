import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { equipmentService } from '../../services/equipmentService';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../services/api';
import Loader from '../../components/Loader/Loader';
import { 
  MapPin, Star, Gauge, Fuel, 
  ArrowLeft, Edit3, Trash2, Calendar, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await equipmentService.getById(id);
      if (!data) {
        throw new Error('Equipment listing not found');
      }
      setEquipment(data);
      const mainImg = data.image || (Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : '');
      setActiveImage(getImageUrl(mainImg));
    } catch (err) {
      console.error('Error loading equipment details:', err);
      setError(err.message || 'Failed to fetch equipment details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this equipment listing? This action cannot be undone.')) {
      return;
    }
    setDeleting(true);
    try {
      await equipmentService.delete(id);
      alert('Equipment listing successfully removed.');
      navigate('/owner-dashboard');
    } catch (err) {
      alert('Failed to delete equipment: ' + (err.message || 'Server error'));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader message="Loading machinery details and specifications..." />;
  }

  if (error || !equipment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <AlertCircle className="w-14 h-14 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Equipment Not Found</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">{error || 'The requested equipment listing could not be retrieved from the server.'}</p>
          <div className="pt-4 flex items-center justify-center gap-3">
            <button 
              onClick={fetchDetails}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg border border-slate-200 transition cursor-pointer"
            >
              Retry Loading
            </button>
            <Link 
              to="/equipment" 
              className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const itemId = equipment._id || equipment.id;
  const ownerId = equipment.owner_id || equipment.ownerId || (equipment.owner ? (equipment.owner._id || equipment.owner.id) : null);
  const userId = user ? (user._id || user.id) : null;
  const isOwner = user && (String(ownerId) === String(userId) || user.role === 'admin');
  const dailyRent = equipment.daily_rent !== undefined ? equipment.daily_rent : (equipment.dailyRent !== undefined ? equipment.dailyRent : equipment.daily_rate);
  const isAvailable = equipment.availability !== undefined ? equipment.availability : (equipment.isAvailable !== undefined ? equipment.isAvailable : equipment.is_available);

  const imagesList = Array.isArray(equipment.images) && equipment.images.length > 0 
    ? equipment.images 
    : [equipment.image || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-green-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Equipment
        </button>

        {isOwner && (
          <div className="flex items-center gap-3">
            <Link 
              to={`/equipment/${itemId}/edit`}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium px-3.5 py-2 rounded-lg transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-green-700" /> Edit Listing
            </Link>
            <button 
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-medium px-3.5 py-2 rounded-lg transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> {deleting ? 'Deleting...' : 'Delete Listing'}
            </button>
          </div>
        )}
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Gallery & Specs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Active Image */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
            <img 
              src={activeImage || getImageUrl(imagesList[0])} 
              alt={equipment.name}
              className="w-full h-96 object-cover rounded-xl bg-slate-100"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
              }}
            />
            
            <div className="absolute top-5 left-5 bg-white/95 px-3 py-1 rounded-md border border-slate-200 text-xs font-semibold text-green-800 shadow-xs">
              {equipment.category || 'General'}
            </div>

            <div className="absolute top-5 right-5">
              {isAvailable ? (
                <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-md shadow-xs">
                  <CheckCircle className="w-4 h-4 text-green-700" /> Available for Rent
                </span>
              ) : (
                <span className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-3 py-1 rounded-md shadow-xs">
                  <XCircle className="w-4 h-4 text-red-600" /> Currently Unavailable
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Gallery (If Multiple Images) */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {imagesList.map((img, idx) => {
                const fullUrl = getImageUrl(img);
                return (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(fullUrl)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition shrink-0 ${activeImage === fullUrl ? 'border-green-700 ring-2 ring-green-700/20' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <img src={fullUrl} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Detailed Description */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-base font-bold text-slate-900">Machine Description & Capabilities</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {equipment.description}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Technical Specifications</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-500 block font-medium">Category</span>
                <span className="text-slate-900 font-bold text-sm">{equipment.category || 'General'}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-500 block font-medium">Brand / Manufacturer</span>
                <span className="text-slate-900 font-bold text-sm">{equipment.brand || 'Standard'}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-500 block font-medium">Model Variant</span>
                <span className="text-slate-900 font-bold text-sm">{equipment.model || 'N/A'}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-500 block font-medium">Engine Power</span>
                <span className="text-green-700 font-bold text-sm flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5" /> {equipment.horsepower || 0} HP
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-500 block font-medium">Fuel Type</span>
                <span className="text-slate-900 font-bold text-sm flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-green-700" /> {equipment.fuelType || equipment.fuel_type || 'Diesel'}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-500 block font-medium">Driver Operator</span>
                <span className="text-slate-900 font-bold text-sm">
                  {(equipment.isDriverAvailable || equipment.is_driver_available) 
                    ? `Available (+₹${equipment.driverRatePerDay || equipment.driver_rate_per_day || 0}/day)`
                    : 'Self-Driven Only'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Pricing & Booking Panel */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Pricing Box */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 sticky top-24">
            
            {/* Rating Summary */}
            <div className="space-y-1.5 border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {equipment.location}
                </span>
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {equipment.average_rating !== undefined ? Number(equipment.average_rating).toFixed(1) : (equipment.averageRating !== undefined ? Number(equipment.averageRating).toFixed(1) : '0.0')} ({equipment.num_reviews !== undefined ? equipment.num_reviews : (equipment.numReviews !== undefined ? equipment.numReviews : (equipment.reviews?.length || 0))} reviews)
                </span>
              </div>

              <h1 className="text-xl font-bold text-slate-900">{equipment.name}</h1>
            </div>

            {/* Pricing Rates */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">Daily Rental Fee</span>
                <span className="text-2xl font-bold text-green-700">
                  ₹{Number(dailyRent).toLocaleString()} <span className="text-xs font-normal text-slate-500">/ day</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                <span>Refundable Deposit</span>
                <span className="font-semibold text-slate-800">
                  ₹{Number(equipment.deposit || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Button Based on Role */}
            <div className="space-y-3">
              {isOwner ? (
                <div className="space-y-2">
                  <div className="text-xs text-green-800 bg-green-50 p-3 rounded-lg border border-green-200 text-center font-medium">
                    You are the listed owner of this equipment.
                  </div>
                  <Link 
                    to={`/equipment/${itemId}/edit`}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-lg border border-slate-200 transition flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit3 className="w-4 h-4 text-green-700" /> Edit Machine Details
                  </Link>
                </div>
              ) : isAvailable ? (
                <Link 
                  to={`/booking?equipmentId=${itemId}`}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-sm"
                >
                  <Calendar className="w-4 h-4" /> Book & Rent Machinery Now
                </Link>
              ) : (
                <button 
                  disabled
                  className="w-full bg-slate-100 text-slate-400 font-medium py-3 rounded-lg border border-slate-200 cursor-not-allowed text-sm"
                >
                  Currently Reserved / Unavailable
                </button>
              )}
            </div>

            {/* Verified Owner Contact Information Card */}
            {equipment.owner && (
              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Equipment Lender</div>
                
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-green-100 text-green-800 font-bold flex items-center justify-center border border-green-200 shrink-0">
                    {equipment.owner.name ? equipment.owner.name.charAt(0) : 'O'}
                  </div>
                  <div className="overflow-hidden space-y-0.5">
                    <div className="text-sm font-bold text-slate-900 truncate">{equipment.owner.name || 'Verified Lender'}</div>
                    {equipment.owner.location && (
                      <div className="text-xs text-slate-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {equipment.owner.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Customer Reviews Section */}
            {Array.isArray(equipment.reviews) && equipment.reviews.length > 0 && (
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="uppercase text-slate-500 tracking-wider">Farmer Reviews</span>
                  <span className="text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {equipment.reviews.length} Ratings
                  </span>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {equipment.reviews.map((rev, i) => (
                    <div key={rev._id || i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{rev.farmer?.name || 'Local Farmer'}</span>
                        <div className="flex text-amber-500">
                          {'★'.repeat(rev.rating || 5)}
                        </div>
                      </div>
                      <p className="text-slate-600 italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default EquipmentDetails;
