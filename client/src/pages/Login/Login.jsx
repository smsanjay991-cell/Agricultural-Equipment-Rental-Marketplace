import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Tractor, Lock, Mail, ArrowRight, Shield, ChevronDown, 
  Loader2, Eye, EyeOff, AlertCircle, Check, Phone, X, ShieldCheck 
} from 'lucide-react';

const Login = () => {
  const { user, login, error: authError, loading } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showForgotModal, setShowForgotModal] = useState(false);

  // If already authenticated, redirect to appropriate role dashboard
  useEffect(() => {
    if (user) {
      redirectByRole(user);
    }
  }, [user]);

  const redirectByRole = (userObj) => {
    const userRole = (userObj?.role || '').toLowerCase();
    if (userRole === 'owner') navigate('/owner-dashboard');
    else if (userRole === 'admin') navigate('/admin-dashboard');
    else navigate('/user-dashboard');
  };

  const validateForm = () => {
    const errors = {};

    if (!role) {
      errors.role = 'Please select your role.';
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = 'Please enter your email address.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errors.email = 'Please enter a valid email address.';
      }
    }

    if (!password) {
      errors.password = 'Please enter your password.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    const isValid = validateForm();
    if (!isValid) return;

    try {
      const userObj = await login(email.trim(), password, role);
      redirectByRole(userObj);
    } catch (err) {
      setError(err.message || 'Invalid role or credentials. Please check your details and try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      
      {/* Main Container Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Mobile Top Brand Banner (Stacked on mobile screens) */}
        <div className="lg:hidden bg-green-800 text-white p-6 text-center space-y-1.5">
          <div className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Tractor className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">AgriRent</span>
          </div>
          <p className="text-xs text-green-100/90 max-w-xs mx-auto">
            Find and rent the farm equipment you need from local equipment owners.
          </p>
        </div>

        {/* Left Column: Authentic Brand & Value Panel (Spacious Desktop) */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-between p-10 bg-green-800 text-white">
          
          <div className="space-y-8">
            {/* Brand Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow-xs">
                <Tractor className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">AgriRent</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-green-200">
                  Equipment Marketplace
                </span>
              </div>
            </div>

            {/* Short Headline & Narrative */}
            <div className="space-y-3 pt-2">
              <h2 className="text-2xl font-bold text-white leading-snug">
                Empowering Agriculture with Better Equipment Access
              </h2>
              <p className="text-xs sm:text-sm text-green-100/90 leading-relaxed font-normal">
                Find and rent the farm equipment you need from local equipment owners.
              </p>
            </div>

            {/* 2 Subtle Small Text Points */}
            <div className="pt-2 space-y-2.5 text-xs text-green-100">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-300 shrink-0" />
                <span>Local equipment</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-300 shrink-0" />
                <span>Clear rental details</span>
              </div>
            </div>
          </div>

          {/* Minimal Bottom Info */}
          <div className="pt-6 border-t border-white/10 text-[11px] text-green-200/70">
            AgriRent Equipment Platform
          </div>

        </div>

        {/* Right Column: Centered Production Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-12 flex flex-col justify-center items-center bg-white">
          
          <div className="w-full max-w-[420px] mx-auto space-y-6">
            
            {/* Centered Heading & Subtitle */}
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Sign in to your account
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Select your account role and enter your credentials to continue.
              </p>
            </div>

            {/* Global Error Banner */}
            {(error || authError) && (
              <div 
                role="alert"
                className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2.5 shadow-xs"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">
                  {error || authError}
                </span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
              
              {/* 1. Role Selector */}
              <div>
                <label 
                  htmlFor="login-role"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    id="login-role"
                    name="role"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      if (fieldErrors.role) {
                        setFieldErrors(prev => ({ ...prev, role: undefined }));
                      }
                      if (error) setError('');
                    }}
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.role)}
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-lg text-xs appearance-none cursor-pointer transition focus:bg-white focus:outline-none focus:ring-1 ${
                      fieldErrors.role 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-slate-300 focus:border-green-600 focus:ring-green-600'
                    } ${!role ? 'text-slate-400' : 'text-slate-900 font-medium'}`}
                  >
                    <option value="" disabled>Select your role</option>
                    <option value="user">User</option>
                    <option value="owner">Equipment Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {fieldErrors.role && (
                  <p className="mt-1 text-[11px] text-red-600 font-medium">{fieldErrors.role}</p>
                )}
              </div>

              {/* 2. Email Address */}
              <div>
                <label 
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input 
                    type="email"
                    id="login-email"
                    name="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors(prev => ({ ...prev, email: undefined }));
                      }
                      if (error) setError('');
                    }}
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.email)}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-lg text-xs text-slate-900 placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-1 ${
                      fieldErrors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-slate-300 focus:border-green-600 focus:ring-green-600'
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-[11px] text-red-600 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              {/* 3. Password */}
              <div>
                <label 
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors(prev => ({ ...prev, password: undefined }));
                      }
                      if (error) setError('');
                    }}
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.password)}
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-lg text-xs text-slate-900 placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-1 ${
                      fieldErrors.password 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-slate-300 focus:border-green-600 focus:ring-green-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-[11px] text-red-600 font-medium">{fieldErrors.password}</p>
                )}
              </div>

              {/* 4. Forgot Password Link */}
              <div className="flex items-center justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-green-700 hover:text-green-800 hover:underline cursor-pointer transition font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {/* 5. Sign In Button */}
              <button
                type="submit"
                id="login-submit-btn"
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 text-white text-xs font-semibold py-2.5 rounded-lg shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Signing In...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* 6. Register Link */}
            <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
              Don't have an account?{' '}
              <Link 
                to={role ? `/register?role=${role}` : '/register'}
                className="text-green-700 font-semibold hover:underline"
              >
                Register here
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* Real Password Recovery Support Modal */}
      {showForgotModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-modal-title"
        >
          <div className="bg-white p-6 rounded-2xl border border-slate-200 max-w-md w-full space-y-4 shadow-xl relative">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center border border-green-100">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 id="forgot-modal-title" className="text-sm font-bold text-slate-900">
                  Account Password Recovery
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowForgotModal(false)}
                aria-label="Close dialog"
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              For agricultural security and account verification, password resets are coordinated directly through our verified customer support desk.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-slate-700">
                <Phone className="w-4 h-4 text-green-700 shrink-0" />
                <div>
                  <span className="block text-slate-500 text-[10px]">Toll-Free Support Line</span>
                  <strong className="text-slate-900 font-semibold">+91 1800-AGRI-RENT (24x7)</strong>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700 border-t border-slate-200/60 pt-2.5">
                <Mail className="w-4 h-4 text-green-700 shrink-0" />
                <div>
                  <span className="block text-slate-500 text-[10px]">Direct Support Email</span>
                  <strong className="text-slate-900 font-semibold font-mono">support@agrirent.com</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer shadow-xs"
              >
                Understood, Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
