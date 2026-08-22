const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const confirmDepositStart = `  // Confirm USDT Deposit`;
const confirmDepositEnd = `  // SUBMIT FEMALE HOST PAYOUT / WITHDRAWAL REQUEST`;

let confirmDepositBlock = code.substring(code.indexOf(confirmDepositStart), code.indexOf(confirmDepositEnd));

const newConfirmDepositBlock = `  // Confirm USDT Deposit
  const handleConfirmDeposit = () => {
    if (!depositTxId.trim()) {
      showToast(window.loc('لطفاً کد رهگیری TXID را وارد کنید', 'Please enter TRON TXID reference code'));
      return;
    }
    showToast(window.loc('✅ درخواست واریز ثبت شد و پس از تایید مدیر اعمال می‌شود.', '✅ Deposit request submitted and will be applied after admin approval.'));
    setDepositTxId('');
  };

`;

code = code.replace(confirmDepositBlock, newConfirmDepositBlock);
fs.writeFileSync('src/App.jsx', code);
console.log('Fixed confirm deposit');
