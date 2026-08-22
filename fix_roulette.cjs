const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `                    const randomPartner = realPartners[Math.floor(Math.random() * realPartners.length)];
                    setMatchedMatchUser(randomPartner);
                    setMatchState('connected');
                    setFreeMatchCallsLeft(prev => Math.max(0, prev - 1));
                    setMatchCallSeconds(30);
                    showToast(window.loc(\`🎉 مچ موفق با \${randomPartner.name || randomPartner.username}!\`, \`🎉 Successful match with \${randomPartner.name || randomPartner.username}!\`));`;

const newStr = `                    setMatchState('idle');
                    showToast(window.loc('در حال حاضر هیچ کاربری برای مچ ویدئویی آنلاین نیست', 'No users available for video match currently'));`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, newStr);
    fs.writeFileSync('src/App.jsx', code);
    console.log('Fixed Video Roulette fake data');
} else {
    console.log('Video Roulette string not found');
}
