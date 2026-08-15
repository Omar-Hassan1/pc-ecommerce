import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order Support',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/contact/submit', formData);
      if (res.success) {
        showToast(res.message, 'success');
        setFormData({ name: '', email: '', phone: '', subject: 'Order Support', message: '' });
      }
    } catch (err) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Get In Touch</span>
        <h1 className="text-3xl font-extrabold text-white">Customer Support & Technical Inquiries</h1>
        <p className="text-xs text-gray-400">Have questions about an order, custom PC build, or repair status? We are here 24/7.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Info */}
        <div className="space-y-4 lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Email Support</p>
                <p className="text-gray-400">{SITE_CONFIG.supportEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Toll-Free Phone</p>
                <p className="text-gray-400">{SITE_CONFIG.supportPhone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Global Headquarters</p>
                <p className="text-gray-400">100 Technology Parkway, Suite 500, Tech City</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-[#131b2e] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Inquiry Subject *</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Order Support">Order Support</option>
                  <option value="Repair Support">Repair Service Support</option>
                  <option value="Product Question">Product Technical Question</option>
                  <option value="Shipping">Shipping & International Delivery</option>
                  <option value="Returns">Warranty & Returns</option>
                  <option value="Other">Other Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1">Message Details *</label>
              <textarea
                required
                rows="5"
                placeholder="How can our tech team assist you today?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 blue-glow"
            >
              <Send className="w-4 h-4" /> {submitting ? 'Sending...' : 'Send Support Message'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
