import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Share2, Download, Check, QrCode, Scan, User, Sparkles, Crown, Shield } from 'lucide-react';

export default function QrCodeModal({
  isOpen,
  onClose,
  currentUser,
  userName,
  currentUsername,
  authUsername,
  userAvatar,
  userRole,
  userLevel = 1,
  vipPlan = 'Free',
  showToast,
  loc,
  isRtl
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('my_code'); // 'my_code' | 'scan'
  const [scanInput, setScanInput] = useState('');
  const qrRef = useRef(null);

  if (!isOpen) return null;

  const safeLoc = (fa, en) => {
    if (typeof loc === 'function') return loc(fa, en);
    if (typeof window !== 'undefined' && typeof window.loc === 'function') return window.loc(fa, en);
    return fa;
  };

  const displayName = userName || (currentUser && currentUser.name) || currentUsername || 'V.Live User';
  const displayUsername = currentUsername || authUsername || (currentUser && currentUser.username) || 'user';
  
  // Construct real profile share URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vlive.app';
  const profileUrl = `${origin}?user=${encodeURIComponent(displayUsername)}`;

  const handleCopyLink = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(profileUrl);
      } else {
        const input = document.createElement('input');
        input.value = profileUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      if (showToast) showToast(safeLoc('لینک پروفایل کپی شد 📋', 'Profile link copied 📋'));
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      if (showToast) showToast(safeLoc('خطا در کپی لینک', 'Failed to copy link'));
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName} on V.Live`,
          text: safeLoc(`پروفایل من را در وی‌لایو دنبال کنید: @${displayUsername}`, `Follow my profile on V.Live: @${displayUsername}`),
          url: profileUrl,
        });
      } catch (err) {
        // User cancelled share or not supported
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadQr = () => {
    try {
      const svg = qrRef.current?.querySelector('svg');
      if (!svg) return;
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width + 40;
        canvas.height = img.height + 40;
        if (ctx) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 20, 20);
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `vlive_qr_${displayUsername}.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
          if (showToast) showToast(safeLoc('تصویر QR دانلود شد 📥', 'QR image downloaded 📥'));
        }
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (e) {
      if (showToast) showToast(safeLoc('خطا در دانلود تصویر', 'Failed to download image'));
    }
  };

  const handleManualScanSubmit = (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    let target = scanInput.trim();
    if (target.includes('user=')) {
      try {
        const url = new URL(target);
        target = url.searchParams.get('user') || target;
      } catch (e) {
        const match = target.match(/user=([^&]+)/);
        if (match) target = match[1];
      }
    }
    target = target.replace('@', '');
    if (showToast) showToast(safeLoc(`در حال انتقال به پروفایل @${target}...`, `Navigating to @${target}...`));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-sm bg-slate-900/95 border border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] space-y-4 relative overflow-hidden flex flex-col">
        
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                {safeLoc('کد QR پروفایل', 'Profile QR Code')}
              </h3>
              <p className="text-[10px] text-slate-400">
                {safeLoc('اشتراک‌گذاری آسان صفحه کاربری', 'Easy Profile Sharing')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-Tabs (My QR / Scan) */}
        <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800/80 z-10">
          <button
            onClick={() => setActiveTab('my_code')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'my_code'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{safeLoc('کد من', 'My QR Code')}</span>
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'scan'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>{safeLoc('اسکن کد', 'Scan QR')}</span>
          </button>
        </div>

        {/* Tab 1: My QR Code */}
        {activeTab === 'my_code' && (
          <div className="flex flex-col items-center space-y-4 z-10">
            {/* QR Card Presentation */}
            <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-inner relative">
              {/* User Avatar & Name Overlay */}
              <div className="flex items-center gap-2.5 mb-3 w-full justify-center">
                <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 to-pink-500 shadow-md shrink-0">
                  <img
                    src={userAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${displayUsername}`}
                    alt={displayName}
                    className="w-full h-full rounded-full object-cover bg-slate-900"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${displayUsername}`;
                    }}
                  />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black text-white">{displayName}</span>
                    {vipPlan && vipPlan !== 'Free' && (
                      <Crown className="w-3 h-3 text-amber-400" />
                    )}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">@{displayUsername}</div>
                </div>
              </div>

              {/* QR Code Canvas */}
              <div ref={qrRef} className="p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-cyan-400/50">
                <QRCodeSVG
                  value={profileUrl}
                  size={175}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: userAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${displayUsername}`,
                    x: undefined,
                    y: undefined,
                    height: 36,
                    width: 36,
                    excavate: true,
                  }}
                />
              </div>

              <div className="mt-3 text-[10px] text-slate-400 text-center flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>{safeLoc('اسکن کنید تا وارد پروفایل شوید', 'Scan to open profile')}</span>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-3 gap-2 w-full">
              <button
                onClick={handleCopyLink}
                className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-[11px] font-bold flex flex-col items-center justify-center gap-1 border border-slate-700 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                <span>{copied ? safeLoc('کپی شد', 'Copied') : safeLoc('کپی لینک', 'Copy Link')}</span>
              </button>

              <button
                onClick={handleShare}
                className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-[11px] font-bold flex flex-col items-center justify-center gap-1 border border-slate-700 transition"
              >
                <Share2 className="w-4 h-4 text-pink-400" />
                <span>{safeLoc('اشتراک', 'Share')}</span>
              </button>

              <button
                onClick={handleDownloadQr}
                className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-[11px] font-bold flex flex-col items-center justify-center gap-1 border border-slate-700 transition"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>{safeLoc('دانلود QR', 'Save Image')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Scan QR Code */}
        {activeTab === 'scan' && (
          <div className="flex flex-col items-center space-y-4 py-2 z-10">
            <div className="w-full h-44 border-2 border-dashed border-pink-500/40 rounded-2xl bg-slate-950/60 flex flex-col items-center justify-center p-4 text-center space-y-2 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center animate-pulse">
                <Scan className="w-6 h-6 text-pink-400" />
              </div>
              <div className="text-xs font-bold text-white">
                {safeLoc('اسکن مستقیم یا جستجوی شناسه', 'Direct Scan & Search')}
              </div>
              <p className="text-[10px] text-slate-400">
                {safeLoc('لینک یا نام کاربری را در کادر زیر وارد کنید', 'Enter profile link or username below')}
              </p>
            </div>

            <form onSubmit={handleManualScanSubmit} className="w-full space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder={safeLoc('لینک QR یا @username ...', 'Enter QR URL or @username ...')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-pink-500 outline-none pr-9"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-pink-500/25 transition active:scale-95"
              >
                {safeLoc('مشاهده پروفایل 🔍', 'Open Profile 🔍')}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
