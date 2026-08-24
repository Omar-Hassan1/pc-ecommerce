import React, { useState, useEffect } from 'react';
import { Wrench, FileText, Plus, Trash2, CheckCircle2, MessageSquare, ShieldAlert } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function TechnicianDashboard() {
  const { showToast } = useToast();
  
  const [repairs, setRepairs] = useState([]);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status & Quote Modal states
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');

  // Itemized Quote Builder State
  const [quoteItems, setQuoteItems] = useState([
    { description: '', partNumber: '', quantity: 1, unitPrice: 0 }
  ]);
  const [diagnosticFee, setDiagnosticFee] = useState(49);
  const [laborCost, setLaborCost] = useState(50);
  const [shippingCost, setShippingCost] = useState(20);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  const fetchRepairs = async () => {
    try {
      const res = await api.get('/technician/repairs');
      if (res.success) {
        setRepairs(res.data || []);
      }
    } catch (err) {
      showToast('Failed to load technician queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedRepair || !newStatus) return;

    try {
      const res = await api.put(`/technician/repairs/${selectedRepair.id}/status`, {
        status: newStatus,
        comment: statusComment
      });

      if (res.success) {
        showToast(`Status updated to ${newStatus}`, 'success');
        fetchRepairs();
        setSelectedRepair(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update repair status', 'error');
    }
  };

  const addQuoteItemRow = () => {
    setQuoteItems([...quoteItems, { description: '', partNumber: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeQuoteItemRow = (index) => {
    setQuoteItems(quoteItems.filter((_, idx) => idx !== index));
  };

  const updateQuoteItemRow = (index, key, val) => {
    const updated = [...quoteItems];
    updated[index][key] = val;
    setQuoteItems(updated);
  };

  const handleCreateQuote = async (e) => {
    e.preventDefault();
    if (!selectedRepair) return;

    try {
      const res = await api.post(`/technician/repairs/${selectedRepair.id}/quote`, {
        diagnosticFee,
        laborCost,
        shippingCost,
        tax,
        discount,
        items: quoteItems
      });

      if (res.success) {
        showToast('Quotation sent to customer for approval!', 'success');
        fetchRepairs();
        setSelectedRepair(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to generate quote', 'error');
    }
  };

  const stages = [
    'Request Submitted',
    'Waiting for Device',
    'Device Received',
    'Initial Inspection',
    'Diagnostics',
    'Quote Prepared',
    'Waiting for Customer Approval',
    'Repair Approved',
    'Repair In Progress',
    'Testing',
    'Repair Completed',
    'Preparing Return Shipment',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 text-xs font-bold border border-indigo-500/40 mb-2">
            <Wrench className="w-4 h-4 text-indigo-400" />
            <span>Master Technician Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Technician Repairs Portal</h1>
          <p className="text-xs text-gray-400 mt-1">Manage active diagnostics, audit trails, and itemized quotations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ticket List Queue */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Repair Tickets Queue ({repairs.length})</h3>
          
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {repairs.map(rep => (
              <div
                key={rep.id}
                onClick={() => { setSelectedRepair(rep); setNewStatus(rep.status); }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all text-xs space-y-2 ${
                  selectedRepair?.id === rep.id
                    ? 'bg-indigo-950/40 border-indigo-500 cyan-glow'
                    : 'bg-[#131b2e] border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-400">{rep.repairNumber}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-900 text-gray-300">{rep.status}</span>
                </div>
                <p className="font-bold text-white truncate">{rep.brand} {rep.model} ({rep.deviceType})</p>
                <p className="text-gray-400 truncate">Problem: {rep.problemCategory}</p>
                <p className="text-[10px] text-gray-500">Customer: {rep.customerName} ({rep.email})</p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Ticket Action Console */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedRepair ? (
            <div className="p-12 text-center bg-[#131b2e] border border-gray-800 rounded-3xl text-gray-500 text-xs">
              Select a repair ticket from the queue on the left to manage status and build quotations.
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Selected Ticket Header */}
              <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-400 block">{selectedRepair.repairNumber}</span>
                    <h2 className="text-xl font-extrabold text-white">{selectedRepair.brand} {selectedRepair.model}</h2>
                  </div>
                  <span className="px-3 py-1 bg-amber-950 text-amber-300 font-bold text-xs rounded-full border border-amber-500/40">
                    {selectedRepair.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                  <p><strong>Customer:</strong> {selectedRepair.customerName} ({selectedRepair.phone})</p>
                  <p><strong>Serial #:</strong> {selectedRepair.serialNumber || 'N/A'}</p>
                  <p className="col-span-2"><strong>Description:</strong> {selectedRepair.problemDescription}</p>
                </div>
              </div>

              {/* Status Updater Form */}
              <form onSubmit={handleUpdateStatus} className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 space-y-4 text-xs">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Update 15-Stage Status & Audit Log</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Select Stage *</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                    >
                      {stages.map((stg, i) => (
                        <option key={i} value={stg}>{stg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Internal Diagnostic Comment</label>
                    <input
                      type="text"
                      placeholder="e.g. Cleaned thermal paste, replaced VRAM module..."
                      value={statusComment}
                      onChange={(e) => setStatusComment(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl">
                  Update Ticket Status
                </button>
              </form>

              {/* Itemized Quotation Builder Form */}
              <form onSubmit={handleCreateQuote} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6 text-xs">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" /> Itemized Quotation Builder
                  </h3>
                  <button type="button" onClick={addQuoteItemRow} className="text-xs text-blue-400 font-bold flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Part Row
                  </button>
                </div>

                {/* Parts Rows */}
                <div className="space-y-3">
                  {quoteItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-gray-950 p-2.5 rounded-xl border border-gray-800">
                      <input
                        type="text"
                        placeholder="Part Description (e.g. RTX 4070 Fan)..."
                        value={item.description}
                        onChange={(e) => updateQuoteItemRow(idx, 'description', e.target.value)}
                        className="sm:col-span-5 bg-gray-900 border border-gray-800 rounded-lg p-2 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Part #"
                        value={item.partNumber}
                        onChange={(e) => updateQuoteItemRow(idx, 'partNumber', e.target.value)}
                        className="sm:col-span-3 bg-gray-900 border border-gray-800 rounded-lg p-2 text-white"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateQuoteItemRow(idx, 'quantity', e.target.value)}
                        className="sm:col-span-1 bg-gray-900 border border-gray-800 rounded-lg p-2 text-white"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={item.unitPrice}
                        onChange={(e) => updateQuoteItemRow(idx, 'unitPrice', e.target.value)}
                        className="sm:col-span-2 bg-gray-900 border border-gray-800 rounded-lg p-2 text-white"
                      />
                      <button type="button" onClick={() => removeQuoteItemRow(idx)} className="sm:col-span-1 text-gray-500 hover:text-rose-400 text-center">
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Additional Fees */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-gray-400 font-semibold block mb-1">Diagnostic Fee ($)</label>
                    <input type="number" value={diagnosticFee} onChange={(e) => setDiagnosticFee(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-gray-400 font-semibold block mb-1">Labor Cost ($)</label>
                    <input type="number" value={laborCost} onChange={(e) => setLaborCost(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-gray-400 font-semibold block mb-1">Shipping Cost ($)</label>
                    <input type="number" value={shippingCost} onChange={(e) => setShippingCost(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-gray-400 font-semibold block mb-1">Tax ($)</label>
                    <input type="number" value={tax} onChange={(e) => setTax(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold py-3 rounded-xl shadow-lg shadow-amber-500/20">
                  GENERATE & SEND REPAIR QUOTATION TO CUSTOMER
                </button>
              </form>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
