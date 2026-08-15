import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Wrench, 
  ShieldCheck, 
  Globe2, 
  Truck, 
  Star, 
  ArrowRight, 
  Monitor, 
  Smartphone, 
  Zap, 
  Layers, 
  CheckCircle2, 
  Flame, 
  HardDrive,
  Headphones,
  Keyboard,
  Mouse
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { ProductCardSkeleton } from '../components/Skeleton';
import api from '../api/axios';
import { SITE_CONFIG } from '../config/site';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [gamingPcs, setGamingPcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [featRes, gamingRes] = await Promise.all([
          api.get('/products?isFeatured=true&limit=8'),
          api.get('/products?category=gaming-pcs&limit=4')
        ]);

        if (featRes.success) setFeaturedProducts(featRes.data.products || []);
        if (gamingRes.success) setGamingPcs(gamingRes.data.products || []);
      } catch (err) {
        console.warn('Failed to load home products');
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const categories = [
    { name: 'Gaming PCs', slug: 'gaming-pcs', icon: Cpu, count: '12 Models' },
    { name: 'Laptops', slug: 'laptops', icon: Monitor, count: '18 Models' },
    { name: 'Graphics Cards', slug: 'gpus', icon: Zap, count: '24 Items' },
    { name: 'Processors', slug: 'cpus', icon: Layers, count: '15 CPUs' },
    { name: 'Motherboards', slug: 'motherboards', icon: Cpu, count: '30 Boards' },
    { name: 'RAM Memory', slug: 'ram', icon: Layers, count: '40 Kits' },
    { name: 'Storage (SSDs)', slug: 'ssds', icon: HardDrive, count: '25 Drives' },
    { name: 'Monitors', slug: 'monitors', icon: Monitor, count: '16 Displays' },
    { name: 'Keyboards', slug: 'keyboards', icon: Keyboard, count: '35 Boards' },
    { name: 'Mice & Gear', slug: 'accessories', icon: Mouse, count: '50 Items' }
  ];

  const testimonials = [
    { name: 'David Miller', role: 'Esports Athlete', text: 'My NEXORA Vanguard PC with RTX 5080 arrived perfectly packed in London. Runs 4K 240Hz like an absolute dream!', rating: 5 },
    { name: 'Elena Rostova', role: '3D Animator', text: 'Sent in my water-cooled workstation for motherboard repair. Received detailed diagnostic quote and got it back in 3 days!', rating: 5 },
    { name: 'Michael Chang', role: 'Streamer', text: 'The Custom PC builder checked socket and wattage compatibility automatically. Best online PC building experience hands down.', rating: 5 }
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. Hero Promotional Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#0b0f19] to-[#0b0f19] border-b border-gray-800/80 pt-12 pb-24">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-900/50 text-blue-300 border border-blue-700/50">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Next-Gen NVIDIA RTX 50 Series & Ryzen 9800X3D In Stock</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              POWER YOUR <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                WORLD WITH NEXORA.
              </span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Premium Gaming PCs, High Performance Laptops & Enthusiast Hardware Delivered Worldwide. Certified Global Computer Diagnosis & Repair.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 blue-glow transition-all active:scale-95"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pc-builder"
                className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-gray-800 text-cyan-300 border border-cyan-500/40 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Build Your Custom PC</span>
              </Link>
            </div>

            {/* Quick stats badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800/80 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <span className="text-xl font-extrabold text-white block">100%</span>
                <span className="text-xs text-gray-400">Authentic Parts</span>
              </div>
              <div>
                <span className="text-xl font-extrabold text-blue-400 block">120+</span>
                <span className="text-xs text-gray-400">Countries Shipped</span>
              </div>
              <div>
                <span className="text-xl font-extrabold text-cyan-400 block">24/7</span>
                <span className="text-xs text-gray-400">Expert Repair</span>
              </div>
            </div>

          </div>

          {/* Hero Setup Showcase Image */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden shadow-2xl p-2">
              <img
                src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80"
                alt="NEXORA Gaming Setup"
                className="w-full h-auto rounded-xl object-cover transform group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-gray-950/80 backdrop-blur-md p-4 rounded-xl border border-gray-800 flex items-center justify-between text-xs text-gray-200">
                <div>
                  <p className="font-bold text-white">NEXORA Vanguard X1 flagship</p>
                  <p className="text-gray-400">Liquid Cooled Ryzen 7 9800X3D + RTX 5080</p>
                </div>
                <span className="font-extrabold text-blue-400">$2,999.99</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Explore Categories</h2>
            <p className="text-sm text-gray-400 mt-1">Browse genuine hardware & enthusiast technology components</p>
          </div>
          <Link to="/shop" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={`/shop?category=${cat.slug}`}
                className="glass-card rounded-2xl p-5 text-center flex flex-col items-center justify-center space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors">{cat.name}</h3>
                  <span className="text-[10px] text-gray-400 font-medium block mt-0.5">{cat.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-800 pb-4">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">Trending Products</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">Featured Hardware</h2>
          </div>
          <Link to="/shop?sort=featured" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Pre-built Gaming PCs Special Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 border border-blue-800/40 p-8 sm:p-12 overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <span className="px-3 py-1 bg-blue-600/30 text-blue-300 text-xs font-bold rounded-full border border-blue-500/40 uppercase tracking-wider inline-block">
                Flagship Performance
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                NEXORA Pre-Built Gaming PCs
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed max-w-lg">
                Engineered, Stress-Tested, and Cable-Managed by Master Technicians. Includes 3 Years Parts & Labor Warranty + Lifetime Tech Support.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs text-gray-300 pt-2">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> AMD Ryzen 9000 & Intel Core 14th Gen</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> NVIDIA RTX 5080 / 4090 GPUs</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom Liquid Cooling Options</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Plug & Play Ready</span>
              </div>

              <div className="pt-4">
                <Link
                  to="/shop?category=gaming-pcs"
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 blue-glow transition-all"
                >
                  Explore Pre-Built PCs <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gamingPcs.slice(0, 2).map((pc) => (
                <div key={pc.id} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 text-center space-y-3">
                  <img src={pc.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80'} alt={pc.name} className="h-36 mx-auto object-contain" />
                  <h4 className="text-xs font-bold text-white truncate">{pc.name}</h4>
                  <p className="text-xs font-extrabold text-blue-400">${parseFloat(pc.salePrice || pc.price).toFixed(2)}</p>
                  <Link to={`/product/${pc.slug}`} className="block text-[11px] font-bold text-gray-300 hover:text-white bg-gray-800 py-1.5 rounded-lg">View Specs</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Custom PC Builder Promotion Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel border border-cyan-500/30 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mx-auto cyan-glow">
            <Cpu className="w-8 h-8" />
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Custom PC Builder Engine</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Select your favorite CPU, Motherboard, GPU, RAM, Power Supply, and Case. Our real-time engine validates CPU socket compatibility, RAM architecture, and total system wattage automatically!
            </p>
          </div>

          <div>
            <Link
              to="/pc-builder"
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-2 cyan-glow transition-all"
            >
              <span>Build Your Custom PC Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Repair Service Promotion Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-950/70 via-gray-900 to-gray-950 border border-amber-500/30 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>Certified International Technicians</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Computer Problems? We Can Fix It.
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Whether it's liquid damage, broken screens, GPU artifacting, overheating, blue screens, or custom liquid cooling maintenance — our expert team diagnoses and repairs computers worldwide.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="p-3 bg-gray-900/90 border border-gray-800 rounded-xl text-center">
                <span className="font-bold text-white block">Laptop Repair</span>
              </div>
              <div className="p-3 bg-gray-900/90 border border-gray-800 rounded-xl text-center">
                <span className="font-bold text-white block">Desktop Repair</span>
              </div>
              <div className="p-3 bg-gray-900/90 border border-gray-800 rounded-xl text-center">
                <span className="font-bold text-white block">Hardware Upgrade</span>
              </div>
              <div className="p-3 bg-gray-900/90 border border-gray-800 rounded-xl text-center">
                <span className="font-bold text-white block">Data Recovery</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/repair"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
              >
                Start A Repair Request <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/repair/track"
                className="px-6 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all border border-gray-700"
              >
                Track Active Ticket
              </Link>
            </div>
          </div>

          <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-gray-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-amber-400" /> Transparent Repair Process
            </h3>

            <ol className="space-y-3 text-xs text-gray-300">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">1</span>
                <span><strong>Submit Ticket Online:</strong> Receive your unique REP-2026 tracking ID instantly.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">2</span>
                <span><strong>Technician Diagnosis:</strong> Devices are thoroughly inspected in ESD-safe lab.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">3</span>
                <span><strong>Itemized Quotation:</strong> View parts & labor costs on your dashboard before approving.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">4</span>
                <span><strong>Completed & Returned:</strong> Fully stress-tested device delivered back to your door.</span>
              </li>
            </ol>
          </div>

        </div>
      </section>

      {/* 7. Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Why NEXORA COMPUTERS</span>
          <h2 className="text-3xl font-extrabold text-white">Built for Enthusiasts Worldwide</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <Globe2 className="w-8 h-8 text-blue-400" />
            <h3 className="text-base font-bold text-white">Worldwide Express Shipping</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              We ship to over 120 countries with insured courier tracking via DHL and FedEx. Double-boxed protective foam packaging.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Full Manufacturer Warranty</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              All components and pre-built computers come with official brand warranties and direct NEXORA RMA assistance.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <Wrench className="w-8 h-8 text-amber-400" />
            <h3 className="text-base font-bold text-white">Master Repair Lab</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              IPC-certified soldering technicians equipped for high precision BGA chip replacement, thermal repasting, and micro-diagnostics.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Verified Customer Reviews</span>
          <h2 className="text-3xl font-extrabold text-white">What Tech Enthusiasts Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-gray-300 italic leading-relaxed">"{t.text}"</p>
              </div>
              <div className="pt-3 border-t border-gray-800/80">
                <p className="text-xs font-bold text-white">{t.name}</p>
                <p className="text-[10px] text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

    </div>
  );
}
