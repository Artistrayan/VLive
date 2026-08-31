const fs = require('fs');
const content = fs.readFileSync('src/components/Tabs/WalletTab.jsx', 'utf8');
console.log(content.indexOf('USDT TRC20'));
