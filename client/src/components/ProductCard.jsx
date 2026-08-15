import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  const price = parseFloat(product.price);
  const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
  const currentPrice = salePrice || price;
  const discountPercent = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;
  const isSaved = isInWishlist(product.id);

  const primaryImage = product.images && product.images.length > 0 
    ? product.images[0].imageUrl 
    : 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(product, 1);
    setIsAdding(false);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-[#131b2e]/80 border border-gray-800 hover:border-blue-500/50 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-500/10">
      
      {/* Top Image Container */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-900/80 mb-4 flex items-center justify-center p-2">
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md">
            -{discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-colors ${
            isSaved ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-gray-900/60 text-gray-400 hover:text-white border border-gray-700/50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-2.5 right-2.5 z-10 p-2 rounded-full bg-gray-900/80 text-gray-300 hover:text-white border border-gray-700 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        <Link to={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
          <img
            src={primaryImage}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="space-y-2.5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Brand & Stock Status */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-blue-400 font-bold uppercase tracking-wider">
              {product.brand?.name || 'NEXORA'}
            </span>

            {product.stockQuantity > 5 ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> In Stock
              </span>
            ) : product.stockQuantity > 0 ? (
              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3 h-3" /> Low Stock
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1 font-semibold">
                <XCircle className="w-3 h-3" /> Out of Stock
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="text-sm font-semibold text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.averageRating || 5)
                    ? 'fill-current text-amber-400'
                    : 'text-gray-700'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-gray-400 font-medium">
            ({product.reviewCount || 12})
          </span>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-white">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              {salePrice && (
                <span className="text-xs text-gray-500 line-through font-medium">
                  ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity <= 0 || isAdding}
            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
              product.stockQuantity > 0
                ? 'bg-blue-600 hover:bg-blue-500 text-white blue-glow active:scale-95'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
