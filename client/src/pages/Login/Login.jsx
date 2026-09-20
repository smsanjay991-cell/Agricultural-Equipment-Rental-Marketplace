import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Tractor, Lock, Mail, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

const Login = () => {
  const { login, error: authError, loading, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [demoLoadingRole, setDemoLoadingRole] = useState(null);

  const redirectByRole = (userObj) => {
    const role = (userObj?.role || '').toLowerCase();
    if (role === 'owner') navigate('/owner-dashboard');
    else if (role === 'admin') navigate('/admin-dashboard');
    else navigate('/farmer-dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userObj = await login(email, password);
      redirectByRole(userObj);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    }
  };

  const handleDemoSignIn = async (role) => {
    const demoEmail = `${role}@agrirent.com`;
    const demoPassword = 'password123';
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setDemoLoadingRole(role);

    try {
      // Try backend authentication first
      const userObj = await login(demoEmail, demoPassword);
      setDemoLoadingRole(null);
      redirectByRole(userObj);
    } catch (err) {
      console.warn('Backend login fallback to demo role:', err);
      // Fallback to offline demo mode role switcher
      const demoUser = switchDemoRole(role);
      setDemoLoadingRole(null);
      redirectByRole(demoUser);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 w-full max-w-md space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Tractor className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">Sign in to manage rentals and machinery requests</p>
        </div>

        {(error || authError) && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium">
            {error || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="email"
                required
                placeholder="farmer@agrirent.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || demoLoadingRole !== null}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading && !demoLoadingRole ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Fast Demo Sign In Buttons */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-500 font-semibold uppercase text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Fast Demo Sign In
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button 
              type="button"
              disabled={loading || demoLoadingRole !== null}
              onClick={() => handleDemoSignIn('farmer')} 
              className="px-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 border border-slate-700 text-center font-medium cursor-pointer transition flex items-center justify-center gap-1.5"
            >
              {demoLoadingRole === 'farmer' ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : '🌾 Farmer'}
            </button>
            <button 
              type="button"
              disabled={loading || demoLoadingRole !== null}
              onClick={() => handleDemoSignIn('owner')} 
              className="px-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 border border-slate-700 text-center font-medium cursor-pointer transition flex items-center justify-center gap-1.5"
            >
              {demoLoadingRole === 'owner' ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : '🚜 Owner'}
            </button>
            <button 
              type="button"
              disabled={loading || demoLoadingRole !== null}
              onClick={() => handleDemoSignIn('admin')} 
              className="px-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 border border-slate-700 text-center font-medium cursor-pointer transition flex items-center justify-center gap-1.5"
            >
              {demoLoadingRole === 'admin' ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : '🛡️ Admin'}
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;

