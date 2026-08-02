import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

/**
 * Reusable Input Component for AgriRent
 * Supports text, email, password, tel, and select inputs with labels, icons,
 * inline validation error messages, and show/hide password toggle.
 */
function Input({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon = null,
  required = false,
  className = "",
  disabled = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const actualType = isPasswordType ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={name} className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-amber-400 font-bold">*</span>}
          </span>
        </label>
      )}

      {/* Input Field Container */}
      <div className="relative flex items-center">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-emerald-400/80">
            <Icon className="w-4 h-4" />
          </div>
        )}

        {/* Text / Email / Password Input */}
        <input
          id={name}
          name={name}
          type={actualType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full py-2.5 text-sm bg-emerald-950/40 text-slate-100 placeholder-slate-500 rounded-xl border transition-all duration-200 focus:outline-none ${
            Icon ? "pl-10" : "pl-4"
          } ${isPasswordType ? "pr-10" : "pr-4"} ${
            error
              ? "border-rose-500/70 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40"
              : "border-emerald-800/40 hover:border-emerald-600/50 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          {...props}
        />

        {/* Password Show/Hide Toggle Button */}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-slate-400 hover:text-emerald-300 focus:outline-none p-1 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Inline Validation Error Message */}
      {error && (
        <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5 animate-in fade-in duration-150">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export default Input;
