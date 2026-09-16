const fs = require('fs');

let content = fs.readFileSync('src/components/LiveStreamSystem.jsx', 'utf8');

// I need to update the LIVE badge on the cards to be blue for normal, red for +18.
// Existing badge: 
// <div className="absolute top-2 left-2 z-10 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg shadow-rose-500/50">
//   <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
//   {window.loc('زنده', 'LIVE')}
// </div>

const oldBadgeRegex = /<div className="absolute top-2 left-2 z-10 bg-[^"]*text-white text-\[10px\] font-black px-2 py-0\.5 rounded-full flex items-center gap-1 shadow-lg[^"]*">[\s\S]*?<\/div>/;

const newBadge = `<div className={\`absolute top-2 left-2 z-10 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-lg \${
                    stream.live_type === 'adult' || stream.isVip18 || stream.is18Plus 
                      ? 'bg-rose-600/90 shadow-rose-600/50 border border-rose-500' 
                      : 'bg-blue-600/90 shadow-blue-600/50 border border-blue-500'
                  }\`}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    {window.loc('زنده', 'LIVE')}
                  </div>`;

if (content.match(oldBadgeRegex)) {
    content = content.replace(oldBadgeRegex, newBadge);
    console.log('Replaced LIVE badge colors');
}

fs.writeFileSync('src/components/LiveStreamSystem.jsx', content);
