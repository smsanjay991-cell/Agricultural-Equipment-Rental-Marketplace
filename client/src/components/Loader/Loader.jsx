import React from 'react';
import { Tractor } from 'lucide-react';

const Loader = ({ message = "Loading agricultural data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin" />
        <Tractor className="w-6 h-6 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-xs text-slate-400 font-medium animate-pulse">{message}</p>
    </div>
  );
};

export default Loader;
