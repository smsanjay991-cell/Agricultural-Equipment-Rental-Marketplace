import React from "react";
import { CalendarCheck, ShieldCheck, Tag, Headset, Sparkles } from "lucide-react";

/**
 * Reusable Features Component for AgriRent
 * Displays four core feature cards: Easy Booking, Verified Owners, Affordable Pricing, 24/7 Support.
 */
function Features() {
  const featuresList = [
    {
      id: "easy-booking",
      icon: CalendarCheck,
      title: "Easy Booking",
      description: "Book high-tech farming machinery in just a few clicks with flexible daily or hourly schedules.",
      badge: "Fast & Simple",
    },
    {
      id: "verified-owners",
      icon: ShieldCheck,
      title: "Verified Owners",
      description: "All machinery owners and equipment undergo strict identity and operational quality checks.",
      badge: "100% Safe",
    },
    {
      id: "affordable-pricing",
      icon: Tag,
      title: "Affordable Pricing",
      description: "Transparent competitive rates per day with zero hidden middleman commissions.",
      badge: "Best Value",
    },
    {
      id: "support-24-7",
      icon: Headset,
      title: "24/7 Support",
      description: "Round-the-clock dedicated customer care and instant field support during harvest seasons.",
      badge: "Always Available",
    },
  ];

  return (
    <section id="about" className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Choose AgriRent</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mb-4">
            Empowering Farmers With <span className="gradient-text">Smart Solutions</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            We bridge the gap between machinery owners and farmers, ensuring maximum efficiency during every crop season.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuresList.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="glass-card glass-card-hover p-6 md:p-8 rounded-2xl relative flex flex-col justify-between group"
              >
                <div>
                  {/* Card Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-slate-950 transition-all duration-300 shadow-lg shadow-emerald-950/50">
                      <Icon className="w-7 h-7 transition-transform group-hover:scale-110" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-900/40 text-emerald-300 border border-emerald-700/30">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Card Title & Description */}
                  <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-emerald-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle Accent Bar */}
                <div className="w-12 h-1 bg-emerald-500/40 rounded-full mt-6 group-hover:w-full group-hover:bg-emerald-400 transition-all duration-300" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Features;
