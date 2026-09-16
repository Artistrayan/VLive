const fs = require('fs');
let content = fs.readFileSync('src/components/LiveStreamSystem.jsx', 'utf8');

const oldStandardIcon = '<Video className="w-5 h-5 text-cyan-300" />';
const newStandardIcon = '<Flame className="w-6 h-6 text-pink-400 drop-shadow-md group-hover:scale-110 transition-transform duration-300" />';

const oldAdultIcon = '<Flame className="w-5 h-5 text-amber-400 animate-pulse" />';
const newAdultIcon = '<span className="text-lg font-black tracking-tighter drop-shadow-md group-hover:scale-110 transition-transform duration-300">+18</span>';

if (content.includes(oldStandardIcon)) {
    content = content.replace(oldStandardIcon, newStandardIcon);
    console.log('Changed Standard icon to Flame');
} else {
    console.log('Standard icon not found', oldStandardIcon);
}

// I should make sure I only replace the adult icon in the TABS, not everywhere else in the page.
// The tabs are around line 320. 
const startTabs = '/* MAIN TYPE TOGGLE (Standard Live vs Adult Live 18+) */';
if (content.includes(startTabs)) {
    let indexStart = content.indexOf(startTabs);
    let indexEnd = content.indexOf('/* SUBCATEGORY PILLS */', indexStart);
    if (indexEnd === -1) indexEnd = indexStart + 2000;
    
    let section = content.substring(indexStart, indexEnd);
    if (section.includes(oldAdultIcon)) {
        section = section.replace(oldAdultIcon, newAdultIcon);
        content = content.substring(0, indexStart) + section + content.substring(indexEnd);
        console.log('Changed Adult tab icon to +18');
    }
}

fs.writeFileSync('src/components/LiveStreamSystem.jsx', content);
