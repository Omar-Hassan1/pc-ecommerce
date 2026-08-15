import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Tag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode.trim(),
        subtotal
      });
      if (res.success) {
        setAppliedDiscount(res.data.discount);
        showToast(`Coupon ${res.data.code} applied! Saved $${res.data.discount}`, 'success');
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
      setAppliedDiscount(0);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const estimatedShipping = subtotal > 1000 ? 0 : 15.00;
  const tax = (subtotal - appliedDiscount) * 0.08;
  const total = Math.max(0, subtotal + estimatedShipping + tax - appliedDiscount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-gray-400 mt-1">Review your selected items before proceeding to international checkout.</p>
        </div>
        <Link to="/shop" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-[#131b2e] border border-gray-800 rounded-3xl p-8 space-y-4">
          <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto" />
          <h2 className="text-xl font-bold text-white">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-gray-400">Discover our gaming PCs, laptops, and computer components catalog.</p>
          <Link to="/shop" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold inline-block blue-glow">
            Explore Store Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 uppercase">
                    <th className="pb-3">Product</th>
                    <th className="pb-3 text-center">Unit Price</th>
                    <th className="pb-3 text-center">Quantity</th>
                    <th className="pb-3 text-right">Total</th>
                    <th className="pb-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/80">
                  {cartItems.map((item) => {
                    const product = item.product || {};
                    const img = product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=200&q=80';
                    const unitPrice = parseFloat(item.price || product.salePrice || product.price || 0);
                    const itemTotal = unitPrice * item.quantity;

                    return (
                      <tr key={item.id}>
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <img src={img} alt={product.name} className="w-14 h-14 object-contain bg-gray-900 rounded-lg p-1 shrink-0 border border-gray-800" />
                            <div>
                              <Link to={`/product/${product.slug}`} className="font-bold text-white hover:text-blue-400 block line-clamp-1">
                                {product.name || 'Computer Component'}
                              </Link>
                              <span className="text-[10px] text-gray-500">SKU: {product.sku || 'NX-ITEM'}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 text-center font-semibold text-gray-300">
                          ${unitPrice.toFixed(2)}
                        </td>

                        <td className="py-4 text-center">
                          <div className="inline-flex items-center border border-gray-800 rounded-lg bg-gray-900">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1 text-gray-400 hover:text-white">-</button>
                            <span className="px-2.5 font-bold text-white">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1 text-gray-400 hover:text-white">+</button>
                          </div>
                        </td>

                        <td className="py-4 text-right font-extrabold text-blue-400">
                          ${itemTotal.toFixed(2)}
                        </td>

                        <td className="py-4 text-center">
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-rose-400 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cart Summary & Coupon Section */}
          <div className="space-y-6">
            <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 space-y-6 sticky top-28">
              
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider border-b border-gray-800 pb-3">
                Order Summary
              </h3>

              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 block flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-blue-400" /> Apply Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={validatingCoupon}
                    className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}
                {appliedDiscount > 0 && <p className="text-[11px] text-emerald-400 font-bold">Discount applied: -${appliedDiscount.toFixed(2)}</p>}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs text-gray-300 border-t border-gray-800 pt-4">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Shipping:</span>
                  <span className="font-bold text-white">
                    {estimatedShipping === 0 ? <span className="text-emerald-400">FREE</span> : `$${estimatedShipping.toFixed(2)}`}
                  </span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount:</span>
                    <span>-${appliedDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Tax (8%):</span>
                  <span className="font-bold text-white">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-white border-t border-gray-800 pt-3">
                  <span>Total Amount:</span>
                  <span className="text-blue-400 text-xl">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 blue-glow transition-all"
              >
                PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-gray-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Guaranteed 256-Bit Encrypted Checkout
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
