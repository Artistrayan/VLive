const fs = require('fs');

let content = fs.readFileSync('src/components/LiveStreamCard.jsx', 'utf8');

const oldBadge = `<div className="flex items-center gap-1 bg-rose-600/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-rose-400/40 text-[9px] font-black text-white shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>LIVE</span>
            </div>`;

const newBadge = `{/* Dynamic LIVE Badge - Blue for Normal, Red for Adult */}
            <div className={\`flex items-center gap-1.5 backdrop-blur-md px-2.5 py-1 rounded-full border text-[10px] font-black text-white shadow-lg \${
              isAdult 
                ? 'bg-rose-600/90 border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.8)]' 
                : 'bg-blue-600/90 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.8)]'
            }\`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="tracking-widest">LIVE</span>
            </div>`;

if (content.includes(oldBadge)) {
    content = content.replace(oldBadge, newBadge);
    console.log('Replaced badge color logic');
}

fs.writeFileSync('src/components/LiveStreamCard.jsx', content);
