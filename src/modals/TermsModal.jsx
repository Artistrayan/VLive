import React from 'react';
import { X } from 'lucide-react';

export default function TermsModal({ isTermsModalOpen, setIsTermsModalOpen }) {
  if (!isTermsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md card-3d p-6 border border-pink-500/40 bg-slate-900 rounded-3xl space-y-4 max-h-[80vh] overflow-y-auto text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm">V.Live Terms of Service & Privacy</h3>
          <button onClick={() => setIsTermsModalOpen(false)} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3 text-slate-300 leading-relaxed">
          <p>1. <strong>User Identity:</strong> V.Live requires authentication via Telegram to ensure platform security.</p>
          <p>2. <strong>Live Streaming Guidelines:</strong> Users streaming 4K broadcasts must complete KYC identity verification.</p>
          <p>3. <strong>USDT Cashout & Earnings:</strong> Financial transactions require verified account status.</p>
        </div>
        <button onClick={() => setIsTermsModalOpen(false)} className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold">
          Close
        </button>
      </div>
    </div>
  );
}
