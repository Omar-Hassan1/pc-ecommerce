import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setSubmitting(true);
    const result = await register(formData);
    setSubmitting(false);

    if (result?.success) {
      navigate('/customer/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto blue-glow">
          <Cpu className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Create Your Account</h1>
        <p className="text-xs text-gray-400">Join NEXORA COMPUTERS for global technology shopping & repairs.</p>
      </div>

      <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-300 font-semibold block mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-gray-300 font-semibold block mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
              />
            </div>
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
            <label className="text-gray-300 font-semibold block mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="text-gray-300 font-semibold block mb-1">Password * (At least 8 chars, 1 uppercase, 1 number, 1 special)</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="text-gray-300 font-semibold block mb-1">Confirm Password *</label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 blue-glow transition-all"
          >
            <UserPlus className="w-4 h-4" /> {submitting ? 'Creating Account...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-400 font-bold hover:underline">Sign In</Link>
        </p>
      </div>

    </div>
  );
}
