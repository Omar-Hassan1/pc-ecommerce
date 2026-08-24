import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cartItems, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeFromCart, subtotal } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0f172a] border-l border-gray-800 text-gray-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">Your Shopping Cart</h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-gray-800/60">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto animate-bounce" />
                <p className="text-sm text-gray-400 font-medium">Your cart is currently empty</p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const product = item.product || {};
                const img = product.images && product.images.length > 0 
                  ? product.images[0].imageUrl 
                  : 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=300&q=80';
                const itemPrice = parseFloat(item.price || product.salePrice || product.price || 0);

                return (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                    <div className="w-16 h-16 bg-gray-900 rounded-lg p-1 shrink-0 flex items-center justify-center border border-gray-800">
                      <img src={img} alt={product.name} className="max-h-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-bold text-white truncate">{product.name || 'Custom Product'}</h4>
                      <p className="text-xs text-blue-400 font-extrabold">${itemPrice.toFixed(2)}</p>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center border border-gray-800 rounded bg-gray-900 text-xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-gray-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 text-white font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-gray-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-gray-800 bg-gray-900/60 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Subtotal:</span>
                <span className="text-lg font-extrabold text-white">${subtotal.toFixed(2)}</span>
              </div>

              <p className="text-[11px] text-gray-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Shipping & Taxes calculated at checkout
              </p>

              <div className="space-y-2">
                <Link
                  to="/checkout"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 blue-glow transition-all"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center transition-all"
                >
                  View Detailed Cart
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
