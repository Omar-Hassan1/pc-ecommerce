import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Monitor, 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Wrench, 
  Cpu, 
  ChevronDown, 
  Menu, 
  X, 
  ShieldAlert, 
  LogOut, 
  PackageCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { SITE_CONFIG } from '../config/site';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount, setIsDrawerOpen } = useCart();
  const { wishlistItems } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-gray-800">
      {/* Top Banner Message */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-xs py-1.5 px-4 text-center font-medium text-blue-200 tracking-wide border-b border-blue-800/50">
        🚀 Worldwide Express Shipping & Official Hardware Warranty | Certified 24/7 Tech Repairs
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 flex items-center justify-center blue-glow group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-blue-400 bg-clip-text text-transparent block">
                {SITE_CONFIG.name}
              </span>
              <span className="text-[10px] text-gray-400 tracking-widest uppercase font-semibold block -mt-1">
                Global Tech & Repair
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search RTX 5080, Ryzen CPUs, Laptops, Repairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900/90 border border-gray-700/80 rounded-full py-2 pl-4 pr-10 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Action Utilities */}
          <div className="flex items-center gap-4">
            
            {/* Custom PC Builder Badge Button */}
            <Link 
              to="/pc-builder" 
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-all"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>PC Builder</span>
            </Link>

            {/* Wishlist */}
            <Link to="/customer/dashboard?tab=wishlist" className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <Heart className="w-6 h-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account / Avatar Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-200 hover:text-white p-1 rounded-lg border border-gray-800 hover:border-gray-700 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs uppercase">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span className="hidden sm:inline">{user.firstName}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-800">
                      <p className="text-sm font-semibold text-white">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-blue-900/60 text-blue-300 rounded border border-blue-700/50">
                        {user.role}
                      </span>
                    </div>

                    {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-cyan-400 hover:bg-gray-800 font-semibold"
                      >
                        <ShieldAlert className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}

                    {(user.role === 'TECHNICIAN' || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                      <Link
                        to="/technician/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-indigo-400 hover:bg-gray-800 font-semibold"
                      >
                        <Wrench className="w-4 h-4" /> Tech Repairs Portal
                      </Link>
                    )}

                    <Link
                      to="/customer/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                    >
                      <User className="w-4 h-4" /> Customer Dashboard
                    </Link>

                    <Link
                      to="/customer/dashboard?tab=orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                    >
                      <PackageCheck className="w-4 h-4" /> My Orders
                    </Link>

                    <button
                      onClick={() => { setIsUserMenuOpen(false); logout(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-gray-800 border-t border-gray-800 mt-1"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all blue-glow"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Links Bar */}
      <nav className="hidden md:block bg-[#0f172a]/60 border-t border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 text-xs font-medium tracking-wider uppercase">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors">Home</Link>
              <Link to="/shop" className="text-gray-300 hover:text-blue-400 transition-colors">Shop All</Link>
              <Link to="/shop?category=gaming-pcs" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">Gaming PCs</Link>
              <Link to="/shop?category=laptops" className="text-gray-300 hover:text-blue-400 transition-colors">Laptops</Link>
              <Link to="/shop?category=pc-components" className="text-gray-300 hover:text-blue-400 transition-colors">Components</Link>
              <Link to="/shop?category=accessories" className="text-gray-300 hover:text-blue-400 transition-colors">Accessories</Link>
              <Link to="/pc-builder" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">PC Builder</Link>
              <Link to="/repair" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 inline" /> Repair Service
              </Link>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <Link to="/about" className="hover:text-gray-200">About</Link>
              <Link to="/contact" className="hover:text-gray-200">Contact</Link>
              <Link to="/repair/track" className="hover:text-amber-300 text-amber-400">Track Repair</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products & repairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-4 pr-10 text-sm text-gray-200"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm pt-2 font-medium">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded hover:bg-gray-800 text-gray-200">Home</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded hover:bg-gray-800 text-gray-200">Shop Catalog</Link>
            <Link to="/shop?category=gaming-pcs" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded hover:bg-gray-800 text-blue-400">Gaming PCs</Link>
            <Link to="/shop?category=laptops" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded hover:bg-gray-800 text-gray-200">Laptops</Link>
            <Link to="/shop?category=pc-components" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded hover:bg-gray-800 text-gray-200">PC Components</Link>
            <Link to="/pc-builder" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded hover:bg-gray-800 text-cyan-400">Custom PC Builder</Link>
            <Link to="/repair" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded hover:bg-gray-800 text-amber-400 col-span-2">Repair Service & Diagnosis</Link>
            <Link to="/repair/track" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded hover:bg-gray-800 text-gray-300">Track Repair Status</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded hover:bg-gray-800 text-gray-300">Contact & Support</Link>
          </div>
        </div>
      )}
    </header>
  );
}
