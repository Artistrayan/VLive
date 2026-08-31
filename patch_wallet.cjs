const fs = require('fs');
const file = 'src/components/Tabs/WalletTab.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove BEP20 from payment method selector
content = content.replace(
  /<button\s*onClick=\{[^}]*\}\s*className=\{[^}]*\s*selectedCoinPackPayment === 'USDT BEP20'[^}]*\}[\s\S]*?<\/button>/m,
  ''
);

// If they selected buy coins, prompt them with the real support ticket logic
content = content.replace(
  "const handleBuyCoinsPack = props.handleBuyCoinsPack || ((pack) => showToast(window.loc('خرید بسته کوین با موفقیت انجام شد', 'The purchase of the coin package has been successfully completed')));",
  `const handleBuyCoinsPack = props.handleBuyCoinsPack || (async (packCoins, packPrice) => {
    if (selectedCoinPackPayment !== 'USDT TRC20') {
      showToast(window.loc('فقط درگاه پرداخت تتر فعال است.', 'Only Tether payment is active.'));
      return;
    }
    const txInput = prompt(window.loc('لطفا برای تایید خرید ' + packCoins + ' سکه، کد هش تراکنش تتر به آدرس TQY2B6FvF2U7n3b8V9Z4Y3K9X5U7n3b8V9 را وارد کنید:', 'Please enter the USDT TRC20 Tx Hash sent to TQY2B6FvF2U7n3b8V9Z4Y3K9X5U7n3b8V9 to verify purchase of ' + packCoins + ' coins:'));
    if (txInput && txInput.length > 10) {
        try {
            const { apiSupport } = await import('../../services/api');
            const res = await apiSupport.submitTicket(
                'Coin Pack Purchase (USDT)',
                \`User requested \${packCoins} coins for $\${packPrice}.\\nTX Hash: \${txInput}\\nMethod: USDT TRC20\`
            );
            if (res && res.success !== false) {
                showToast(window.loc('درخواست خرید ثبت شد. پس از تایید شبکه اعمال می‌شود.', 'Purchase request submitted. Will be applied after network confirmation.'));
            } else {
                showToast(res?.error || 'Failed to submit request');
            }
        } catch(e) {
            showToast('API error');
        }
    } else if (txInput) {
        showToast(window.loc('کد هش نامعتبر است', 'Invalid TX Hash'));
    }
  });`
);

fs.writeFileSync(file, content);
console.log('patched wallet');
