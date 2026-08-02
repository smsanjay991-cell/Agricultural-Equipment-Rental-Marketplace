import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sprout, Menu, X, User, LogIn, UserPlus, Sparkles } from "lucide-react";
import Button from "./Button";

/**
 * Reusable Navbar Component for AgriRent
 * Includes Logo, Navigation Links, Login/Register buttons, and Mobile Drawer.
 */
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Equipment", path: "/#equipment" },
    { name: "About", path: "/#about" },
    { name: "Contact", path: "/#contact" },
  ];

  const isActive = (path) => {
    return location.pathname === path || (path !== "/" && location.hash === path.replace("/", ""));
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight gradient-text">
                AgriRent
              </span>
              <span className="text-[10px] font-semibold text-emerald-400/80 tracking-widest uppercase -mt-1 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-emerald-950/40 p-1.5 rounded-full border border-emerald-500/15">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-slate-300 hover:text-emerald-300 hover:bg-emerald-900/30"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="md" icon={LogIn}>
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="md" icon={UserPlus}>
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-300 hover:text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-emerald-500/20 px-4 pt-4 pb-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-medium text-slate-200 hover:text-emerald-300 hover:bg-emerald-900/40 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-emerald-800/40 flex flex-col gap-3">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="md" icon={LogIn} fullWidth>
                Login
              </Button>
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" icon={UserPlus} fullWidth>
                Register
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
