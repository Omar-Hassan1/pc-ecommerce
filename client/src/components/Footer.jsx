import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Mail, Phone, MapPin, ShieldCheck, Globe2, Truck, CreditCard, Send } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        const res = await api.post('/contact/newsletter', { email });
        showToast(res.message || 'Subscribed successfully!', 'success');
        setEmail('');
      } catch (err) {
        showToast(err.message || 'Failed to subscribe', 'error');
      }
    }
  };

  return (
    <footer className="bg-[#080b13] border-t border-gray-800/80 text-gray-400 mt-20">
      
      {/* Top Benefits Bar */}
      <div className="border-b border-gray-800/60 py-8 bg-gray-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl glass-card">
            <Globe2 className="w-8 h-8 text-blue-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Worldwide Delivery</h4>
              <p className="text-xs text-gray-400 mt-0.5">Express shipping to 120+ countries</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl glass-card">
            <ShieldCheck className="w-8 h-8 text-cyan-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Official Warranty</h4>
              <p className="text-xs text-gray-400 mt-0.5">Comprehensive hardware protection</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl glass-card">
            <Truck className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Certified Technicians</h4>
              <p className="text-xs text-gray-400 mt-0.5">Expert diagnostics & component repair</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl glass-card">
            <CreditCard className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Secure Checkout</h4>
              <p className="text-xs text-gray-400 mt-0.5">Encrypted 256-bit payment gateways</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand Column & Newsletter */}
        <div className="lg:col-span-2 space-y-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">{SITE_CONFIG.name}</span>
          </Link>
          <p className="text-xs leading-relaxed text-gray-400 max-w-sm">
            {SITE_CONFIG.tagline} Delivering custom engineered gaming PCs, laptops, enthusiast components, and worldwide computer repair services.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="space-y-2 max-w-md">
            <label className="text-xs font-semibold text-gray-300 block uppercase tracking-wider">
              Subscribe to Tech Deals & News
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Shop Navigation */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-gray-800 pb-2">
            Shop Store
          </h3>
          <ul className="space-y-2 text-xs">
            <li><Link to="/shop" className="hover:text-blue-400 transition-colors">All Products</Link></li>
            <li><Link to="/shop?category=gaming-pcs" className="hover:text-blue-400 transition-colors">Gaming Desktop PCs</Link></li>
            <li><Link to="/shop?category=laptops" className="hover:text-blue-400 transition-colors">Gaming Laptops</Link></li>
            <li><Link to="/shop?category=cpus" className="hover:text-blue-400 transition-colors">Processors (CPUs)</Link></li>
            <li><Link to="/shop?category=gpus" className="hover:text-blue-400 transition-colors">Graphics Cards (GPUs)</Link></li>
            <li><Link to="/pc-builder" className="hover:text-cyan-400 transition-colors font-medium">Custom PC Builder</Link></li>
          </ul>
        </div>

        {/* Repair & Customer Service */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-gray-800 pb-2">
            Repair & Tracking
          </h3>
          <ul className="space-y-2 text-xs">
            <li><Link to="/repair" className="hover:text-amber-400 transition-colors">Submit Repair Request</Link></li>
            <li><Link to="/repair/track" className="hover:text-amber-400 transition-colors">Track Repair Progress</Link></li>
            <li><Link to="/customer/dashboard?tab=orders" className="hover:text-blue-400 transition-colors">Order Tracking</Link></li>
            <li><Link to="/faq" className="hover:text-gray-200 transition-colors">Help Center & FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-gray-200 transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Company & Legal */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-gray-800 pb-2">
            Company & Policy
          </h3>
          <ul className="space-y-2 text-xs">
            <li><Link to="/about" className="hover:text-gray-200 transition-colors">About NEXORA</Link></li>
            <li><Link to="/faq" className="hover:text-gray-200 transition-colors">Warranty & Guarantee</Link></li>
            <li><Link to="/faq" className="hover:text-gray-200 transition-colors">Worldwide Shipping Policy</Link></li>
            <li><Link to="/faq" className="hover:text-gray-200 transition-colors">Returns & Refunds</Link></li>
            <li><Link to="/faq" className="hover:text-gray-200 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

      </div>

      {/* Bottom Legal & Payment Badges */}
      <div className="border-t border-gray-800/60 py-6 bg-[#05070d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved. Built for international high performance computing.</p>
          <div className="flex items-center gap-3">
            <span className="bg-gray-900 border border-gray-800 px-2.5 py-1 rounded text-[10px] font-bold text-gray-300">VISA</span>
            <span className="bg-gray-900 border border-gray-800 px-2.5 py-1 rounded text-[10px] font-bold text-gray-300">MasterCard</span>
            <span className="bg-gray-900 border border-gray-800 px-2.5 py-1 rounded text-[10px] font-bold text-blue-400">STRIPE</span>
            <span className="bg-gray-900 border border-gray-800 px-2.5 py-1 rounded text-[10px] font-bold text-yellow-400">PayPal</span>
            <span className="bg-gray-900 border border-gray-800 px-2.5 py-1 rounded text-[10px] font-bold text-amber-400">Bitcoin</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
