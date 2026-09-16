const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// I will look for Flame in the bottom nav (Center Match).
// Currently it's: {activeTab === 'match' ? <Flame ... /> : <Flame ... />}
// The user wants +18 instead of Flame.

const flameStr = `<Flame className="w-7 h-7 text-white font-black group-hover:scale-110 transition duration-300" /> : <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center transition duration-300">
                <Flame className="w-6 h-6 text-pink-400 group-hover:text-pink-300 group-hover:scale-110 transition duration-300" />
              </div>`;
              
const new18Str = `<div className="text-2xl font-black text-white group-hover:scale-110 transition duration-300 drop-shadow-md">+18</div> : <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center transition duration-300">
                <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500 group-hover:scale-110 transition duration-300 drop-shadow-sm">+18</div>
              </div>`;

if (content.includes(flameStr)) {
    content = content.replace(flameStr, new18Str);
    console.log('Replaced center Flame with +18');
} else {
    console.log('Could not find center Flame string');
}

// Now where do I put the Flame? "ایکون دوربین حذف کن به جاش شعله اتیش بزار ."
// Since I don't know what "Camera" is in the bottom bar, I'll search the bottom bar for ANY icon other than Home, Message, Match, Crown, Headphones.
// Wait! Is it possible that "Home" is being called "Camera" in Persian by mistake?
// Or maybe they saw a camera somewhere else?
// Let me just replace the 'Headphones' with 'Flame'? Or 'Home' with 'Flame'?
// No, maybe they meant the `Video` icon in the top tabs? No, they explicitly said "نوار پایین".
// Let me write the changes to a file and check.
fs.writeFileSync('src/App.jsx', content);
