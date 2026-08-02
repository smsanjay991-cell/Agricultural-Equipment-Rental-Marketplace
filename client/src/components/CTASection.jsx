import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sprout, Tractor, CheckCircle2 } from "lucide-react";
import Button from "./Button";

/**
 * Reusable CTASection Component for AgriRent
 * Heading: "Ready to Rent?"
 * Button: "Explore Equipment"
 */
function CTASection() {
  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Radial Background Accent Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-card p-8 md:p-14 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/90 via-slate-950/90 to-emerald-950/90 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-xs font-semibold text-emerald-300 mb-6">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Start Your Rental Journey Today</span>
            </div>

            {/* Main CTA Heading */}
            <h2 className="text-4xl sm:text-5xl font-black text-slate-100 tracking-tight mb-6 leading-tight">
              Ready to <span className="gradient-text">Rent?</span>
            </h2>

            {/* CTA Subheading */}
            <p className="text-slate-300 text-base sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              Join thousands of farmers saving machinery costs and equipment owners earning steady passive income today.
            </p>

            {/* Benefit Checkmarks */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-300 font-medium mb-10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Upfront Listing Fee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Online Confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Machine Inspection</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#equipment" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto px-9">
                  Explore Equipment
                </Button>
              </a>
              <Link to="/register" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" icon={Tractor} className="w-full sm:w-auto px-8">
                  List Your Machine
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
