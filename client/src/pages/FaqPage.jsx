import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'How long does international shipping take?',
      a: 'Standard international shipping takes 5-7 business days. Express priority air shipping via DHL/FedEx arrives within 2-3 business days. All shipments include real-time tracking.'
    },
    {
      q: 'What is covered under the NEXORA warranty?',
      a: 'All custom gaming PCs and standalone components come with official brand warranties plus 2-3 years of NEXORA parts and labor protection. We handle all RMA processes directly.'
    },
    {
      q: 'How does the online Computer Repair quotation work?',
      a: 'After submitting a repair ticket online, you send your device to our lab. Our technicians perform diagnostic testing and upload an itemized quote to your dashboard for approval before any work begins.'
    },
    {
      q: 'Are custom PC build components verified for compatibility?',
      a: 'Yes! Our Custom PC Builder automatically checks CPU socket types, RAM generation (DDR4 vs DDR5), motherboard clearance, and estimated system wattage draw.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept major credit cards via Stripe (Visa, MasterCard, American Express), PayPal, Apple Pay, and Bitcoin.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Help Center</span>
        <h1 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-[#131b2e] border border-gray-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full p-5 text-left font-bold text-white flex items-center justify-between text-sm"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openIndex === idx ? 'rotate-180 text-blue-400' : ''}`} />
            </button>
            {openIndex === idx && (
              <div className="p-5 pt-0 text-xs text-gray-300 border-t border-gray-800/60 leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
