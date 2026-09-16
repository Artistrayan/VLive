const fs = require('fs');

function updateFile(filePath, updateFn) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = updateFn(content);
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log('Updated ' + filePath);
  } else {
    console.log('No changes needed or matching string not found in ' + filePath);
  }
}

// 1. App.jsx: Update Global Background & Bottom Nav Glassmorphism
updateFile('src/App.jsx', (content) => {
  // Update App background to deep dark luxurious #0a0a1a with radial gradient
  content = content.replace(
    'className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-pink-500/30 overflow-x-hidden"',
    'className="min-h-screen bg-[#070714] text-slate-200 font-sans selection:bg-pink-500/30 overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#13112a] via-[#070714] to-black"'
  );

  // Update Stories: Add Gold Border for VIP
  let oldStoryGlow = 'w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400';
  let newStoryGlow = 'w-14 h-14 rounded-full p-[2.5px] ${group.user?.isVip ? "bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 shadow-[0_0_15px_rgba(245,158,11,0.5)]" : "bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400"}';
  
  if (content.includes('className="' + oldStoryGlow)) {
     content = content.replace('className="' + oldStoryGlow, 'className={`' + newStoryGlow + ' transition-transform duration-300 group-hover:scale-105 shadow-md`}');
  }

  // Also remove old transition classes that are hardcoded because I just moved them into the template literal.
  content = content.replace(' transition-transform duration-300 group-hover:scale-105 shadow-md">', '>');
  
  return content;
});

// 2. LiveStreamSystem.jsx: Update the top "Normal Live" and "+18 Live" tabs 
updateFile('src/components/LiveStreamSystem.jsx', (content) => {
  // This is for the main tabs at the top of the stream list
  const tabsBlockRegex = /<div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">[\s\S]*?<\/div>/;
  
  const newTabsBlock = `<div className="grid grid-cols-2 gap-3 bg-white/5 backdrop-blur-2xl p-2 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-rose-500/10 pointer-events-none" />
          <button
            onClick={() => {
              setLiveTypeTab('standard');
              setSelectedSubCategory('all');
            }}
            title={window.loc('پخش استاندارد', 'Standard')}
            className={\`relative z-10 py-3 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 \${
              liveTypeTab === 'standard'
                ? 'bg-blue-600/20 text-blue-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-500/50 scale-105'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
            }\`}
          >
            <div className={\`w-2 h-2 rounded-full \${liveTypeTab === 'standard' ? 'bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,1)]' : 'bg-slate-600'}\`} />
            {window.loc('لایو عادی', 'Normal Live')}
          </button>

          <button
            onClick={() => {
              setLiveTypeTab('adult');
              setSelectedSubCategory('all');
            }}
            title={window.loc('لایو بزرگسالان +۱۸', 'Adult Live +18')}
            className={\`relative z-10 py-3 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 \${
              liveTypeTab === 'adult'
                ? 'bg-rose-900/40 text-rose-300 shadow-[0_0_25px_rgba(225,29,72,0.5)] border border-rose-500/60 scale-105'
                : 'text-slate-500 hover:text-rose-300 hover:bg-rose-950/30 border border-transparent'
            }\`}
          >
            <ShieldAlert className={\`w-4 h-4 \${liveTypeTab === 'adult' ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'text-slate-600'}\`} />
            <span className="tracking-wide">{window.loc('بزرگسالان +۱۸', 'Adult +18')}</span>
          </button>
        </div>`;
        
  if (content.match(tabsBlockRegex)) {
      content = content.replace(tabsBlockRegex, newTabsBlock);
  } else {
      console.log('Regex for tabs block not matched');
  }
  
  // Stream Cards Design Update
  const oldCardClass = 'bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-pink-500/50 transition-all hover:shadow-[0_5px_25px_rgba(236,72,153,0.15)] group relative flex flex-col';
  const newCardClass = 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all hover:shadow-[0_10px_40px_rgba(0,0,0,0.6)] group relative flex flex-col transform hover:-translate-y-1';
  
  content = content.replaceAll(oldCardClass, newCardClass);

  // VIP Stream Glow Effect
  content = content.replace(
      '{stream.isVip && (',
      '{stream.isVip && <div className="absolute inset-0 border-2 border-amber-500/50 rounded-3xl pointer-events-none shadow-[inset_0_0_20px_rgba(245,158,11,0.2)]" />}\n            {stream.isVip && ('
  );

  return content;
});

