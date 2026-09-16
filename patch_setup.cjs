const fs = require('fs');
let content = fs.readFileSync('src/components/LiveStreamSystem.jsx', 'utf8');

const oldStandardIcon = '<Video className="w-5 h-5 text-pink-400" />';
const newStandardIcon = '<Flame className="w-6 h-6 text-pink-400 drop-shadow-md group-hover:scale-110 transition-transform duration-300" />';

const oldAdultIcon = '<Flame className="w-5 h-5 text-amber-400 animate-pulse" />';
const newAdultIcon = '<span className="text-xl font-black tracking-tighter drop-shadow-md group-hover:scale-110 transition-transform duration-300">+18</span>';

if (content.includes(oldStandardIcon)) {
    content = content.replace(oldStandardIcon, newStandardIcon);
    console.log('Fixed setup standard icon');
}
if (content.includes(oldAdultIcon)) {
    content = content.replace(oldAdultIcon, newAdultIcon);
    console.log('Fixed setup adult icon');
}

fs.writeFileSync('src/components/LiveStreamSystem.jsx', content);
