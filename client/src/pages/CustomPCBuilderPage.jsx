import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Zap, CheckCircle2, AlertTriangle, ShoppingCart, Trash2, Layers, RefreshCw, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function CustomPCBuilderPage() {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [steps, setSteps] = useState([]);
  const [componentsByStep, setComponentsByStep] = useState({});
  const [activeStepId, setActiveStepId] = useState('cpu');
  const [selections, setSelections] = useState({});
  const [compatibility, setCompatibility] = useState({ isCompatible: true, warnings: [], estimatedWattage: 50 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const res = await api.get('/pc-builder/components');
        if (res.success) {
          setSteps(res.data.steps || []);
          setComponentsByStep(res.data.components || {});
          if (res.data.steps?.length > 0) {
            setActiveStepId(res.data.steps[0].id);
          }
        }
      } catch (err) {
        showToast('Failed to load PC builder components', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchComponents();
  }, []);

  // Validate compatibility whenever selections change
  useEffect(() => {
    const validate = async () => {
      if (Object.keys(selections).length === 0) return;
      try {
        const res = await api.post('/pc-builder/validate', { selections });
        if (res.success) {
          setCompatibility(res.data);
        }
      } catch (err) {
        console.warn('Compatibility validation failed');
      }
    };
    validate();
  }, [selections]);

  const selectComponent = (stepId, product) => {
    setSelections(prev => ({
      ...prev,
      [stepId]: product
    }));
  };

  const removeSelection = (stepId) => {
    setSelections(prev => {
      const updated = { ...prev };
      delete updated[stepId];
      return updated;
    });
  };

  const resetBuild = () => {
    setSelections({});
    showToast('PC build reset', 'info');
  };

  const calculateTotal = () => {
    return Object.values(selections).reduce((sum, item) => {
      return sum + parseFloat(item.salePrice || item.price || 0);
    }, 0);
  };

  const handleAddBuildToCart = () => {
    const selectedItems = Object.values(selections);
    if (selectedItems.length === 0) {
      showToast('Please select at least one component for your custom build', 'error');
      return;
    }

    selectedItems.forEach(product => {
      addToCart(product, 1);
    });

    showToast('Custom PC build added to shopping cart!', 'success');
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider">Initializing Custom PC Builder Engine...</p>
      </div>
    );
  }

  const activeComponents = componentsByStep[activeStepId] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold border border-cyan-500/40 mb-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Interactive Hardware Compatibility Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Custom PC Builder</h1>
          <p className="text-xs text-gray-400 mt-1">Design your dream custom computer with automatic socket & wattage verification.</p>
        </div>

        <button
          onClick={resetBuild}
          className="text-xs text-gray-400 hover:text-rose-400 flex items-center gap-1.5 self-start md:self-auto bg-gray-900 border border-gray-800 px-3 py-2 rounded-xl transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Clear Build
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Step Navigator & Component Picker */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-800">
            {steps.map((step) => {
              const isSelected = selections[step.id];
              const isActive = activeStepId === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStepId(step.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive 
                      ? 'bg-cyan-600 text-white cyan-glow'
                      : isSelected
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
                  }`}
                >
                  <span>{step.name}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* Component Selection Grid for Active Step */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Select {steps.find(s => s.id === activeStepId)?.name}
            </h3>

            {activeComponents.length === 0 ? (
              <div className="p-8 text-center bg-gray-900/60 border border-gray-800 rounded-2xl text-xs text-gray-500">
                No component choices found for this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeComponents.map((product) => {
                  const isPicked = selections[activeStepId]?.id === product.id;
                  const price = parseFloat(product.salePrice || product.price);

                  return (
                    <div
                      key={product.id}
                      onClick={() => selectComponent(activeStepId, product)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isPicked 
                          ? 'bg-cyan-950/40 border-cyan-500 cyan-glow' 
                          : 'bg-[#131b2e] border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=200&q=80'}
                          alt={product.name}
                          className="w-14 h-14 object-contain bg-gray-900 rounded-lg p-1 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase">{product.brand?.name}</span>
                          <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                          <p className="text-xs font-extrabold text-blue-400 mt-1">${price.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-800/80 text-[11px]">
                        <span className="text-gray-400 truncate">{product.shortDescription || 'Certified Part'}</span>
                        <button
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            isPicked ? 'bg-cyan-500 text-gray-950' : 'bg-gray-800 text-gray-300 hover:text-white'
                          }`}
                        >
                          {isPicked ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Live Build Summary & Compatibility Panel */}
        <div className="space-y-6">
          <div className="bg-[#131b2e] border border-gray-800 rounded-2xl p-6 space-y-6 sticky top-28">
            
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider border-b border-gray-800 pb-3 flex items-center justify-between">
              <span>Build Configuration</span>
              <span className="text-xs text-cyan-400 font-mono">{Object.keys(selections).length} / {steps.length} Parts</span>
            </h3>

            {/* Live Selections List */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {steps.map((step) => {
                const item = selections[step.id];
                return (
                  <div key={step.id} className="flex items-center justify-between text-xs p-2.5 bg-gray-900/80 border border-gray-800/80 rounded-xl">
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] text-gray-500 uppercase block font-bold">{step.name}</span>
                      <span className={`truncate font-semibold block ${item ? 'text-gray-200' : 'text-gray-600 italic'}`}>
                        {item ? item.name : 'Not selected'}
                      </span>
                    </div>

                    {item ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-extrabold text-blue-400">${parseFloat(item.salePrice || item.price).toFixed(2)}</span>
                        <button onClick={() => removeSelection(step.id)} className="text-gray-500 hover:text-rose-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setActiveStepId(step.id)} className="text-[10px] font-bold text-cyan-400 hover:underline shrink-0">
                        Select
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Compatibility Warning Box */}
            <div className="space-y-3 pt-3 border-t border-gray-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1.5 font-bold">
                  <Zap className="w-4 h-4 text-amber-400" /> Estimated Power Draw:
                </span>
                <span className="text-sm font-extrabold text-amber-400">{compatibility.estimatedWattage || 50} Watts</span>
              </div>

              {compatibility.warnings && compatibility.warnings.length > 0 ? (
                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-[11px] text-amber-200 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5" /> Compatibility Notice:
                  </span>
                  {compatibility.warnings.map((w, idx) => (
                    <p key={idx}>{w}</p>
                  ))}
                </div>
              ) : Object.keys(selections).length > 0 ? (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">All selected components are 100% compatible!</span>
                </div>
              ) : null}
            </div>

            {/* Total Price & Checkout Action */}
            <div className="pt-4 border-t border-gray-800 space-y-4">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase">Estimated Build Total:</span>
                <span className="text-2xl font-extrabold text-white">${calculateTotal().toFixed(2)}</span>
              </div>

              <button
                onClick={handleAddBuildToCart}
                disabled={Object.keys(selections).length === 0}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cyan-glow transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> ADD COMPLETE BUILD TO CART
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
