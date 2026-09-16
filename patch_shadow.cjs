const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const oldStr = '<div className="flex items-center justify-around">';
const newStr = '<div className="flex items-center justify-around bg-slate-950/40 backdrop-blur-md border border-slate-700/50 rounded-2xl py-1.5 px-3 shadow-[0_8px_20px_rgba(0,0,0,0.6)] shadow-purple-500/10">';

if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync('src/App.jsx', content);
    console.log('Shadow added around the 3 options.');
} else {
    console.log('Could not find the container div.');
}
