import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Upload, ShieldCheck, CheckCircle2, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function RepairServicePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: user ? `${user.firstName} ${user.lastName}` : '',
    email: user ? user.email : '',
    phone: user ? user.phone || '' : '',
    country: 'United States',
    deviceType: 'Gaming PC',
    brand: '',
    model: '',
    serialNumber: '',
    problemCategory: 'GPU problem',
    problemDescription: '',
    hasBeenRepairedBefore: 'false'
  });

  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const problemCategories = [
    'Does not turn on',
    'Overheating',
    'Broken screen',
    'Slow performance',
    'Blue screen',
    'Storage problem',
    'Battery problem',
    'Keyboard problem',
    'GPU problem',
    'Internet/Wi-Fi problem',
    'Virus/Malware',
    'Data recovery',
    'Upgrade request',
    'Other'
  ];

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      if (selected.length > 5) {
        showToast('Maximum 5 photo/screenshot attachments allowed', 'error');
        return;
      }
      setFiles(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        payload.append(key, formData[key]);
      });

      files.forEach(file => {
        payload.append('attachments', file);
      });

      const res = await api.post('/repairs', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.success) {
        showToast(`Repair Ticket #${res.data.repairNumber} created!`, 'success');
        navigate(`/repair/track?repairNumber=${res.data.repairNumber}&email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit repair request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950 via-gray-900 to-gray-950 border border-amber-500/30 p-8 sm:p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto">
          <Wrench className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Worldwide Computer Repair Service</h1>
        <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
          Submit your laptop, gaming PC, or workstation for certified diagnosis. Receive an itemized online quotation with live ticket tracking.
        </p>
      </div>

      {/* 8 Step Workflow Guide */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-white text-center">How Our Repair Service Works</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#131b2e] border border-gray-800 rounded-2xl space-y-2">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center">1</span>
            <h4 className="font-bold text-white">Submit Request</h4>
            <p className="text-gray-400 text-[11px]">Fill out device details & upload photos below.</p>
          </div>
          <div className="p-4 bg-[#131b2e] border border-gray-800 rounded-2xl space-y-2">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center">2</span>
            <h4 className="font-bold text-white">Receive Instructions</h4>
            <p className="text-gray-400 text-[11px]">Get shipping label and drop-off instructions.</p>
          </div>
          <div className="p-4 bg-[#131b2e] border border-gray-800 rounded-2xl space-y-2">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center">3</span>
            <h4 className="font-bold text-white">Technician Diagnosis</h4>
            <p className="text-gray-400 text-[11px]">Hardware inspection in certified lab.</p>
          </div>
          <div className="p-4 bg-[#131b2e] border border-gray-800 rounded-2xl space-y-2">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center">4</span>
            <h4 className="font-bold text-white">Approve Quotation</h4>
            <p className="text-gray-400 text-[11px]">Approve or reject transparent parts & labor quote.</p>
          </div>
        </div>
      </div>

      {/* Repair Request Form */}
      <div className="max-w-3xl mx-auto bg-[#131b2e] border border-gray-800 rounded-3xl p-6 sm:p-10 space-y-8">
        
        <div className="border-b border-gray-800 pb-4">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" /> Submit Computer Repair Form
          </h2>
          <p className="text-xs text-gray-400 mt-1">Please provide accurate hardware details for fast turnaround.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">1. Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
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
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>
          </div>

          {/* Device Specification */}
          <div className="space-y-4 pt-4 border-t border-gray-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">2. Device Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Device Type *</label>
                <select
                  value={formData.deviceType}
                  onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop PC">Desktop PC</option>
                  <option value="Gaming PC">Gaming PC</option>
                  <option value="Mac">Mac / Apple</option>
                  <option value="Other">Other Custom Rig</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ASUS, MSI, Custom, Apple..."
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Model Name / Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ROG Strix SCAR 18..."
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Serial Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. SN-9981-XXXX"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>
          </div>

          {/* Problem Details */}
          <div className="space-y-4 pt-4 border-t border-gray-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">3. Problem Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Problem Category *</label>
                <select
                  value={formData.problemCategory}
                  onChange={(e) => setFormData({ ...formData, problemCategory: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                >
                  {problemCategories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Has device been repaired before? *</label>
                <select
                  value={formData.hasBeenRepairedBefore}
                  onChange={(e) => setFormData({ ...formData, hasBeenRepairedBefore: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                >
                  <option value="false">No (Original Factory State)</option>
                  <option value="true">Yes (Previously Repaired)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1">Detailed Problem Description *</label>
              <textarea
                required
                rows="4"
                placeholder="Describe exact symptoms, error codes, when the issue occurs..."
                value={formData.problemDescription}
                onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white"
              />
            </div>

            {/* Photo / Screenshot Uploads */}
            <div>
              <label className="text-gray-300 font-semibold block mb-1">Upload Screenshots / Photos (Max 5 files, 10MB limit)</label>
              <div className="border-2 border-dashed border-gray-800 rounded-2xl p-4 text-center bg-gray-900/40">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="repair-file-upload"
                />
                <label htmlFor="repair-file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-amber-400" />
                  <span className="text-xs text-gray-300 font-semibold">Click to select photos or drop files here</span>
                </label>
                {files.length > 0 && (
                  <p className="text-[11px] text-emerald-400 font-bold mt-2">
                    {files.length} file(s) selected
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-400 text-gray-950 py-4 px-6 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              {submitting ? 'Submitting Ticket...' : 'SUBMIT REPAIR REQUEST TICKET'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
