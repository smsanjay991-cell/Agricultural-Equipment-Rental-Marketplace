import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, ShieldCheck, Phone, Mail, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <Tractor className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">AgriRent</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Empowering farmers and equipment owners with seamless, on-demand machinery rentals, transparent rates, and trusted local availability.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" /> Verified Equipment & Operators
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-200 tracking-wider mb-4">Platform Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/equipment" className="hover:text-emerald-400 transition">Browse Equipment</Link></li>
              <li><Link to="/farmer-dashboard" className="hover:text-emerald-400 transition">Farmer Dashboard</Link></li>
              <li><Link to="/owner-dashboard" className="hover:text-emerald-400 transition">List Your Equipment</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition">Account Sign In</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-200 tracking-wider mb-4">Equipment Categories</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/equipment?category=Tractor" className="hover:text-emerald-400 transition">Heavy Tractors (35-75+ HP)</Link></li>
              <li><Link to="/equipment?category=Harvester" className="hover:text-emerald-400 transition">Combine Harvesters</Link></li>
              <li><Link to="/equipment?category=Tiller" className="hover:text-emerald-400 transition">Rotavators & Cultivators</Link></li>
              <li><Link to="/equipment?category=Seeder" className="hover:text-emerald-400 transition">Precision Seeders & Planters</Link></li>
              <li><Link to="/equipment?category=Sprayer" className="hover:text-emerald-400 transition">Boom & Power Sprayers</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-200 tracking-wider mb-4">Support & Contact</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 1800-AGRI-RENT (24x7 Support)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@agrirent.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>AgriTech Innovation Hub, Ludhiana / Karnal / New Delhi</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 AgriRent Platform. All Rights Reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with innovation for Indian Agriculture</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
