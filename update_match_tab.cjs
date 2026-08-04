const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add new state declarations if not existing
if (!content.includes('matchMode')) {
  content = content.replace(
    "const [freeMatchCallsLeft, setFreeMatchCallsLeft] = useState(3);",
    "const [freeMatchCallsLeft, setFreeMatchCallsLeft] = useState(3);\n  const [matchMode, setMatchMode] = useState('random'); // 'random' | 'manual'\n  const [matchGenderFilter, setMatchGenderFilter] = useState('both'); // 'both' | 'female' | 'male'\n  const [isMatchRulesModalOpen, setIsMatchRulesModalOpen] = useState(false);"
  );
}

// 2. Add startRandomMatchSearch helper function
const helperFuncs = `
  const startRandomMatchSearch = () => {
    if (freeMatchCallsLeft > 0) {
      setFreeMatchCallsLeft(prev => Math.max(0, prev - 1));
      showToast(\`🎁 از سهمیه تماس رایگان استفاده شد (باقی‌مانده: \${freeMatchCallsLeft - 1})\`);
    } else {
      if (matchGenderFilter === 'female' || matchGenderFilter === 'male') {
        if (userCoins < 10) {
          showToast('⚠️ موجودی سکه شما برای فیلتر کافی نیست! لطفاً کیف پول را شارژ کنید.');
          setActiveTab('wallet');
          return;
        } else {
          setUserCoins(c => Math.max(0, c - 10));
          showToast('🪙 ۱۰ سکه بابت فیلتر جنسیت کسر شد');
        }
      } else {
        showToast('🆓 شروع مچ هوشمند هر دو (رایگان)');
      }
    }

    setMatchState('searching');
    setTimeout(() => {
      const validTargets = (Array.isArray(usersList) && usersList.length > 0)
        ? usersList.filter(u => u && u.username !== currentUsername && u.user_type !== 'TEST_USER' && u.user_type !== 'DEMO_USER')
        : [
            { id: 101, name: 'سارا ملکی', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', city: 'تهران', isVerified: true, isStreamer: true },
            { id: 102, name: 'الناز کریمی', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', city: 'شیراز', isVerified: true, isStreamer: false },
            { id: 103, name: 'سحر محمودی', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', city: 'مشهد', isVerified: true, isStreamer: true }
          ];

      const randomTarget = validTargets[Math.floor(Math.random() * validTargets.length)] || validTargets[0];
      setMatchedMatchUser(randomTarget);
      setMatchState('connected');

      const isStreamer = randomTarget.isStreamer || randomTarget.user_type === 'STREAMER' || randomTarget.isVerifiedStreamer;
      if (isStreamer) {
        showToast(\`⭐ اتصال با استریمر \${randomTarget.name}: ۲۰ ثانیه اول رایگان است!\`);
      } else {
        showToast(\`🎉 اتصال با \${randomTarget.name}! مهلت تماس رایگان: ۳۰ ثانیه\`);
      }

      handleInitiateCall(randomTarget, 'video', '1on1');
    }, 2500);
  };
`;

if (!content.includes('startRandomMatchSearch')) {
  content = content.replace(
    "  const handleRandomMatch = () => {",
    helperFuncs + "\n  const handleRandomMatch = () => {"
  );
}

fs.writeFileSync('src/App.jsx', content);
console.log('States & functions updated in App.jsx');
