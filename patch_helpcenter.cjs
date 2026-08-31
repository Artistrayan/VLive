const fs = require('fs');
const file = 'src/modals/HelpCenterModal.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove BEP20 option
content = content.replace(/<option value="usdt_bep20">[^<]*<\/option>/g, '');

fs.writeFileSync(file, content);
console.log('patched helpcenter');
