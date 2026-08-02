import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";

/**
 * Modern Responsive Login Page for AgriRent
 * Features Agriculture Green Theme, Glassmorphism Card, Frontend Validation,
 * Show/Hide Password Toggle, Remember Me, Google Login UI, and Responsive Layout.
 */
function Login() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Validation Error State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear field error on typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Frontend Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submit Handler (Frontend only)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setSuccessMsg("Validation successful! Logging you in...");
      // Simulate quick frontend transition to farmer dashboard
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/farmer");
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Agriculture Green Aesthetics & Ambient Radial Glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-emerald-950/70 to-slate-950 -z-20" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:bg-emerald-900/40 text-xs font-semibold text-slate-300 hover:text-emerald-300 transition-all border border-emerald-500/20 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Main Glassmorphism Login Container */}
      <div className="w-full max-w-md my-12">
        <div className="glass-card p-6 sm:p-8 md:p-10 rounded-3xl border border-emerald-500/30 shadow-2xl backdrop-blur-2xl relative">
          
          {/* Header Brand Section */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 group mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-600/40 group-hover:scale-105 transition-transform">
                <Sprout className="w-7 h-7 text-slate-950 font-extrabold" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl font-black tracking-tight gradient-text">
                  AgriRent
                </span>
                <span className="text-[10px] font-semibold text-emerald-400/80 tracking-widest uppercase -mt-1 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Marketplace
                </span>
              </div>
            </Link>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-2">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Sign in to manage your bookings and equipment rentals
            </p>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            {/* Email Field */}
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="farmer@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              required
            />

            {/* Password Field with Show/Hide Eye Toggle */}
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={Lock}
              required
            />

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-slate-100">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-emerald-950 border-emerald-700 text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0 cursor-pointer accent-emerald-500"
                />
                <span>Remember me</span>
              </label>

              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Password reset link sent to your registered email (UI Demonstration).");
                }}
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Login Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={LogIn}
              disabled={isSubmitting}
              fullWidth
              className="mt-2 py-3.5 text-base shadow-emerald-600/30"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </Button>
          </form>

          {/* Divider line */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-800/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-400 font-semibold tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          {/* Continue with Google Button (UI only) */}
          <button
            type="button"
            onClick={() => alert("Google Single Sign-On clicked (UI Demonstration).")}
            className="w-full py-3 px-4 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 text-slate-200 hover:text-white text-sm font-semibold flex items-center justify-center gap-3 transition-all duration-200 shadow-sm group"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.6-1.5-1-3.2-1-5z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Don't have an account link */}
          <div className="mt-8 text-center text-xs sm:text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors hover:underline"
            >
              Register here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
