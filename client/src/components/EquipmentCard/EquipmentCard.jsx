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

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group border border-slate-800 hover:border-emerald-500/50 transition duration-300">
      
      {/* Equipment Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <img 
          src={imgSrc} 
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-xs font-semibold text-emerald-400">
          {item.category || 'General'}
        </div>
        
        {(item.isDriverAvailable || item.is_driver_available) && (
          <div className="absolute top-3 right-3 bg-emerald-600/90 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-md">
            Operator Included
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {item.location}
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {item.averageRating || item.average_rating || '4.8'} ({item.numReviews || item.num_reviews || '10'})
            </span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
            {item.name}
          </h3>

          {(item.brand || item.model) && (
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Tag className="w-3 h-3 text-emerald-400" />
              <span>{item.brand} {item.model}</span>
            </div>
          )}

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Quick Specifications */}
          <div className="pt-2 flex items-center gap-4 text-xs text-slate-300 border-t border-slate-800/80">
            {item.horsepower > 0 && (
              <span className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                {item.horsepower} HP
              </span>
            )}
            <span className="flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-emerald-400" />
              {item.fuelType || item.fuel_type || 'Diesel'}
            </span>
            {deposit > 0 && (
              <span className="text-slate-400">
                Deposit: <strong className="text-slate-200">₹{deposit}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">Daily Rent</span>
            <span className="text-xl font-extrabold text-emerald-400">
              ₹{Number(dailyRent).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400"> / day</span>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              to={`/equipment/${itemId}`}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer border border-slate-700"
              title="View Machinery Details"
            >
              <Eye className="w-3.5 h-3.5" /> Specs
            </Link>

            <Link 
              to={`/booking?equipmentId=${itemId}`}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-1 cursor-pointer"
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

