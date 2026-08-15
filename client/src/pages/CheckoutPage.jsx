import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, CreditCard, Truck, MapPin, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function CheckoutPage() {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingId, setSelectedShippingId] = useState('');
  const [shippingCost, setShippingCost] = useState(15.00);

  // Form State
  const [formData, setFormData] = useState({
    firstName: user ? user.firstName : '',
    lastName: user ? user.lastName : '',
    email: user ? user.email : '',
    phone: user ? user.phone || '' : '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    paymentMethod: 'Stripe',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    const fetchShipping = async () => {
      try {
        const res = await api.get('/shipping/methods');
        if (res.success && res.data.length > 0) {
          setShippingMethods(res.data);
          setSelectedShippingId(res.data[0].id);
          setShippingCost(parseFloat(res.data[0].basePrice));
        }
      } catch (err) {
        console.warn('Failed to load shipping methods');
      }
    };
    fetchShipping();
  }, []);

  const handleShippingChange = (method) => {
    setSelectedShippingId(method.id);
    setShippingCost(parseFloat(method.basePrice));
  };

  const tax = subtotal * 0.08;
  const totalAmount = subtotal + shippingCost + tax;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      showToast('Cart is empty', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.product?.id || item.productId,
          quantity: item.quantity
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        shippingMethodId: selectedShippingId,
        paymentMethod: formData.paymentMethod,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        notes: formData.notes
      };

      const res = await api.post('/orders', orderPayload);

      if (res.success) {
        setCompletedOrder(res.data.order);
        clearCart();
        showToast(`Order ${res.data.order.orderNumber} placed successfully!`, 'success');
        setStep(6); // Confirmation screen
      }
    } catch (err) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 6 && completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">Order Confirmed</span>
          <h1 className="text-3xl font-extrabold text-white">Thank You For Your Order!</h1>
          <p className="text-sm text-gray-300">
            Order Reference Number: <strong className="text-blue-400 font-mono">{completedOrder.orderNumber}</strong>
          </p>
        </div>

        <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 text-left text-xs space-y-3 max-w-md mx-auto">
          <div className="flex justify-between text-gray-400">
            <span>Status:</span>
            <span className="font-bold text-emerald-400">{completedOrder.status}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Total Paid:</span>
            <span className="font-extrabold text-white">${parseFloat(completedOrder.totalAmount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Shipping Destination:</span>
            <span className="font-semibold text-white">{completedOrder.shippingAddress?.city}, {completedOrder.shippingAddress?.country}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            to={`/customer/dashboard?tab=orders`}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold blue-glow"
          >
            Track Order In Dashboard
          </Link>

          <Link
            to="/shop"
            className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-xl text-xs font-bold border border-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Checkout Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Worldwide Checkout</h1>
          <p className="text-xs text-gray-400 mt-1">Multi-step secure order processing.</p>
        </div>

        {/* Steps Pills */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className={`px-3 py-1 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-600'}`}>1. Contact</span>
          <span className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-600'}`}>2. Address</span>
          <span className={`px-3 py-1 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-600'}`}>3. Shipping</span>
          <span className={`px-3 py-1 rounded-full ${step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-600'}`}>4. Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Interactive Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            
            {/* Step 1: Contact Details */}
            <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" /> 1. Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" /> 2. International Shipping Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-gray-300 font-semibold block mb-1">Full Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="Street address, P.O. box, suite..."
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">State / Province / Region *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Postal Code / Zip *</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Shipping Method */}
            <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400" /> 3. Select Courier Shipping Method
              </h3>
              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all text-xs ${
                      selectedShippingId === method.id 
                        ? 'bg-blue-950/40 border-blue-500 blue-glow' 
                        : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={selectedShippingId === method.id}
                        onChange={() => handleShippingChange(method)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="font-bold text-white">{method.name}</p>
                        <p className="text-gray-400 text-[11px]">{method.description}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-blue-400">${parseFloat(method.basePrice).toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 4: Payment Selection */}
            <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-400" /> 4. Payment Options (Stripe Encrypted)
              </h3>
              
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-3 text-xs">
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'Stripe'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'Stripe' })}
                    className="text-blue-600"
                  />
                  <span className="font-bold text-white">Stripe Secure Card Payment Gateway</span>
                </div>
                <p className="text-[11px] text-gray-400 pl-6 leading-relaxed">
                  Development payment mode active. Connect live Stripe secret keys in server/.env for production credit card authorization.
                </p>
              </div>
            </div>

            {/* Submit Order */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 px-6 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 blue-glow transition-all"
            >
              {isSubmitting ? 'Processing Order...' : `PLACE CONFIRMED ORDER ($${totalAmount.toFixed(2)})`} <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        </div>

        {/* Right Summary */}
        <div className="space-y-6">
          <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 space-y-4 sticky top-28">
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider border-b border-gray-800 pb-3">
              Order Review ({cartItems.length} Items)
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-xs p-2 bg-gray-900 rounded-xl">
                  <div className="truncate pr-2">
                    <p className="font-bold text-white truncate">{item.product?.name}</p>
                    <span className="text-gray-500">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-extrabold text-blue-400">${(parseFloat(item.price || item.product?.salePrice || item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-gray-300 border-t border-gray-800 pt-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Courier Shipping:</span>
                <span className="font-bold text-white">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%):</span>
                <span className="font-bold text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white border-t border-gray-800 pt-2">
                <span>Total Amount:</span>
                <span className="text-blue-400">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
