import React from 'react';
import { Tractor } from 'lucide-react';

const Loader = ({ message = "Loading agricultural data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-green-700 animate-spin" />
        <Tractor className="w-5 h-5 text-green-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-xs text-slate-500 font-medium">{message}</p>
    </div>
  );
};

export default Loader;
