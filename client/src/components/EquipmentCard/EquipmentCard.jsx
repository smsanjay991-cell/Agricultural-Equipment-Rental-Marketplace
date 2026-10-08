import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Gauge, Fuel, ArrowRight, Eye, Tag } from 'lucide-react';
import { getImageUrl } from '../../services/api';

const EquipmentCard = ({ item }) => {
  const itemId = item._id || item.id;
  const rawImg = item.image || (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '');
  const imgSrc = getImageUrl(rawImg);
  const dailyRent = item.daily_rent !== undefined ? item.daily_rent : (item.dailyRent !== undefined ? item.dailyRent : (item.daily_rate || 0));
  const deposit = item.deposit || 0;
  
  const isAvailable = item.availability !== false && item.isAvailable !== false && item.is_available !== false && item.available !== false;
  const numReviews = Number(item.numReviews || item.num_reviews || 0);
  const rating = Number(item.averageRating || item.average_rating || 0);

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col justify-between group border border-slate-200 hover:border-green-600 hover:shadow-sm transition-all duration-200">
      
      {/* Equipment Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img 
          src={imgSrc} 
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-0.5 rounded-md border border-slate-200 text-xs font-semibold text-green-800 shadow-xs">
          {item.category || 'General'}
        </div>
        
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
            isAvailable ? 'bg-green-700 text-white' : 'bg-slate-700 text-white'
          }`}>
            {isAvailable ? 'Available' : 'Booked'}
          </span>
          {(item.isDriverAvailable || item.is_driver_available) && (
            <span className="bg-emerald-900/90 text-emerald-100 text-[9px] font-semibold px-1.5 py-0.5 rounded">
              Driver Option
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate max-w-[150px]">{item.location || 'Tamil Nadu'}</span>
            </span>
            {numReviews > 0 ? (
              <span className="flex items-center gap-1 text-amber-700 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                {rating.toFixed(1)} ({numReviews})
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">Verified Listing</span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-green-700 transition-colors line-clamp-1">
            {item.name}
          </h3>

          {(item.brand || item.model) && (
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{item.brand} {item.model}</span>
            </div>
          )}

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Specifications */}
          <div className="pt-2 flex items-center gap-4 text-xs text-slate-600 border-t border-slate-100">
            {item.horsepower > 0 && (
              <span className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-green-700 shrink-0" />
                {item.horsepower} HP
              </span>
            )}
            <span className="flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-green-700 shrink-0" />
              {item.fuelType || item.fuel_type || 'Diesel'}
            </span>
            {deposit > 0 && (
              <span className="text-slate-500">
                Deposit: <strong className="text-slate-700 font-semibold">₹{deposit}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">Daily Rent</span>
            <span className="text-lg font-bold text-green-700">
              ₹{Number(dailyRent).toLocaleString()}
            </span>
            <span className="text-xs text-slate-500"> / day</span>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              to={`/equipment/${itemId}`}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer border border-slate-200"
              title="View Machinery Details"
            >
              <Eye className="w-3.5 h-3.5" /> Details
            </Link>

            <Link 
              to={`/booking?equipmentId=${itemId}`}
              className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer"
            >
              Rent <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default EquipmentCard;
