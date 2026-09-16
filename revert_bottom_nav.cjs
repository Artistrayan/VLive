const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const new18Str = `<div className="text-2xl font-black text-white group-hover:scale-110 transition duration-300 drop-shadow-md">+18</div> : <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center transition duration-300">
                <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500 group-hover:scale-110 transition duration-300 drop-shadow-sm">+18</div>
              </div>`;

const flameStr = `<Flame className="w-7 h-7 text-white font-black group-hover:scale-110 transition duration-300" /> : <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center transition duration-300">
                <Flame className="w-6 h-6 text-pink-400 group-hover:text-pink-300 group-hover:scale-110 transition duration-300" />
              </div>`;

if (content.includes(new18Str)) {
    content = content.replace(new18Str, flameStr);
    console.log('Reverted bottom nav to Flame');
}

fs.writeFileSync('src/App.jsx', content);
