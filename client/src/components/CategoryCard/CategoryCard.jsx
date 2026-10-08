import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, ArrowRight } from 'lucide-react';

const CategoryCard = ({ title, categoryKey, count, icon: Icon, description }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/equipment?category=${encodeURIComponent(categoryKey)}`);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      className="bg-white p-4 rounded-xl border border-slate-200 hover:border-green-600 hover:shadow-xs cursor-pointer group flex flex-col justify-between transition-all duration-150 text-left"
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center border border-green-100 group-hover:bg-green-100 transition-colors">
            {Icon ? <Icon className="w-4 h-4" /> : <Tractor className="w-4 h-4" />}
          </div>
          {typeof count === 'number' && count > 0 && (
            <span className="text-[11px] font-medium text-green-800 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">
              {count} available
            </span>
          )}
        </div>

        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-green-700 transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium group-hover:text-green-700">
        <span>View listings</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default CategoryCard;
