const fs = require('fs');
const file = 'src/components/Tabs/WalletTab.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove BEP20 options
content = content.replace(/<option value="USDT BEP20">[^<]*<\/option>/g, '');
content = content.replace(/<option value="usdt_bep20">[^<]*<\/option>/g, '');

fs.writeFileSync(file, content);
console.log('patched wallet bep20');
