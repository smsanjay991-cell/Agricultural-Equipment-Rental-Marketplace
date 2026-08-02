import React from "react";
import { Link } from "react-router-dom";
import { Sprout, Phone, Mail, MapPin, Heart } from "lucide-react";

/**
 * Reusable Footer Component for AgriRent
 * Includes About, Contact, Privacy Policy, Terms & Conditions, Copyright.
 */
function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-emerald-500/20 pt-16 pb-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/40">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <Sprout className="w-5 h-5 text-slate-950 font-bold" />
              </div>
              <span className="text-2xl font-black tracking-tight gradient-text">
                AgriRent
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              India's premier agricultural equipment rental marketplace connecting farmers with machinery owners for affordable and timely farming operations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider mb-4 border-b border-emerald-800/40 pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#about" className="text-slate-400 hover:text-emerald-300 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#equipment" className="text-slate-400 hover:text-emerald-300 transition-colors">
                  Browse Equipment
                </a>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-emerald-300 transition-colors">
                  Become an Owner
                </Link>
              </li>
              <li>
                <Link to="/farmer" className="text-slate-400 hover:text-emerald-300 transition-colors">
                  Farmer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policy Links */}
          <div>
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider mb-4 border-b border-emerald-800/40 pb-2 inline-block">
              Legal & Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#privacy" className="text-slate-400 hover:text-emerald-300 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-slate-400 hover:text-emerald-300 transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#safety" className="text-slate-400 hover:text-emerald-300 transition-colors">
                  Owner Protection
                </a>
              </li>
              <li>
                <a href="#cancellation" className="text-slate-400 hover:text-emerald-300 transition-colors">
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider mb-4 border-b border-emerald-800/40 pb-2 inline-block">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 1800-AGRI-RENT (24/7 Toll Free)</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@agrirent.com</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AgriTech Tower, Punjab & Haryana Hub</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AgriRent. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built for empowering agriculture with</span>
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
