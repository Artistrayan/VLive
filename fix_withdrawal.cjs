const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const withdrawalStart = `  // SUBMIT FEMALE HOST PAYOUT / WITHDRAWAL REQUEST`;
const withdrawalEnd = `  // COPY TO CLIPBOARD HANDLER`;

let withdrawalBlock = code.substring(code.indexOf(withdrawalStart), code.indexOf(withdrawalEnd));

const newWithdrawalBlock = `  // SUBMIT FEMALE HOST PAYOUT / WITHDRAWAL REQUEST
  const handleSubmitWithdrawal = async () => {
    const grossUsdt = coinsToWithdraw / 50;
    
    if (coinsToWithdraw <= 0 || grossUsdt <= 0) {
       showToast(loc('مبلغ نامعتبر', 'Invalid amount'));
       return;
    }
    
    if (coinsToWithdraw > userCoins) {
       showToast(loc('موجودی سکه ناکافی است', 'Insufficient coin balance'));
       return;
    }
    
    const targetWallet = withdrawUsdtAddressInput.trim() || hostUsdtAddress;
    if (!targetWallet) {
       showToast(loc('آدرس کیف پول وارد نشده است', 'Wallet address is missing'));
       return;
    }

    const res = await apiWallet.requestWithdrawal(grossUsdt, targetWallet, withdrawMethodInput);
    
    if (res && res.success) {
      setUserCoins(prev => prev - coinsToWithdraw);
      setWithdrawUsdtAddressInput('');
      setWithdrawalPinInput('');
      showToast(window.loc(\`💸 درخواست برداشت $\${grossUsdt.toFixed(2)} USDT ثبت شد و در حال بررسی است!\`, \`💸 درخواست برداشت $\${grossUsdt.toFixed(2)} USDT ثبت شد و در حال بررسی است!\`));
      
      const newTxs = await apiWallet.getTransactions();
      setTxHistoryList(newTxs || []);
    } else {
      showToast(loc('خطا در ثبت درخواست برداشت', 'Error submitting withdrawal request') + (res?.error ? \`: \${res.error}\` : ''));
    }
  };

`;

code = code.replace(withdrawalBlock, newWithdrawalBlock);
fs.writeFileSync('src/App.jsx', code);
console.log('Fixed submit withdrawal');
