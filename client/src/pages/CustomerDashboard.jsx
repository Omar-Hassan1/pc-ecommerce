import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { User, Package, Wrench, Heart, MapPin, Key, LogOut, ExternalLink, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function CustomerDashboard() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  
  const { user, logout } = useAuth();
  const { wishlistItems } = useWishlist();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const [ordRes, repRes] = await Promise.all([
          api.get('/orders/my-orders'),
          api.get('/repairs/my-repairs')
        ]);
        if (ordRes.success) setOrders(ordRes.data || []);
        if (repRes.success) setRepairs(repRes.data || []);
      } catch (err) {
        console.warn('Failed to load customer dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerData();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/change-password', { currentPassword, newPassword });
      if (res.success) {
        showToast('Password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Customer Account Portal</h1>
          <p className="text-xs text-gray-400 mt-1">Manage your orders, repair tickets, wishlist, and security settings.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">Signed in as <strong className="text-white">{user?.email}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="space-y-2 lg:col-span-1">
          <div className="bg-[#131b2e] border border-gray-800 rounded-2xl p-4 space-y-1 text-xs font-bold">
            <Link
              to="/customer/dashboard?tab=overview"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white blue-glow' : 'text-gray-300 hover:bg-gray-900'}`}
            >
              <User className="w-4 h-4" /> Account Overview
            </Link>

            <Link
              to="/customer/dashboard?tab=orders"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-blue-600 text-white blue-glow' : 'text-gray-300 hover:bg-gray-900'}`}
            >
              <span className="flex items-center gap-3"><Package className="w-4 h-4" /> My Orders</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-800 text-[10px]">{orders.length}</span>
            </Link>

            <Link
              to="/customer/dashboard?tab=repairs"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${activeTab === 'repairs' ? 'bg-blue-600 text-white blue-glow' : 'text-gray-300 hover:bg-gray-900'}`}
            >
              <span className="flex items-center gap-3"><Wrench className="w-4 h-4 text-amber-400" /> Repair Requests</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px]">{repairs.length}</span>
            </Link>

            <Link
              to="/customer/dashboard?tab=wishlist"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${activeTab === 'wishlist' ? 'bg-blue-600 text-white blue-glow' : 'text-gray-300 hover:bg-gray-900'}`}
            >
              <span className="flex items-center gap-3"><Heart className="w-4 h-4 text-rose-400" /> Wishlist</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-800 text-[10px]">{wishlistItems.length}</span>
            </Link>

            <Link
              to="/customer/dashboard?tab=password"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'password' ? 'bg-blue-600 text-white blue-glow' : 'text-gray-300 hover:bg-gray-900'}`}
            >
              <Key className="w-4 h-4" /> Change Password
            </Link>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-gray-900 transition-colors pt-4 border-t border-gray-800 mt-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#131b2e] border border-gray-800 rounded-2xl p-5 space-y-2">
                  <span className="text-xs text-gray-400 font-bold block uppercase">Total Orders</span>
                  <span className="text-3xl font-extrabold text-white">{orders.length}</span>
                </div>
                <div className="bg-[#131b2e] border border-gray-800 rounded-2xl p-5 space-y-2">
                  <span className="text-xs text-gray-400 font-bold block uppercase">Active Repairs</span>
                  <span className="text-3xl font-extrabold text-amber-400">{repairs.filter(r => r.status !== 'Delivered').length}</span>
                </div>
                <div className="bg-[#131b2e] border border-gray-800 rounded-2xl p-5 space-y-2">
                  <span className="text-xs text-gray-400 font-bold block uppercase">Wishlist Items</span>
                  <span className="text-3xl font-extrabold text-rose-400">{wishlistItems.length}</span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Orders</h3>
                {orders.length === 0 ? (
                  <p className="text-xs text-gray-500">No orders placed yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map(ord => (
                      <div key={ord.id} className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl text-xs">
                        <div>
                          <p className="font-bold text-white">{ord.orderNumber}</p>
                          <p className="text-gray-400">{new Date(ord.createdAt).toLocaleDateString()} — {ord.items?.length || 0} Items</p>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-blue-400 block">${parseFloat(ord.totalAmount).toFixed(2)}</span>
                          <span className="text-[10px] font-bold text-emerald-400">{ord.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">My Complete Order History</h3>
              <div className="space-y-4">
                {orders.map(ord => (
                  <div key={ord.id} className="p-5 bg-gray-900 border border-gray-800 rounded-2xl space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                      <div>
                        <span className="font-extrabold text-white text-sm">{ord.orderNumber}</span>
                        <span className="text-gray-500 block text-[11px]">Placed on {new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-950 text-blue-300 font-bold rounded-full border border-blue-800">{ord.status}</span>
                        <span className="font-extrabold text-white text-base">${parseFloat(ord.totalAmount).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {ord.items?.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-gray-300">
                          <span>{item.productName} (Qty: {item.quantity})</span>
                          <span className="font-bold text-white">${parseFloat(item.totalPrice).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: REPAIR REQUESTS */}
          {activeTab === 'repairs' && (
            <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Repair Requests</h3>
              <div className="space-y-4">
                {repairs.map(rep => (
                  <div key={rep.id} className="p-5 bg-gray-900 border border-gray-800 rounded-2xl space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                      <div>
                        <span className="font-extrabold text-amber-400 text-sm">{rep.repairNumber}</span>
                        <span className="text-gray-300 block font-bold mt-0.5">{rep.brand} {rep.model} ({rep.deviceType})</span>
                      </div>
                      <Link
                        to={`/repair/track?repairNumber=${rep.repairNumber}&email=${encodeURIComponent(rep.email)}`}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold rounded-xl text-xs inline-flex items-center gap-1 shrink-0"
                      >
                        Track Ticket <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <p className="text-gray-400 leading-relaxed">Problem: {rep.problemDescription}</p>
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-gray-500">Category: {rep.problemCategory}</span>
                      <span className="font-bold text-emerald-400">Status: {rep.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 max-w-md space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Current Password *</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">New Password *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold">
                  Update Password
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
