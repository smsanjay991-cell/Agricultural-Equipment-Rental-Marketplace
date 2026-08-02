import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sprout,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowLeft,
  Tractor,
  Wheat,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";

/**
 * Modern Responsive Register Page for AgriRent
 * Features Role Selection (Farmer / Equipment Owner), Full Name, Email, Phone,
 * Password, Confirm Password, Show/Hide toggles, Frontend Validation,
 * Glassmorphism Card, and React Router Link navigation.
 */
function Register() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "farmer", // Default role
  });

  // Password Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation & Submission States
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Handle Text/Select Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle Role Selection Card Click
  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  // Frontend Validation Logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit (Frontend only)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setSuccessMsg(`Account created successfully as ${formData.role === "farmer" ? "Farmer" : "Equipment Owner"}!`);
      
      // Simulate frontend redirect based on chosen role
      setTimeout(() => {
        setIsSubmitting(false);
        if (formData.role === "farmer") {
          navigate("/farmer");
        } else {
          navigate("/owner");
        }
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Agriculture Aesthetics */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-emerald-950/70 to-slate-950 -z-20" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-lime-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:bg-emerald-900/40 text-xs font-semibold text-slate-300 hover:text-emerald-300 transition-all border border-emerald-500/20 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Main Glassmorphism Register Container */}
      <div className="w-full max-w-lg my-12">
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
              Create Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Join AgriRent to rent or list agricultural machinery
            </p>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Select Your Role <span className="text-amber-400 font-bold">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Farmer Option Card */}
                <div
                  onClick={() => handleRoleSelect("farmer")}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col items-center gap-2 text-center ${
                    formData.role === "farmer"
                      ? "bg-emerald-900/60 border-emerald-400 shadow-md shadow-emerald-950/50 text-emerald-200"
                      : "bg-emerald-950/30 border-emerald-800/40 text-slate-400 hover:border-emerald-700/60 hover:text-slate-200"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400">
                    <Wheat className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-100">Farmer</div>
                    <div className="text-[10px] text-slate-400">Rent Machinery</div>
                  </div>
                </div>

                {/* Owner Option Card */}
                <div
                  onClick={() => handleRoleSelect("owner")}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col items-center gap-2 text-center ${
                    formData.role === "owner"
                      ? "bg-emerald-900/60 border-emerald-400 shadow-md shadow-emerald-950/50 text-emerald-200"
                      : "bg-emerald-950/30 border-emerald-800/40 text-slate-400 hover:border-emerald-700/60 hover:text-slate-200"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-950 flex items-center justify-center text-amber-400">
                    <Tractor className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-100">Equipment Owner</div>
                    <div className="text-[10px] text-slate-400">List & Earn</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Name Field */}
            <Input
              label="Full Name"
              name="fullName"
              placeholder="e.g. Gurpreet Singh"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              icon={User}
              required
            />

            {/* Email Address Field */}
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

            {/* Phone Number Field */}
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              icon={Phone}
              required
            />

            {/* Password Field */}
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

            {/* Confirm Password Field */}
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={Lock}
              required
            />

            {/* Create Account Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={UserPlus}
              disabled={isSubmitting}
              fullWidth
              className="mt-4 py-3.5 text-base shadow-emerald-600/30"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Already Have An Account Link */}
          <div className="mt-8 text-center text-xs sm:text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors hover:underline"
            >
              Login here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;
