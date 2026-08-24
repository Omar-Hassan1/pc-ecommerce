import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Grid, List, Search, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { ProductCardSkeleton } from '../components/Skeleton';
import api from '../api/axios';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filters state
  const selectedCategory = searchParams.get('category') || '';
  const selectedBrand = searchParams.get('brand') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortOption = searchParams.get('sort') || 'featured';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const inStock = searchParams.get('inStock') === 'true';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get('/categories'),
          api.get('/brands')
        ]);
        if (catRes.success) setCategories(catRes.data || []);
        if (brandRes.success) setBrands(brandRes.data || []);
      } catch (err) {
        console.warn('Failed to load filter metadata');
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedBrand) params.append('brand', selectedBrand);
        if (searchQuery) params.append('search', searchQuery);
        if (sortOption) params.append('sort', sortOption);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (inStock) params.append('inStock', 'true');
        params.append('page', page);
        params.append('limit', 12);

        const res = await api.get(`/products?${params.toString()}`);
        if (res.success) {
          setProducts(res.data.products || []);
          setPagination(res.data.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 });
        }
      } catch (err) {
        console.warn('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // reset page on filter change
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Computer Hardware Shop</h1>
          <p className="text-xs text-gray-400 mt-1">
            Showing {pagination.totalItems} computer systems, processors, graphics cards & components
          </p>
        </div>

        {/* Sorting & Grid Toggle Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-gray-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-gray-400 hidden sm:inline">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer font-bold"
            >
              <option value="featured" className="bg-gray-900">Featured</option>
              <option value="newest" className="bg-gray-900">Newest Arrivals</option>
              <option value="price_asc" className="bg-gray-900">Price: Low to High</option>
              <option value="price_desc" className="bg-gray-900">Price: High to Low</option>
              <option value="rating" className="bg-gray-900">Highest Rated</option>
              <option value="best_selling" className="bg-gray-900">Best Selling</option>
            </select>
          </div>

          <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl p-1 text-gray-400">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filters */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-[#131b2e] border border-gray-800 rounded-2xl p-5 space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-400" /> Filter Catalog
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-gray-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Search Input Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 block">Keyword Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. RTX 5080, Ryzen..."
                  value={searchQuery}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-3 pr-8 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 px-3 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 block">Hardware Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => updateFilter('brand', e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 px-3 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Brands (ASUS, MSI, AMD...)</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.slug}>{brand.name}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 block">Price Range ($)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="bg-gray-900 border border-gray-800 rounded-xl py-1.5 px-3 text-xs text-gray-200"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="bg-gray-900 border border-gray-800 rounded-xl py-1.5 px-3 text-xs text-gray-200"
                />
              </div>
            </div>

            {/* In Stock Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')}
                  className="rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500"
                />
                <span>In Stock Only</span>
              </label>
            </div>

          </div>
        </div>

        {/* Right Main Product List */}
        <div className="lg:col-span-3 space-y-8">
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-[#131b2e] border border-gray-800 rounded-2xl p-8 space-y-4">
              <Search className="w-12 h-12 text-gray-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No products found</h3>
              <p className="text-xs text-gray-400">Try adjusting your filters or search keywords.</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}

          {/* Pagination Bar */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-800">
              <button
                disabled={page <= 1}
                onClick={() => updateFilter('page', (page - 1).toString())}
                className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 disabled:opacity-50 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {[...Array(pagination.totalPages)].map((_, i) => {
                const pNum = i + 1;
                return (
                  <button
                    key={pNum}
                    onClick={() => updateFilter('page', pNum.toString())}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      page === pNum ? 'bg-blue-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}

              <button
                disabled={page >= pagination.totalPages}
                onClick={() => updateFilter('page', (page + 1).toString())}
                className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 disabled:opacity-50 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

    </div>
  );
}
