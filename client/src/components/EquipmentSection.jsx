import React from "react";
import { Star, MapPin, Gauge, Shield, ArrowRight, Zap } from "lucide-react";
import Button from "./Button";

/**
 * Reusable EquipmentSection Component for AgriRent
 * Shows sample equipment cards for Tractor, Harvester, Rotavator, Sprayer.
 */
function EquipmentSection() {
  const sampleEquipment = [
    {
      id: "eq-1",
      name: "Mahindra 575 DI Tractor",
      category: "Tractor",
      price: "₹1,800",
      unit: "day",
      hp: "45 HP",
      location: "Ludhiana, Punjab",
      rating: 4.9,
      reviews: 28,
      verified: true,
      // High-quality SVG illustration placeholder for Tractor
      imageBg: "from-emerald-900/60 to-slate-900",
      iconColor: "#10b981",
      svgType: "tractor",
    },
    {
      id: "eq-2",
      name: "John Deere Combine Harvester",
      category: "Harvester",
      price: "₹4,500",
      unit: "day",
      hp: "75 HP",
      location: "Karnal, Haryana",
      rating: 5.0,
      reviews: 42,
      verified: true,
      imageBg: "from-amber-950/60 to-slate-900",
      iconColor: "#f59e0b",
      svgType: "harvester",
    },
    {
      id: "eq-3",
      name: "Heavy Duty Rotary Tiller",
      category: "Rotavator",
      price: "₹1,200",
      unit: "day",
      hp: "7 Feet",
      location: "Ambala, Haryana",
      rating: 4.8,
      reviews: 19,
      verified: true,
      imageBg: "from-emerald-950/60 to-slate-900",
      iconColor: "#84cc16",
      svgType: "rotavator",
    },
    {
      id: "eq-4",
      name: "Boom Power Sprayer 500L",
      category: "Sprayer",
      price: "₹950",
      unit: "day",
      hp: "500 L Tank",
      location: "Nashik, Maharashtra",
      rating: 4.9,
      reviews: 31,
      verified: true,
      imageBg: "from-teal-950/60 to-slate-900",
      iconColor: "#14b8a6",
      svgType: "sprayer",
    },
  ];

  return (
    <section id="equipment" className="py-20 bg-slate-950/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-400 mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Available Near You</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              Featured <span className="gradient-text">Agricultural Equipment</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Inspect top-performing machinery ready for instant booking at competitive daily rates.
            </p>
          </div>

          <a href="#equipment">
            <Button variant="outline" size="md" icon={ArrowRight} iconPosition="right">
              View All Equipment
            </Button>
          </a>
        </div>

        {/* 4 Sample Equipment Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleEquipment.map((item) => (
            <div
              key={item.id}
              className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Equipment Image Placeholder Box */}
                <div className={`relative h-48 bg-gradient-to-br ${item.imageBg} flex items-center justify-center p-6 border-b border-emerald-500/10 overflow-hidden`}>
                  {/* Verified Badge */}
                  {item.verified && (
                    <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3 text-emerald-400" />
                      <span>Verified</span>
                    </div>
                  )}

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{item.rating} ({item.reviews})</span>
                  </div>

                  {/* SVG Equipment Placeholder Icon Graphic */}
                  <div className="group-hover:scale-110 transition-transform duration-300 flex flex-col items-center gap-2">
                    <svg
                      className="w-20 h-20 opacity-80 group-hover:opacity-100 transition-opacity"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={item.iconColor}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {item.svgType === "tractor" && (
                        <>
                          <circle cx="7" cy="17" r="4" />
                          <circle cx="18" cy="17" r="2" />
                          <path d="M7 17h11" />
                          <path d="M5 13V8h5l3 3h4v2" />
                          <path d="M12 8v5" />
                        </>
                      )}
                      {item.svgType === "harvester" && (
                        <>
                          <circle cx="6" cy="17" r="3" />
                          <circle cx="17" cy="17" r="3" />
                          <path d="M3 12h18v3H3z" />
                          <path d="M5 12V6h10l4 6" />
                        </>
                      )}
                      {item.svgType === "rotavator" && (
                        <>
                          <rect x="3" y="10" width="18" height="6" rx="2" />
                          <path d="M6 16v3M10 16v3M14 16v3M18 16v3" />
                          <path d="M12 5v5" />
                        </>
                      )}
                      {item.svgType === "sprayer" && (
                        <>
                          <path d="M12 2v4M8 6h8v8a4 4 0 01-8 0V6z" />
                          <path d="M4 18h16" />
                          <path d="M6 14l-2 4M18 14l2 4" />
                        </>
                      )}
                    </svg>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest bg-slate-900/60 px-3 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1 mb-2">
                    {item.name}
                  </h3>

                  {/* Specifications & Location */}
                  <div className="space-y-2 mb-4 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Specs:
                      </span>
                      <span className="font-semibold text-slate-200">{item.hp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Location:
                      </span>
                      <span className="font-medium text-slate-300">{item.location}</span>
                    </div>
                  </div>

                  {/* Price Banner */}
                  <div className="flex items-baseline justify-between pt-3 border-t border-emerald-800/30 mb-4">
                    <span className="text-xs font-medium text-slate-400">Rental Rate</span>
                    <div>
                      <span className="text-xl font-extrabold text-amber-400">{item.price}</span>
                      <span className="text-xs text-slate-400"> / {item.unit}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Now Action Button */}
              <div className="p-5 pt-0">
                <Button variant="primary" size="md" fullWidth>
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default EquipmentSection;
