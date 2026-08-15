import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Wrench, CheckCircle2, XCircle, FileText, Send, Paperclip, Clock, ShieldCheck } from 'lucide-react';
import Timeline from '../components/Timeline';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function RepairTrackPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const queryNumber = searchParams.get('repairNumber') || '';
  const queryEmail = searchParams.get('email') || '';

  const [repairNumber, setRepairNumber] = useState(queryNumber);
  const [email, setEmail] = useState(queryEmail);
  const [repairData, setRepairData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageFile, setMessageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRepairDetails = async (num, em) => {
    if (!num) return;
    setLoading(true);
    try {
      const res = await api.get(`/repairs/track?repairNumber=${encodeURIComponent(num)}&email=${encodeURIComponent(em)}`);
      if (res.success) {
        setRepairData(res.data);
        if (res.data.repair?.id) {
          fetchMessages(res.data.repair.id);
        }
      }
    } catch (err) {
      showToast(err.message || 'No repair ticket found matching the criteria', 'error');
      setRepairData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (repairId) => {
    try {
      const res = await api.get(`/repairs/${repairId}/messages`);
      if (res.success) {
        setMessages(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to load ticket messages');
    }
  };

  useEffect(() => {
    if (queryNumber) {
      fetchRepairDetails(queryNumber, queryEmail);
    }
  }, [queryNumber, queryEmail]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (repairNumber.trim()) {
      setSearchParams({ repairNumber: repairNumber.trim(), email: email.trim() });
      fetchRepairDetails(repairNumber.trim(), email.trim());
    }
  };

  const handleQuoteDecision = async (quoteId, decision) => {
    setActionLoading(true);
    try {
      const res = await api.post(`/repairs/quote/${quoteId}/decision`, { decision });
      if (res.success) {
        showToast(res.message, 'success');
        fetchRepairDetails(repairNumber, email);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update quotation decision', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !messageFile) return;

    try {
      const payload = new FormData();
      payload.append('message', newMessage);
      payload.append('senderName', repairData?.repair?.customerName || 'Customer');
      if (messageFile) {
        payload.append('attachment', messageFile);
      }

      const res = await api.post(`/repairs/${repairData.repair.id}/messages`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.success) {
        setNewMessage('');
        setMessageFile(null);
        fetchMessages(repairData.repair.id);
      }
    } catch (err) {
      showToast(err.message || 'Failed to send message', 'error');
    }
  };

  const repair = repairData?.repair;
  const quotes = repair?.quotes || [];
  const latestQuote = quotes.length > 0 ? quotes[quotes.length - 1] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Search Box */}
      <div className="max-w-2xl mx-auto bg-[#131b2e] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto">
          <Wrench className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Track Computer Repair Status</h1>
        <p className="text-xs text-gray-400">Enter your repair number (e.g. REP-2026-000101) and contact email.</p>

        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <input
            type="text"
            required
            placeholder="Repair Number..."
            value={repairNumber}
            onChange={(e) => setRepairNumber(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-white"
          />
          <input
            type="email"
            placeholder="Email Address (Optional)..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
          >
            <Search className="w-4 h-4" /> {loading ? 'Searching...' : 'Track Ticket'}
          </button>
        </form>
      </div>

      {/* Ticket Details & Timeline */}
      {repair && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Ticket Information Card */}
          <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Repair Ticket</span>
                <h2 className="text-2xl font-extrabold text-white mt-0.5">{repair.repairNumber}</h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-950 text-amber-300 border border-amber-500/40">
                  {repair.status}
                </span>
              </div>
            </div>

            {/* Device Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-gray-500 block uppercase">Customer</span>
                <span className="font-bold text-white">{repair.customerName}</span>
              </div>
              <div>
                <span className="text-gray-500 block uppercase">Device</span>
                <span className="font-bold text-white">{repair.brand} {repair.model} ({repair.deviceType})</span>
              </div>
              <div>
                <span className="text-gray-500 block uppercase">Problem Category</span>
                <span className="font-bold text-amber-400">{repair.problemCategory}</span>
              </div>
              <div>
                <span className="text-gray-500 block uppercase">Serial Number</span>
                <span className="font-bold text-white">{repair.serialNumber || 'N/A'}</span>
              </div>
            </div>

            {/* 15-Stage Timeline */}
            <div className="pt-4 border-t border-gray-800">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">15-Stage Progress Tracker</h3>
              <Timeline stages={repairData.stages} currentStageIndex={repairData.currentStageIndex} />
            </div>
          </div>

          {/* Quotation Section */}
          {latestQuote && (
            <div className="bg-gray-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-extrabold text-white">Technician Itemized Repair Quotation</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  latestQuote.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                  latestQuote.status === 'REJECTED' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                  'bg-amber-950 text-amber-300 border border-amber-500/40'
                }`}>
                  Quotation Status: {latestQuote.status}
                </span>
              </div>

              {/* Items Breakdown Table */}
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400">
                      <th className="pb-2">Description / Replacement Part</th>
                      <th className="pb-2 text-center">Part #</th>
                      <th className="pb-2 text-center">Qty</th>
                      <th className="pb-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 text-gray-200">
                    {latestQuote.items?.map((item, idx) => (
                      <tr key={idx} className="py-2">
                        <td className="py-2.5 font-bold text-white">{item.description}</td>
                        <td className="py-2.5 text-center text-gray-500 font-mono">{item.partNumber || '-'}</td>
                        <td className="py-2.5 text-center font-bold">{item.quantity}</td>
                        <td className="py-2.5 text-right font-extrabold text-blue-400">${parseFloat(item.totalPrice).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quotation Subtotals */}
              <div className="bg-[#131b2e] rounded-2xl p-4 space-y-2 text-xs text-gray-300 max-w-sm ml-auto">
                <div className="flex justify-between">
                  <span>Diagnostic Fee:</span>
                  <span className="font-bold text-white">${parseFloat(latestQuote.diagnosticFee).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Technician Labor:</span>
                  <span className="font-bold text-white">${parseFloat(latestQuote.laborCost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Return Shipping:</span>
                  <span className="font-bold text-white">${parseFloat(latestQuote.shippingCost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-800 pt-2 text-sm font-extrabold text-white">
                  <span>Total Repair Quote:</span>
                  <span className="text-amber-400 text-base">${parseFloat(latestQuote.totalAmount).toFixed(2)}</span>
                </div>
              </div>

              {/* Approval Buttons */}
              {latestQuote.status === 'PENDING' && (
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => handleQuoteDecision(latestQuote.id, 'REJECT')}
                    disabled={actionLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> REJECT QUOTATION
                  </button>

                  <button
                    onClick={() => handleQuoteDecision(latestQuote.id, 'APPROVE')}
                    disabled={actionLoading}
                    className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" /> APPROVE REPAIR QUOTATION
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Ticket Messages Board */}
          <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-extrabold text-white border-b border-gray-800 pb-3">
              Support & Technician Messaging
            </h3>

            {/* Message Thread */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-6">No messages yet. Send a message to communicate with your technician.</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl max-w-xl text-xs space-y-1 ${
                      msg.senderRole === 'CUSTOMER'
                        ? 'ml-auto bg-blue-900/60 border border-blue-700/50 text-blue-100'
                        : 'mr-auto bg-gray-900 border border-gray-800 text-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 mb-1">
                      <span>{msg.senderName} ({msg.senderRole})</span>
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="leading-relaxed">{msg.message}</p>
                    {msg.attachmentUrl && (
                      <a href={msg.attachmentUrl} target="_blank" rel="noreferrer" className="inline-block text-[11px] text-cyan-400 font-bold underline mt-1">
                        View Attachment
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Send Message Form */}
            <form onSubmit={handleSendMessage} className="space-y-3 pt-4 border-t border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message to your assigned technician..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white"
                />
                <label className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white cursor-pointer">
                  <Paperclip className="w-4 h-4" />
                  <input type="file" onChange={(e) => setMessageFile(e.target.files[0])} className="hidden" />
                </label>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </div>
              {messageFile && <p className="text-[10px] text-cyan-400 font-bold">Attached: {messageFile.name}</p>}
            </form>

          </div>

        </div>
      )}

    </div>
  );
}
