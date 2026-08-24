import React from 'react';
import { ShieldCheck, Cpu, Globe2, Wrench, Award, Users } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">About NEXORA COMPUTERS</span>
        <h1 className="text-4xl font-extrabold text-white">Powering World-Class Computing Since 2018</h1>
        <p className="text-sm text-gray-300 leading-relaxed">
          {SITE_CONFIG.name} is a premier international technology retailer and certified computer repair laboratory. We build custom enthusiast gaming rigs, distribute top-tier PC components worldwide, and provide IPC-certified hardware diagnosis.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 space-y-3">
          <Award className="w-8 h-8 text-blue-400" />
          <h3 className="text-base font-bold text-white">Enthusiast Build Quality</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Every custom gaming computer is individually hand-assembled, thermal optimized, cable managed, and stress-tested for 48 hours before international dispatch.
          </p>
        </div>
        <div className="glass-card rounded-2xl p-6 space-y-3">
          <Wrench className="w-8 h-8 text-amber-400" />
          <h3 className="text-base font-bold text-white">Certified Technicians</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Our repair laboratory features ESD-safe workstations, BGA rework stations, thermal imaging cameras, and component-level micro-soldering capabilities.
          </p>
        </div>
        <div className="glass-card rounded-2xl p-6 space-y-3">
          <Globe2 className="w-8 h-8 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Global Express Logistics</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Partnered with DHL Express and FedEx International to deliver high-value technology securely to over 120 countries.
          </p>
        </div>
      </div>

    </div>
  );
}
