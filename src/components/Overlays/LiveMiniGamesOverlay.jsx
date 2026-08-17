import React, { useState } from 'react';
import { Sparkles, Gift, Flame, Trophy, Coins, RotateCw, X, Award, CheckCircle2 } from 'lucide-react';

const WHEEL_PRIZES = [
  { id: 1, label: '۵۰ سکه 🪙', coins: 50, color: 'from-amber-400 to-yellow-600', icon: '🪙' },
  { id: 2, label: 'تاج VIP 👑', coins: 500, color: 'from-pink-500 to-purple-600', icon: '👑' },
  { id: 3, label: 'پوچ! 💨', coins: 0, color: 'from-slate-700 to-slate-800', icon: '💨' },
  { id: 4, label: '۱۰۰ سکه 🪙', coins: 100, color: 'from-cyan-400 to-blue-600', icon: '💎' },
  { id: 5, label: 'سوپرماشین 🏎️', coins: 2000, color: 'from-red-500 to-rose-700', icon: '🏎️' },
  { id: 6, label: '۲۰ سکه 🪙', coins: 20, color: 'from-emerald-400 to-teal-600', icon: '🪙' },
  { id: 7, label: 'موشک فضایی 🚀', coins: 5000, color: 'from-purple-500 to-indigo-700', icon: '🚀' },
  { id: 8, label: '۵۰۰ سکه 💎', coins: 500, color: 'from-amber-500 to-orange-600', icon: '💎' }
];

export default function LiveMiniGamesOverlay({
  isOpen,
  onClose,
  userCoins = 0,
  setUserCoins,
  showToast,
  onWinPrize
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('wheel'); // 'wheel' | 'mystery_box'
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);

  // Mystery Box states
  const [boxes, setBoxes] = useState([
    { id: 1, opened: false, prize: '۱۰۰ سکه 🪙', coins: 100 },
    { id: 2, opened: false, prize: 'تاج طلایی 👑', coins: 500 },
    { id: 3, opened: false, prize: '۵۰ سکه 🪙', coins: 50 },
    { id: 4, opened: false, prize: 'جت خصوصی ✈️', coins: 3000 },
    { id: 5, opened: false, prize: 'پوچ! 💨', coins: 0 },
    { id: 6, opened: false, prize: '۲۵۰ سکه 🪙', coins: 250 }
  ]);

  // Spin Lucky Wheel
  const handleSpinWheel = () => {
    if (isSpinning) return;
    const spinCost = 30;
    if (userCoins < spinCost) {
      showToast('موجودی سکه برای چرخاندن گردونه کافی نیست (۳۰ سکه نیاز است) ⚠️');
      return;
    }

    setUserCoins(prev => Math.max(0, prev - spinCost));
    setIsSpinning(true);
    setWonPrize(null);

    // Calculate random prize and rotation
    const randomIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const selectedPrize = WHEEL_PRIZES[randomIndex];
    const extraSpins = 5 * 360;
    const targetAngle = extraSpins + (randomIndex * (360 / WHEEL_PRIZES.length));
    
    setRotationAngle(prev => prev + targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(selectedPrize);
      if (selectedPrize.coins > 0) {
        setUserCoins(prev => prev + selectedPrize.coins);
        showToast(`🎉 تبریک! شما برنده ${selectedPrize.label} شدید!`);
        if (onWinPrize) onWinPrize(selectedPrize);
      } else {
        showToast('متاسفانه این بار پوچ بود! دوباره امتحان کن 🔥');
      }
    }, 4000);
  };

  // Open Mystery Box
  const handleOpenBox = (boxId) => {
    const boxCost = 40;
    if (userCoins < boxCost) {
      showToast('موجودی سکه برای بازکردن جعبه شانس کافی نیست (۴۰ سکه) ⚠️');
      return;
    }

    setUserCoins(prev => Math.max(0, prev - boxCost));
    setBoxes(prev => prev.map(b => {
      if (b.id === boxId && !b.opened) {
        if (b.coins > 0) {
          setUserCoins(c => c + b.coins);
          showToast(`🎁 جعبه باز شد: شما برنده ${b.prize} شدید!`);
        } else {
          showToast('💨 این جعبه خالی بود!');
        }
        return { ...b, opened: true };
      }
      return b;
    }));
  };

  return (
    <div className="fixed inset-0 z-[90] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn dir-rtl font-sans">
      <div className="w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-4 shadow-[0_0_50px_rgba(245,158,11,0.3)] space-y-4">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-400/30">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">بازی‌های جایزه‌دار داخل لایو</h3>
              <p className="text-[10px] text-amber-300 font-bold">موجودی شما: {userCoins.toLocaleString()} 🪙</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TABS (Lucky Wheel vs Mystery Box) */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveTab('wheel')}
            className={`py-2 rounded-2xl text-xs font-black border transition ${
              activeTab === 'wheel' 
                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md' 
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            🎡 گردونه شانس
          </button>
          <button
            onClick={() => setActiveTab('mystery_box')}
            className={`py-2 rounded-2xl text-xs font-black border transition ${
              activeTab === 'mystery_box' 
                ? 'bg-pink-500 text-white border-pink-500 shadow-md' 
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            🎁 جعبه‌های اسرارآمیز
          </button>
        </div>

        {/* TAB 1: LUCKY WHEEL */}
        {activeTab === 'wheel' && (
          <div className="space-y-4 text-center">
            {/* Wheel graphic */}
            <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
              {/* Pointer */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-6 h-6 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.9)] animate-bounce">
                ▼
              </div>

              {/* Rotating disk */}
              <div 
                style={{ 
                  transform: `rotate(${rotationAngle}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none'
                }}
                className="w-full h-full rounded-full border-4 border-amber-400 bg-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.5)] overflow-hidden relative"
              >
                {WHEEL_PRIZES.map((item, idx) => {
                  const angle = (360 / WHEEL_PRIZES.length) * idx;
                  return (
                    <div 
                      key={item.id}
                      style={{ 
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: '50% 50%'
                      }}
                      className="absolute inset-0 flex items-start justify-center pt-2"
                    >
                      <span className="text-[10px] font-black text-white bg-slate-900/80 px-1.5 py-0.5 rounded-full border border-white/20">
                        {item.icon} {item.coins > 0 ? item.coins : ''}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Center Spin Button */}
              <button
                disabled={isSpinning}
                onClick={handleSpinWheel}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-xs shadow-xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition disabled:opacity-75"
              >
                <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>چرخش</span>
                <span className="text-[8px]">۳۰ 🪙</span>
              </button>
            </div>

            {wonPrize && (
              <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 animate-bounce">
                <p className="text-xs font-black text-amber-300">
                  🎉 جایزه شما: {wonPrize.label}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MYSTERY BOXES */}
        {activeTab === 'mystery_box' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 text-center">یک جعبه را انتخاب و شانس خود را امتحان کنید (۴۰ سکه)</p>
            <div className="grid grid-cols-3 gap-2.5">
              {boxes.map(box => (
                <button
                  key={box.id}
                  disabled={box.opened}
                  onClick={() => handleOpenBox(box.id)}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition ${
                    box.opened 
                      ? 'bg-slate-950/40 border-slate-800 opacity-60' 
                      : 'bg-gradient-to-b from-pink-900/40 to-slate-950 border-pink-500/40 hover:scale-105 active:scale-95 shadow-md shadow-pink-500/10'
                  }`}
                >
                  <span className="text-2xl">{box.opened ? '✨' : '🎁'}</span>
                  <span className="text-[10px] font-black text-white truncate w-full text-center">
                    {box.opened ? box.prize : `جعبه ${box.id}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
