import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Lock, Mail, ShieldAlert, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result?.success) {
      if (result.role === 'ADMIN' || result.role === 'SUPER_ADMIN') {
        navigate('/admin/dashboard');
      } else if (result.role === 'TECHNICIAN') {
        navigate('/technician/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto blue-glow">
          <Cpu className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Sign In to NEXORA</h1>
        <p className="text-xs text-gray-400">Access your orders, wishlist, and repair tickets.</p>
      </div>

      {/* Preset Demo Logins Box */}
      <div className="p-4 bg-gray-900/90 border border-blue-500/30 rounded-2xl text-xs space-y-2">
        <span className="font-bold text-blue-400 block text-[11px] uppercase tracking-wider">Quick Demo Login Shortcuts:</span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillDemo('admin@nexora.com')}
            className="p-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-[10px] font-bold"
          >
            Admin Account
          </button>
          <button
            type="button"
            onClick={() => fillDemo('tech@nexora.com')}
            className="p-1.5 bg-gray-800 hover:bg-gray-700 text-indigo-300 rounded-lg text-[10px] font-bold"
          >
            Tech Account
          </button>
          <button
            type="button"
            onClick={() => fillDemo('customer@nexora.com')}
            className="p-1.5 bg-gray-800 hover:bg-gray-700 text-emerald-300 rounded-lg text-[10px] font-bold"
          >
            Customer
          </button>
        </div>
      </div>

      <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-gray-300 font-semibold block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 pl-9 text-white focus:outline-none focus:border-blue-500"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-gray-300 font-semibold block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 pl-9 text-white focus:outline-none focus:border-blue-500"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 blue-glow transition-all"
          >
            <LogIn className="w-4 h-4" /> {submitting ? 'Signing In...' : 'SIGN IN'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Don't have an account? <Link to="/register" className="text-blue-400 font-bold hover:underline">Register Now</Link>
        </p>
      </div>

    </div>
  );
}
