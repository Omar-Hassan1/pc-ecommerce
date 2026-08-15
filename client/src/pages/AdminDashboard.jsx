import React, { useState, useEffect } from 'react';
import { ShieldAlert, DollarSign, Package, Users, Wrench, AlertTriangle, Plus, Edit, Trash2, Tag, MessageSquare } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function AdminDashboard() {
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product Modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    sku: '',
    categoryId: '',
    brandId: '',
    price: '',
    stockQuantity: 10,
    description: ''
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, coupRes] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/products?limit=50'),
        api.get('/coupons')
      ]);

      if (statsRes.success) {
        setStats(statsRes.data.stats);
        setCharts(statsRes.data.charts);
      }
      if (prodRes.success) setProducts(prodRes.data.products || []);
      if (coupRes.success) setCoupons(coupRes.data || []);
    } catch (err) {
      showToast('Failed to load admin stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/products', newProd);
      if (res.success) {
        showToast('Product created successfully!', 'success');
        setShowProductModal(false);
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create product', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider">Loading Executive Control Panel...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold border border-cyan-500/40 mb-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>NEXORA Store Administrator Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Executive Management</h1>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white blue-glow' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
          >
            Overview & Analytics
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-blue-600 text-white blue-glow' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
          >
            Product Catalog CRUD
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'coupons' ? 'bg-blue-600 text-white blue-glow' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
          >
            Discount Coupons
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-[#131b2e] border border-gray-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] text-gray-400 font-bold block uppercase">Total Revenue</span>
            <span className="text-xl font-extrabold text-emerald-400">${stats.totalRevenue.toLocaleString()}</span>
          </div>
          <div className="bg-[#131b2e] border border-gray-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] text-gray-400 font-bold block uppercase">Total Orders</span>
            <span className="text-xl font-extrabold text-white">{stats.totalOrders}</span>
          </div>
          <div className="bg-[#131b2e] border border-gray-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] text-gray-400 font-bold block uppercase">Active Repairs</span>
            <span className="text-xl font-extrabold text-amber-400">{stats.activeRepairs}</span>
          </div>
          <div className="bg-[#131b2e] border border-gray-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] text-gray-400 font-bold block uppercase">Customers</span>
            <span className="text-xl font-extrabold text-blue-400">{stats.totalCustomers}</span>
          </div>
          <div className="bg-[#131b2e] border border-gray-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] text-gray-400 font-bold block uppercase">Active Products</span>
            <span className="text-xl font-extrabold text-white">{stats.totalProducts}</span>
          </div>
          <div className="bg-[#131b2e] border border-gray-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] text-gray-400 font-bold block uppercase">Low Stock Alerts</span>
            <span className="text-xl font-extrabold text-rose-400">{stats.lowStockProducts}</span>
          </div>
        </div>
      )}

      {/* TAB: OVERVIEW & ANALYTICS CHARTS */}
      {activeTab === 'overview' && charts && (
        <div className="space-y-8">
          <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-gray-800 pb-3">
              Monthly Revenue Performance ($ USD)
            </h3>

            {/* Custom SVG Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-4 pt-8 px-4">
              {charts.monthlySales?.map((item, i) => {
                const maxVal = 120000;
                const heightPercent = Math.min(100, Math.round((item.sales / maxVal) * 100));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      ${item.sales / 1000}k
                    </div>
                    <div className="w-full bg-gray-900 rounded-t-lg overflow-hidden flex items-end h-48">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-blue-700 to-cyan-400 rounded-t-lg group-hover:from-blue-600 group-hover:to-cyan-300 transition-all"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-gray-400">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: PRODUCT CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Product Inventory Manager</h3>
            <button
              onClick={() => setShowProductModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 blue-glow"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          </div>

          <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 uppercase">
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3">SKU</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80">
                {products.map(prod => (
                  <tr key={prod.id}>
                    <td className="py-3 font-bold text-white max-w-xs truncate">{prod.name}</td>
                    <td className="py-3 font-mono text-gray-400">{prod.sku}</td>
                    <td className="py-3 font-extrabold text-blue-400">${parseFloat(prod.price).toFixed(2)}</td>
                    <td className="py-3 font-bold">{prod.stockQuantity} units</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${prod.isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                        {prod.isActive ? 'Active' : 'Archived'}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <button className="text-gray-400 hover:text-white p-1"><Edit className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Promotional Coupons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coupons.map(c => (
              <div key={c.id} className="p-4 bg-gray-900 border border-gray-800 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-400 text-sm">{c.code}</span>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded text-[10px]">{c.type}</span>
                </div>
                <p className="text-white font-bold">Value: {c.type === 'percentage' ? `${c.value}% OFF` : `$${c.value} OFF`}</p>
                <p className="text-gray-500">Used: {c.timesUsed} / {c.usageLimit} times</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 max-w-lg w-full space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">Create New Hardware Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Product Name *</label>
                <input type="text" required value={newProd.name} onChange={(e) => setNewProd({ ...newProd, name: e.target.value })} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">SKU *</label>
                  <input type="text" required value={newProd.sku} onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Price ($) *</label>
                  <input type="number" required value={newProd.price} onChange={(e) => setNewProd({ ...newProd, price: e.target.value })} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl">Create Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
