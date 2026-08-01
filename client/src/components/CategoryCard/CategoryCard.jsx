import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, Wrench, Shield, ArrowRight } from 'lucide-react';

const CategoryCard = ({ title, categoryKey, count, icon: Icon, description }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/equipment?category=${categoryKey}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 cursor-pointer space-y-4 group flex flex-col justify-between"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
            {Icon ? <Icon className="w-6 h-6" /> : <Tractor className="w-6 h-6" />}
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full">
            {count || '10+'} Machines
          </span>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed">
          {description || `Browse available ${title.toLowerCase()} listings at competitive daily rates.`}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-semibold group-hover:text-emerald-400">
        <span>Explore Category</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default CategoryCard;
