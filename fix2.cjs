const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const oldCode = `  const handleOpenLuckyBox = () => {
    if (userCoins < 100) {
      showToast('100 coins required to open Mystery Lucky Box');
      return;
    }
    setUserCoins(prev => prev - 100);
    const winAmount = Math.floor(Math.random() * 400) + 50; // win 50 to 450 coins
    setUserCoins(prev => prev + winAmount);
    showToast(\`Mystery Box Opened! You won \${winAmount} Coins!\`);
  };

  // PK BATTLE TIMER EFFECT

  // SPIN LUCKY WHEEL HANDLER
  const handleSpinLuckyWheel = () => {
    if (isWheelSpinning) return;
    if (dailyFreeSpins <= 0 && userCoins < 50) {
      showToast('Insufficient coins for extra spin (50 coins required)');
      return;
    }
    if (dailyFreeSpins <= 0) {
      setUserCoins(prev => prev - 50);
    } else {
      setDailyFreeSpins(prev => prev - 1);
    }
    setIsWheelSpinning(true);
    setWonPrize(null);
    // 8 PRIZES IN WHEEL: 45deg per slice
    const prizes = [{
      text: '100 Free Coins 🪙',
      coins: 100,
      iconName: 'Coins'
    }, {
      text: 'Red Rose Gift 🌹',
      coins: 0,
      gift: 'Red Rose',
      iconName: 'Flower'
    }, {
      text: '50 Coins 🪙',
      coins: 50,
      iconName: 'Coins'
    }, {
      text: '1-Day VIP Badge ✨',
      coins: 0,
      vip: true,
      iconName: 'Crown'
    }, {
      text: '500 Coins 💎',
      coins: 500,
      iconName: 'Gem'
    }, {
      text: 'Supercar Gift 🏎️',
      coins: 0,
      gift: 'Sports Car',
      iconName: 'Zap'
    }, {
      text: '10 Coins 🪙',
      coins: 10,
      iconName: 'Coins'
    }, {
      text: '1000 Coins Jackpot! 🏆',
      coins: 1000,
      iconName: 'Sparkles'
    }];
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const sliceDeg = 360 / prizes.length;
    const targetDeg = 360 * 5 + (360 - (prizeIndex * sliceDeg + sliceDeg / 2));
    setWheelRotationDeg(targetDeg);
    setTimeout(() => {
      setIsWheelSpinning(false);
      const prize = prizes[prizeIndex];
      setWonPrize(prize);
      if (prize.coins > 0) {
        setUserCoins(prev => prev + prize.coins);
      }
      showToast(\`Congratulations! You won \${prize.text} 🎉\`);
    }, 4000);
  };`;

const newCode = `  const handleOpenLuckyBox = () => {
    showToast(loc('در حال اتصال به سرور برای دریافت جایزه...', 'Connecting to server to get prize...'));
  };

  // PK BATTLE TIMER EFFECT

  // SPIN LUCKY WHEEL HANDLER
  const handleSpinLuckyWheel = () => {
    showToast(loc('گردونه شانس در حال اتصال به سرور است...', 'Lucky wheel is connecting to the server...'));
  };`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/App.jsx', code);
console.log('Fixed lucky wheels in App.jsx');
