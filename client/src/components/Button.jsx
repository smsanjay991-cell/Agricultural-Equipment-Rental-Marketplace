import React from "react";

/**
 * Reusable Button Component for AgriRent
 * Supports multiple variants, sizes, icon positioning, and full width rendering.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon = null,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  type = "button",
  disabled = false,
  onClick,
  ...props
}) {
  // Base classes for consistent interactive feel
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98 select-none";

  // Variant mappings tailored for the dark green theme
  const variants = {
    primary:
      "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-900/40 hover:shadow-emerald-600/30 border border-emerald-400/30",
    secondary:
      "bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-200 border border-emerald-700/50 hover:border-emerald-500/60 shadow-md",
    outline:
      "bg-transparent text-emerald-300 hover:text-white border border-emerald-600/40 hover:border-emerald-400 hover:bg-emerald-900/30",
    ghost:
      "bg-transparent text-slate-300 hover:text-emerald-300 hover:bg-emerald-950/40",
    amber:
      "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-900/40 border border-amber-400/40",
    danger:
      "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/40 border border-rose-400/30",
  };

  // Size variants
  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5 font-semibold",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${widthClass} ${className}`}
      {...props}
    >
      {Icon && iconPosition === "left" && (
        <Icon className={size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
      )}
      <span>{children}</span>
      {Icon && iconPosition === "right" && (
        <Icon className={size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
      )}
    </button>
  );
}

export default Button;
