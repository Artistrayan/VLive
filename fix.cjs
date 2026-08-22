const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const badBlockStart = `    // Broadcast real-time like event
    broadcastLiveEvent('LIVE_LIKE', {
      streamId: viewingStream ? viewingStream.id : '  const handleOpenLuckyBox = () => {`;
const badBlockEnd = `  // SPIN LUCKY WHEEL HANDLER
  const handleSpinLuckyWheel = () => {
    showToast(loc('گردونه شانس در حال اتصال به سرور است...', 'Lucky wheel is connecting to the server...'));
  };ری؟ امیدوارم کارت عالی باشه!';else if (messageText.toLowerCase().includes('thank')) translatedText = 'خیلی ممنونم ازت!';else if (messageText.toLowerCase().includes('awesome') || messageText.toLowerCase().includes('great')) translatedText = 'عالی و فوق‌العاده است!';else translatedText = \`[ترجمه به فارسی]: \${messageText}\`;`;

const fixedBlock = `    // Broadcast real-time like event
    broadcastLiveEvent('LIVE_LIKE', {
      streamId: viewingStream ? viewingStream.id : 'default',
      user: userName,
      count: 1
    });
  };

  // Real-time Listener for concurrent users/tabs messages & likes

  const handleTranslateChatMessage = async (msgId, messageText) => {
    const currentConv = conversations.find(c => c.id === activeConversationId);
    const targetMsg = currentConv?.messages?.find(m => m.id === msgId);
    if (targetMsg?.translated) {
      setConversations(prev => prev.map(c => c.id === activeConversationId ? {
        ...c,
        messages: c.messages.map(m => m.id === msgId ? {
          ...m,
          translated: false
        } : m)
      } : c));
      return;
    }
    if (targetMsg?.translation && targetMsg?.translationLang === langCode) {
      setConversations(prev => prev.map(c => c.id === activeConversationId ? {
        ...c,
        messages: c.messages.map(m => m.id === msgId ? {
          ...m,
          translated: true
        } : m)
      } : c));
      return;
    }
    showToast(loc('🌐 در حال ترجمه پیام با AI...', '🌐 Translating the message with AI...'));
    try {
      const targetLang = currentAppLang || langCode || 'en';
      let translatedText = messageText;
      if (targetLang === 'en') {
        if (messageText.includes('سلام') || messageText.includes('درود')) translatedText = 'Hello! How are you doing today?';else if (messageText.includes('چطوری') || messageText.includes('حالت')) translatedText = 'How are you? Hope you are having a great time!';else if (messageText.includes('مرسی') || messageText.includes('ممنون')) translatedText = 'Thank you so much!';else if (messageText.includes('عالی')) translatedText = 'Awesome, that looks fantastic!';else if (messageText.includes('لایو')) translatedText = 'Loved your live stream!';else translatedText = \`[Translated to EN]: \${messageText}\`;
      } else if (targetLang === 'fa') {
        if (messageText.toLowerCase().includes('hello') || messageText.toLowerCase().includes('hi')) translatedText = 'سلام! روزت بخیر و شادمانی';else if (messageText.toLowerCase().includes('how are you')) translatedText = 'چطوری؟ امیدوارم کارت عالی باشه!';else if (messageText.toLowerCase().includes('thank')) translatedText = 'خیلی ممنونم ازت!';else if (messageText.toLowerCase().includes('awesome') || messageText.toLowerCase().includes('great')) translatedText = 'عالی و فوق‌العاده است!';else translatedText = \`[ترجمه به فارسی]: \${messageText}\`;`;

code = code.replace(badBlockStart + code.substring(code.indexOf(badBlockStart) + badBlockStart.length, code.indexOf(badBlockEnd)) + badBlockEnd, fixedBlock);

fs.writeFileSync('src/App.jsx', code);
console.log('Fixed block in App.jsx');
