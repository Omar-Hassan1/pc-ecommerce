import React, { useState } from 'react';
import { X, Star, ShoppingCart, Shield, Truck, Check, Cpu } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const primaryImage = product.images && product.images.length > 0 
    ? product.images[0].imageUrl 
    : 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80';

  const price = parseFloat(product.price);
  const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
  const currentPrice = salePrice || price;

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-[#131b2e] border border-gray-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl overflow-hidden text-gray-100">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-gray-900 border border-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900/90 rounded-xl p-4 flex items-center justify-center aspect-square">
            <img src={primaryImage} alt={product.name} className="max-h-full object-contain" />
          </div>

          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">
                {product.brand?.name || 'NEXORA'}
              </span>
              <h2 className="text-xl font-bold text-white leading-snug">{product.name}</h2>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-gray-400">({product.reviewCount || 15} Reviews)</span>
              </div>

              <p className="text-xs text-gray-300 mt-3 line-clamp-3 leading-relaxed">
                {product.shortDescription || product.description}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-800">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-white">
                  ${currentPrice.toFixed(2)}
                </span>
                {salePrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${price.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-700 rounded-lg bg-gray-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-gray-400 hover:text-white font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-gray-400 hover:text-white font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 blue-glow transition-all"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Shopping Cart
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400 pt-2">
                <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-blue-400" /> Worldwide Express</span>
                <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> 2 Year Warranty</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
