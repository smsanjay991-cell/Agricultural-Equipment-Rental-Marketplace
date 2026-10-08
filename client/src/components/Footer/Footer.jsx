import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto bg-slate-900 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center text-white shadow-xs">
                <Tractor className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">AgriRent</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Equipment rental made simple for farmers and equipment owners.
            </p>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-200 tracking-wider mb-3">Explore Marketplace</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/equipment" className="hover:text-white transition">Browse Equipment</Link>
              </li>
              <li>
                <Link to="/equipment/new" className="hover:text-white transition">List Equipment</Link>
              </li>
              <li>
                <Link to="/owner-dashboard" className="hover:text-white transition">Owner Dashboard</Link>
              </li>
              <li>
                <Link to="/user-dashboard" className="hover:text-white transition">User Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-200 tracking-wider mb-3">Equipment Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/equipment?category=Tractor" className="hover:text-white transition">Tractors</Link>
              </li>
              <li>
                <Link to="/equipment?category=Harvester" className="hover:text-white transition">Combine Harvesters</Link>
              </li>
              <li>
                <Link to="/equipment?category=Tiller" className="hover:text-white transition">Tillers & Rotavators</Link>
              </li>
              <li>
                <Link to="/equipment?category=Seeder" className="hover:text-white transition">Seeders & Planters</Link>
              </li>
              <li>
                <Link to="/equipment?category=Sprayer" className="hover:text-white transition">Power Sprayers</Link>
              </li>
            </ul>
          </div>

          {/* Direct Support */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-200 tracking-wider mb-3">Support & Help</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-green-500 shrink-0" />
                <span>1800-AGRI-RENT</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-green-500 shrink-0" />
                <span>support@agrirent.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                <span>Tamil Nadu, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-3">
          <p>© 2026 AgriRent. Agricultural Equipment Marketplace.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/equipment" className="hover:text-slate-300 transition">Catalog</Link>
            <Link to="/login" className="hover:text-slate-300 transition">Sign In</Link>
            <Link to="/register" className="hover:text-slate-300 transition">Register</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
