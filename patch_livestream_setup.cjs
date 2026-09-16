const fs = require('fs');
let content = fs.readFileSync('src/components/LiveStreamSystem.jsx', 'utf8');

const setupStart = "/* SELECT LIVE TYPE (Standard vs Adult 18+) */";
if (content.includes(setupStart)) {
    let indexStart = content.indexOf(setupStart);
    let indexEnd = content.indexOf('/* START LIVE BUTTON */', indexStart);
    if (indexEnd === -1) indexEnd = indexStart + 2000;
    
    let section = content.substring(indexStart, indexEnd);
    const oldStandardIcon = '<Video className="w-4 h-4 text-cyan-300" />';
    const newStandardIcon = '<Flame className="w-5 h-5 text-pink-400 drop-shadow-md" />';
    
    const oldAdultIcon = '<Flame className="w-4 h-4 text-amber-400 animate-pulse" />';
    const newAdultIcon = '<span className="text-sm font-black drop-shadow-md">+18</span>';
    
    if (section.includes(oldStandardIcon)) {
        section = section.replace(oldStandardIcon, newStandardIcon);
        console.log('Changed Setup Standard icon');
    }
    if (section.includes(oldAdultIcon)) {
        section = section.replace(oldAdultIcon, newAdultIcon);
        console.log('Changed Setup Adult icon');
    }
    
    content = content.substring(0, indexStart) + section + content.substring(indexEnd);
    fs.writeFileSync('src/components/LiveStreamSystem.jsx', content);
}
