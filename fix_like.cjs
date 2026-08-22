const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const oldCode = `                        // 50% chance of mutual match celebration
                        if (Math.random() > 0.3) {
                          setMatchResultPopup(target);
                        } else {
                          showToast(\`❤️ Liked @\${target.name}!\`);
                        }`;
const newCode = `                        showToast(\`❤️ Liked @\${target.name}!\`);`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/App.jsx', code);
console.log('Fixed like button');
