import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, ArrowLeft } from 'lucide-react';

function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mx-auto">
        <Tractor className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">404 - Page Not Found</h1>
      <p className="text-sm text-slate-600">The page or machinery you are looking for does not exist or has been relocated.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm transition"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Marketplace
      </Link>
    </div>
  );
}

export default NotFound;
